import { useEffect, useRef, useState, useCallback } from 'react'

// Hook for managing focus trap within a component
export function useFocusTrap(isActive = false) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    function handleTabKey(e) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return containerRef
}

// Hook for keyboard navigation
export function useKeyboardNavigation(handlers = {}) {
  useEffect(() => {
    function handleKeyDown(e) {
      const handler = handlers[e.key]
      if (handler) {
        handler(e)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}

// Hook for screen reader announcements
export function useScreenReader() {
  const [announcement, setAnnouncement] = useState('')

  const announce = useCallback((message, priority = 'polite') => {
    setAnnouncement('')
    setTimeout(() => {
      setAnnouncement(message)
    }, 100)
  }, [])

  return { announcement, announce }
}

// Hook for managing skip links
export function useSkipLinks(links = []) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const skipLink = document.querySelector('[data-skip-link]')
        if (skipLink) {
          skipLink.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return links
}

// Utility function to check color contrast
export function getContrastRatio(color1, color2) {
  // Convert hex to RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Calculate relative luminance
  function getLuminance(rgb) {
    const { r, g, b } = rgb
    const [rs, gs, bs] = [r, g, b].map(c => {
      c /= 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return 1

  const lum1 = getLuminance(rgb1)
  const lum2 = getLuminance(rgb2)

  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)

  return (brightest + 0.05) / (darkest + 0.05)
}

// Utility function to check if contrast ratio meets WCAG guidelines
export function meetsContrastRequirement(ratio, level = 'AA', size = 'normal') {
  const requirements = {
    AA: {
      normal: 4.5,
      large: 3
    },
    AAA: {
      normal: 7,
      large: 4.5
    }
  }

  return ratio >= requirements[level][size]
}

// Utility to generate accessible IDs
export function generateId(prefix = 'element') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// Hook for managing ARIA attributes
export function useAriaAttributes(element, attributes = {}) {
  useEffect(() => {
    if (!element.current) return

    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        element.current.setAttribute(`aria-${key}`, value)
      } else {
        element.current.removeAttribute(`aria-${key}`)
      }
    })
  }, [element, attributes])
}

// Component for screen reader only text
export function ScreenReaderOnly({ children, ...props }) {
  return (
    <span
      className="sr-only"
      {...props}
    >
      {children}
    </span>
  )
}

// Component for live region announcements
export function LiveRegion({ children, priority = 'polite', ...props }) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      {...props}
    >
      {children}
    </div>
  )
}

// Component for skip links
export function SkipLink({ href, children, ...props }) {
  return (
    <a
      href={href}
      data-skip-link
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg transition-all"
      {...props}
    >
      {children}
    </a>
  )
}

// High contrast mode detection
export function useHighContrastMode() {
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setHighContrast(mediaQuery.matches)

    const handleChange = (e) => setHighContrast(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return highContrast
}

// Reduced motion detection
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return reducedMotion
}
