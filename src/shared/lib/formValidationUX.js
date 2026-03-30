const getFirstErrorPath = (errors, preferredOrder = []) => {
  if (!errors || typeof errors !== "object") return null;

  for (const field of preferredOrder) {
    if (errors[field]) return field;
  }

  const walk = (obj, parent = "") => {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const path = parent ? `${parent}.${key}` : key;

      if (value && typeof value === "object") {
        if ("type" in value || "message" in value) return path;
        const nested = walk(value, path);
        if (nested) return nested;
      }
    }
    return null;
  };

  return walk(errors);
};

const escapeCssSelector = (value) => {
  if (typeof window !== "undefined" && window.CSS?.escape) {
    return window.CSS.escape(value);
  }
  return value.replace(/([\.#:\[\],=])/g, "\\$1");
};

export const focusAndShakeField = (fieldName) => {
  if (!fieldName || typeof document === "undefined") return;

  const escapedName = escapeCssSelector(fieldName);
  const el = document.querySelector(`[name="${escapedName}"]`);
  if (!el) return;

  el.classList.remove("field-shake-error");
  void el.offsetWidth;
  el.classList.add("field-shake-error");

  el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  if (typeof el.focus === "function") {
    el.focus({ preventScroll: true });
  }

  window.setTimeout(() => {
    el.classList.remove("field-shake-error");
  }, 460);
};

export const handleFormValidationErrors = (errors, preferredOrder = []) => {
  const firstErrorField = getFirstErrorPath(errors, preferredOrder);
  if (firstErrorField) {
    focusAndShakeField(firstErrorField);
  }
  return firstErrorField;
};
