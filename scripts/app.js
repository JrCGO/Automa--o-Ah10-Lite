/**
 * Main Application Controller
 * Orchestrates all application components
 */
const PAGES = {
  REGISTRO_REP_P: "registro-rep-p",
}

const MESSAGES = {
  LOADING: "Carregando...",
  LOGOUT_CONFIRM: "Tem certeza de que deseja sair?",
}

class App {
  constructor() {
    this.authManager = new window.AuthManager()
    this.themeManager = new window.ThemeManager()
    this.navigationManager = new window.NavigationManager()
    this.pageLoader = new window.PageLoader()

    // Make pageLoader globally available
    window.pageLoader = this.pageLoader

    this.init()
  }

  /**
   * Initialize application
   */
  async init() {
    try {
      // Show loading screen
      this.showLoading()

      // Check authentication
      if (this.authManager.isSessionValid()) {
        await this.initializeApp()
      } else {
        this.showLogin()
      }

      // Setup global event listeners
      this.setupGlobalEventListeners()
    } catch (error) {
      console.error("Error initializing app:", error)
      window.Helpers.showNotification("Erro ao inicializar aplicação", "error")
    } finally {
      this.hideLoading()
    }
  }

  /**
   * Show loading screen
   */
  showLoading() {
    const loadingScreen = document.getElementById("loadingScreen")
    if (loadingScreen) {
      loadingScreen.classList.remove("hidden")
    }
  }

  /**
   * Hide loading screen
   */
  hideLoading() {
    const loadingScreen = document.getElementById("loadingScreen")
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add("hidden")
      }, 500)
    }
  }

  /**
   * Show login interface
   */
  showLogin() {
    const loginContainer = document.getElementById("loginContainer")
    const appContainer = document.getElementById("appContainer")

    if (loginContainer && appContainer) {
      loginContainer.classList.remove("hidden")
      appContainer.classList.add("hidden")

      this.setupLoginEventListeners()
    }
  }

  /**
   * Show main application
   */
  async initializeApp() {
    const loginContainer = document.getElementById("loginContainer")
    const appContainer = document.getElementById("appContainer")

    if (loginContainer && appContainer) {
      loginContainer.classList.add("hidden")
      appContainer.classList.remove("hidden")

      // Load initial page
      this.pageLoader.loadPage(PAGES.REGISTRO_REP_P)

      // Setup logout functionality
      this.setupLogoutEventListener()
    }
  }

  /**
   * Setup login event listeners
   */
  setupLoginEventListeners() {
    const loginForm = document.getElementById("loginForm")
    const usernameInput = document.getElementById("username")
    const passwordInput = document.getElementById("password")
    const errorMessage = document.getElementById("errorMessage")

    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        await this.handleLogin()
      })
    }
    // Clear error message on input
    ;[usernameInput, passwordInput].forEach((input) => {
      if (input) {
        input.addEventListener("input", () => {
          if (errorMessage) {
            errorMessage.classList.add("hidden")
          }
        })
      }
    })
  }

  /**
   * Handle login submission
   */
  async handleLogin() {
    const usernameInput = document.getElementById("username")
    const passwordInput = document.getElementById("password")
    const loginBtn = document.getElementById("loginBtn")
    const errorMessage = document.getElementById("errorMessage")

    if (!usernameInput || !passwordInput || !loginBtn) return

    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if (!username || !password) {
      this.showLoginError("Preencha todos os campos")
      return
    }

    // Show loading state
    loginBtn.disabled = true
    loginBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
            </svg>
            ${MESSAGES.LOADING}
        `

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const result = await this.authManager.login(username, password)

      if (result.success) {
        await this.initializeApp()
        window.Helpers.showNotification("Login realizado com sucesso!", "success")
      } else {
        this.showLoginError(result.message)
      }
    } catch (error) {
      console.error("Login error:", error)
      this.showLoginError("Erro interno. Tente novamente.")
    } finally {
      this.resetLoginButton()
    }
  }

  /**
   * Show login error
   */
  showLoginError(message) {
    const errorMessage = document.getElementById("errorMessage")
    if (errorMessage) {
      errorMessage.textContent = message
      errorMessage.classList.remove("hidden")
    }
  }

  /**
   * Reset login button
   */
  resetLoginButton() {
    const loginBtn = document.getElementById("loginBtn")
    if (loginBtn) {
      loginBtn.disabled = false
      loginBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Entrar
            `
    }
  }

  /**
   * Setup logout event listener
   */
  setupLogoutEventListener() {
    const logoutBtn = document.getElementById("logoutBtn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.handleLogout())
    }
  }

  /**
   * Handle logout
   */
  handleLogout() {
    if (confirm(MESSAGES.LOGOUT_CONFIRM)) {
      this.authManager.logout()
      window.Helpers.showNotification("Logout realizado com sucesso!", "info")

      // Reload page to reset state
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Handle keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + K for search (future feature)
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        // TODO: Implement search functionality
      }

      // ESC to close mobile menu
      if (e.key === "Escape") {
        this.navigationManager.closeMobileMenu()
      }
    })

    // Handle window resize
    window.addEventListener(
      "resize",
      window.Helpers.debounce(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
          this.navigationManager.closeMobileMenu()
        }
      }, 250),
    )

    // Handle visibility change (tab focus)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.authManager.isSessionValid()) {
        // Refresh session when tab becomes visible
        console.log("Tab became visible, session is valid")
      }
    })
  }
}

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new App()
})

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason)
  window.Helpers.showNotification("Erro inesperado na aplicação", "error")
})

// Handle global errors
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error)
  window.Helpers.showNotification("Erro inesperado na aplicação", "error")
})
