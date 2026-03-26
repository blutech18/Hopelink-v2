import React from 'react'

let hasForcedReload = false
const retryCache = new Map() // Cache for retry attempts per factory

const isChunkLoadError = (error) => {
  if (!error) return false
  const message = error.message || ''
  return (
    error.name === 'ChunkLoadError' ||
    /Loading chunk [\d]+ failed/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message)
  )
}

/**
 * Wraps React.lazy to gracefully recover from stale chunk references.
 * Retries on chunk load errors without browser refresh.
 */
const lazyWithRetry = (factory) => {
  const factoryKey = factory.toString().slice(0, 50)

  return React.lazy(() => {
    return factory()
      .then((module) => {
        // Successfully loaded — clear any retry state
        retryCache.delete(factoryKey)
        return module
      })
      .catch((error) => {
        console.error('Error loading lazy component:', error)

        const retryCount = retryCache.get(factoryKey) || 0
        retryCache.set(factoryKey, retryCount + 1)

        // Retry up to 3 times for chunk / network errors
        if (isChunkLoadError(error) && retryCount < 3) {
          console.log(`Retrying lazy component load (attempt ${retryCount + 1}/3)...`)
          // Small delay before retry to let network settle
          return new Promise((resolve) => setTimeout(resolve, 500 * (retryCount + 1)))
            .then(() => factory())
            .then((module) => {
              retryCache.delete(factoryKey)
              return module
            })
        }

        // In production, one forced reload as a last resort for chunk errors
        if (!import.meta.env.DEV && isChunkLoadError(error) && !hasForcedReload) {
          hasForcedReload = true
          console.warn('Dynamic import failed after retries, refreshing to fetch the latest assets...')
          setTimeout(() => window.location.reload(), 100)
          return new Promise(() => {}) // suspend until reload
        }

        // Clean up and let ErrorBoundary handle it
        retryCache.delete(factoryKey)
        throw error
      })
  })
}

export default lazyWithRetry

