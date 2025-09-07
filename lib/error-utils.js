/**
 * Error Handling Utilities for Gadi-Ghar
 * Provides comprehensive error handling, logging, and user-friendly error messages
 */

// Error types for better error categorization
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  DATABASE: 'DATABASE_ERROR',
  FILE_UPLOAD: 'FILE_UPLOAD_ERROR',
  AI_SERVICE: 'AI_SERVICE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

// User-friendly error messages
export const ErrorMessages = {
  [ErrorTypes.NETWORK]: 'Connection problem. Please check your internet connection and try again.',
  [ErrorTypes.AUTHENTICATION]: 'Please sign in to continue.',
  [ErrorTypes.AUTHORIZATION]: 'You don\'t have permission to perform this action.',
  [ErrorTypes.VALIDATION]: 'Please check your input and try again.',
  [ErrorTypes.DATABASE]: 'We\'re experiencing technical difficulties. Please try again later.',
  [ErrorTypes.FILE_UPLOAD]: 'Failed to upload file. Please try again with a smaller file.',
  [ErrorTypes.AI_SERVICE]: 'AI service is temporarily unavailable. Please try again later.',
  [ErrorTypes.UNKNOWN]: 'Something went wrong. Please try again.'
}

/**
 * Custom Error class with additional context
 */
export class GadiGharError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, details = {}) {
    super(message)
    this.name = 'GadiGharError'
    this.type = type
    this.details = details
    this.timestamp = new Date().toISOString()
    this.errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      details: this.details,
      timestamp: this.timestamp,
      errorId: this.errorId,
      stack: this.stack
    }
  }
}

/**
 * Determines error type based on error message or instance
 */
export function getErrorType(error) {
  if (!error) return ErrorTypes.UNKNOWN

  const message = error.message?.toLowerCase() || ''
  
  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return ErrorTypes.NETWORK
  }
  
  if (message.includes('unauthorized') || message.includes('not authenticated')) {
    return ErrorTypes.AUTHENTICATION
  }
  
  if (message.includes('forbidden') || message.includes('permission')) {
    return ErrorTypes.AUTHORIZATION
  }
  
  if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
    return ErrorTypes.VALIDATION
  }
  
  if (message.includes('prisma') || message.includes('database') || message.includes('sql')) {
    return ErrorTypes.DATABASE
  }
  
  if (message.includes('upload') || message.includes('file') || message.includes('image')) {
    return ErrorTypes.FILE_UPLOAD
  }
  
  if (message.includes('gemini') || message.includes('ai') || message.includes('model')) {
    return ErrorTypes.AI_SERVICE
  }

  return error.type || ErrorTypes.UNKNOWN
}

/**
 * Gets user-friendly error message
 */
export function getUserFriendlyMessage(error) {
  const errorType = getErrorType(error)
  return ErrorMessages[errorType] || ErrorMessages[ErrorTypes.UNKNOWN]
}

/**
 * Logs error to console and external services
 */
export function logError(error, context = {}) {
  const errorData = {
    ...error,
    context,
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    timestamp: new Date().toISOString()
  }

  // Always log to console
  console.error('Application Error:', errorData)

  // In production, send to external error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement external error tracking
    // sendToErrorTrackingService(errorData)
  }

  return errorData
}

/**
 * Wraps async functions with error handling
 */
export function withErrorHandling(fn, context = {}) {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      const gadiGharError = error instanceof GadiGharError 
        ? error 
        : new GadiGharError(error.message, getErrorType(error), { originalError: error })
      
      logError(gadiGharError, context)
      throw gadiGharError
    }
  }
}

/**
 * Creates a safe async function that returns result or error
 */
export function safeAsync(fn, context = {}) {
  return async (...args) => {
    try {
      const result = await fn(...args)
      return { success: true, data: result, error: null }
    } catch (error) {
      const gadiGharError = error instanceof GadiGharError 
        ? error 
        : new GadiGharError(error.message, getErrorType(error), { originalError: error })
      
      logError(gadiGharError, context)
      
      return { 
        success: false, 
        data: null, 
        error: {
          message: getUserFriendlyMessage(gadiGharError),
          type: gadiGharError.type,
          errorId: gadiGharError.errorId
        }
      }
    }
  }
}

/**
 * Validates required fields and throws validation error if missing
 */
export function validateRequired(data, requiredFields, customMessages = {}) {
  const missingFields = []
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field)
    }
  }
  
  if (missingFields.length > 0) {
    const message = customMessages.general || 
      `Missing required fields: ${missingFields.join(', ')}`
    
    throw new GadiGharError(message, ErrorTypes.VALIDATION, { missingFields })
  }
}

/**
 * Rate limiting error
 */
export class RateLimitError extends GadiGharError {
  constructor(remaining = 0, reset = 0) {
    super('Too many requests. Please try again later.', ErrorTypes.NETWORK, { remaining, reset })
    this.name = 'RateLimitError'
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends GadiGharError {
  constructor(message = 'Authentication required') {
    super(message, ErrorTypes.AUTHENTICATION)
    this.name = 'AuthenticationError'
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends GadiGharError {
  constructor(message = 'Insufficient permissions') {
    super(message, ErrorTypes.AUTHORIZATION)
    this.name = 'AuthorizationError'
  }
}

/**
 * Validation error
 */
export class ValidationError extends GadiGharError {
  constructor(message, fields = []) {
    super(message, ErrorTypes.VALIDATION, { fields })
    this.name = 'ValidationError'
  }
}
