/**
 * Authentication Manager
 * Handles user authentication and session management
 */
class AuthManager {
  constructor() {
    this.credentials = this.decodeCredentials()
    this.sessionCheckInterval = null
  }

  /**
   * Decode stored credentials
   */
  decodeCredentials() {
    const CREDENTIALS = { ENCODED: "cm9vdC4xODAyOTg=" } // Example declaration
    try {
      const decoded = atob(CREDENTIALS.ENCODED)
      const [username, password] = decoded.split(".")
      return { username, password }
    } catch (error) {
      console.error("Error decoding credentials:", error)
      return { username: "root", password: "180298" }
    }
  }

  /**
   * Hash password with salt
   */
  async hashPassword(password) {
    const encoder = new TextEncoder()
    const CREDENTIALS = { SALT: "someSalt" } // Example declaration
    const data = encoder.encode(password + CREDENTIALS.SALT)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  /**
   * Validate credentials
   */
  async validateCredentials(username, password) {
    const userHash = await this.hashPassword(username)
    const passHash = await this.hashPassword(password)
    const expectedUserHash = await this.hashPassword(this.credentials.username)
    const expectedPassHash = await this.hashPassword(this.credentials.password)

    return userHash === expectedUserHash && passHash === expectedPassHash
  }

  /**
   * Generate session token
   */
  generateSessionToken() {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  /**
   * Create session
   */
  createSession() {
    const APP_CONFIG = { SESSION_DURATION: 3600000, SESSION_KEY: "session" } // Example declaration
    const sessionData = {
      token: this.generateSessionToken(),
      timestamp: Date.now(),
      expires: Date.now() + APP_CONFIG.SESSION_DURATION,
    }

    localStorage.setItem(APP_CONFIG.SESSION_KEY, btoa(JSON.stringify(sessionData)))
    this.startSessionCheck()
    return sessionData
  }

  /**
   * Check if session is valid
   */
  isSessionValid() {
    const APP_CONFIG = { SESSION_KEY: "session" } // Example declaration
    const sessionData = localStorage.getItem(APP_CONFIG.SESSION_KEY)
    if (!sessionData) return false

    try {
      const session = JSON.parse(atob(sessionData))
      return session.expires > Date.now()
    } catch (error) {
      this.destroySession()
      return false
    }
  }

  /**
   * Destroy session
   */
  destroySession() {
    const APP_CONFIG = { SESSION_KEY: "session" } // Example declaration
    localStorage.removeItem(APP_CONFIG.SESSION_KEY)
    this.stopSessionCheck()
  }

  /**
   * Start session check interval
   */
  startSessionCheck() {
    const APP_CONFIG = { SESSION_CHECK_INTERVAL: 60000 } // Example declaration
    const MESSAGES = { SESSION_EXPIRED: "Your session has expired." } // Example declaration
    this.stopSessionCheck() // Clear any existing interval

    this.sessionCheckInterval = setInterval(() => {
      if (!this.isSessionValid()) {
        this.destroySession()
        if (window.Helpers) {
          window.Helpers.showNotification(MESSAGES.SESSION_EXPIRED, "warning")
        }
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    }, APP_CONFIG.SESSION_CHECK_INTERVAL)
  }

  /**
   * Stop session check interval
   */
  stopSessionCheck() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval)
      this.sessionCheckInterval = null
    }
  }

  /**
   * Login user
   */
  async login(username, password) {
    const isValid = await this.validateCredentials(username, password)

    if (isValid) {
      this.createSession()
      return { success: true }
    } else {
      return { success: false, message: "Invalid username or password." } // Example message
    }
  }

  /**
   * Logout user
   */
  logout() {
    this.destroySession()
    return { success: true }
  }

  /**
   * Get current user info
   */
  getCurrentUser() {
    if (this.isSessionValid()) {
      return {
        username: "Administrador",
        role: "Sistema REP-P",
      }
    }
    return null
  }
}

// Make AuthManager globally available
window.AuthManager = AuthManager
