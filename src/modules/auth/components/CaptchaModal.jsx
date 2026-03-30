import React from 'react'

const HCAPTCHA_SCRIPT_SRC = 'https://hcaptcha.com/1/api.js?render=explicit'

const CaptchaModal = ({ open, siteKey, onVerified, onClose, title = 'Verification required', description = 'Please complete the CAPTCHA to continue.' }) => {
  const widgetRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!open) return
    setError(null)

    function ensureScript() {
      return new Promise((resolve, reject) => {
        if (window.hcaptcha) return resolve()
        const existing = document.querySelector(`script[src="${HCAPTCHA_SCRIPT_SRC}"]`)
        if (existing) {
          existing.addEventListener('load', () => resolve())
          existing.addEventListener('error', reject)
          return
        }
        const script = document.createElement('script')
        script.src = HCAPTCHA_SCRIPT_SRC
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load hCaptcha'))
        document.head.appendChild(script)
      })
    }

    async function renderWidget() {
      if (!siteKey) {
        setError('Missing CAPTCHA site key')
        return
      }
      try {
        await ensureScript()
        if (!containerRef.current) return
        // Reset previous widget if exists
        if (widgetRef.current != null && window.hcaptcha) {
          try {
            window.hcaptcha.reset(widgetRef.current)
          } catch {}
        }
        const id = window.hcaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            onVerified?.(token)
          },
          'error-callback': () => {
            setError('CAPTCHA error, please try again.')
          },
          'expired-callback': () => {
            setError('CAPTCHA expired, please solve again.')
          }
        })
        widgetRef.current = id
      } catch (e) {
        setError(e.message || 'Failed to initialize CAPTCHA')
      }
    }

    renderWidget()
  }, [open, siteKey, onVerified])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl p-6" style={{backgroundColor: '#001a5c'}}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="text-sm mb-4" style={{color: '#e8ebc4'}}>{description}</p>
        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}
        <div className="flex items-center justify-center">
          <div ref={containerRef}></div>
        </div>
      </div>
    </div>
  )
}

export default CaptchaModal


