/**
 * Main Application Controller
 * Handles authentication, navigation, and page loading
 */

// Application state
const currentUser = null
let currentTheme = localStorage.getItem("theme") || "light"

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Show loading screen
  showLoading()

  // Initialize theme
  initializeTheme()

  // Check authentication
  setTimeout(() => {
    if (isAuthenticated()) {
      showMainApp()
    } else {
      showLogin()
    }
    hideLoading()
  }, 1000)
}

// Loading functions
function showLoading() {
  document.getElementById("loadingScreen").classList.remove("hidden")
}

function hideLoading() {
  document.getElementById("loadingScreen").classList.add("hidden")
}

// Authentication functions
function isAuthenticated() {
  const session = localStorage.getItem("repPSession")
  if (!session) return false

  try {
    const sessionData = JSON.parse(atob(session))
    return sessionData.expires > Date.now()
  } catch {
    return false
  }
}

function login(username, password) {
  // Simple authentication (in production, use proper authentication)
  if (username === "root" && password === "180298") {
    const sessionData = {
      user: "Administrador",
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }
    localStorage.setItem("repPSession", btoa(JSON.stringify(sessionData)))
    return true
  }
  return false
}

function logout() {
  localStorage.removeItem("repPSession")
  showNotification("Logout realizado com sucesso!", "info")
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

// UI functions
function showLogin() {
  document.getElementById("loginContainer").classList.remove("hidden")
  document.getElementById("appContainer").classList.add("hidden")

  // Setup login form
  const loginForm = document.getElementById("loginForm")
  loginForm.addEventListener("submit", handleLogin)
}

function showMainApp() {
  document.getElementById("loginContainer").classList.add("hidden")
  document.getElementById("appContainer").classList.remove("hidden")

  // Setup navigation
  setupNavigation()
  setupMobileMenu()
  setupLogout()

  // Load initial page
  loadPage("registro-rep-p")
}

function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const loginBtn = document.getElementById("loginBtn")
  const errorMessage = document.getElementById("errorMessage")

  if (!username || !password) {
    showLoginError("Preencha todos os campos")
    return
  }

  // Show loading state
  loginBtn.disabled = true
  loginBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
        </svg>
        Carregando...
    `

  setTimeout(() => {
    if (login(username, password)) {
      showMainApp()
      showNotification("Login realizado com sucesso!", "success")
    } else {
      showLoginError("Usuário ou senha incorretos")
    }

    // Reset button
    loginBtn.disabled = false
    loginBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Entrar
        `
  }, 1000)
}

function showLoginError(message) {
  const errorMessage = document.getElementById("errorMessage")
  errorMessage.textContent = message
  errorMessage.classList.remove("hidden")
}

// Navigation functions
function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const page = e.currentTarget.getAttribute("data-page")
      loadPage(page)
      setActiveNav(e.currentTarget)
      closeMobileMenu()
    })
  })
}

function setupMobileMenu() {
  const menuToggle = document.getElementById("mobileMenuToggle")
  const sidebar = document.getElementById("sidebar")

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open")
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        !sidebar.contains(e.target) &&
        e.target !== menuToggle &&
        sidebar.classList.contains("open")
      ) {
        closeMobileMenu()
      }
    })
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja sair?")) {
        logout()
      }
    })
  }
}

function loadPage(pageId) {
  const pageContent = document.getElementById("pageContent")

  // Show loading
  pageContent.innerHTML = '<div class="loading-spinner"></div>'

  // Load page content
  fetch(`pages/${pageId}.html`)
    .then((response) => response.text())
    .then((html) => {
      pageContent.innerHTML = html

      // Initialize page-specific functionality
      switch (pageId) {
        case "registro-rep-p":
          if (window.RegistroRepP) {
            window.RegistroRepP.init()
          }
          break
        case "funcionarios-rep-p":
          if (window.FuncionariosRepP) {
            window.FuncionariosRepP.init()
          }
          break
        case "conversor-usuario-rep-p":
          if (window.ConversorUsuarioRepP) {
            window.ConversorUsuarioRepP.init()
          }
          break
      }
    })
    .catch((error) => {
      console.error("Error loading page:", error)
      pageContent.innerHTML = '<div class="error-message">Erro ao carregar página</div>'
    })
}

function setActiveNav(activeLink) {
  // Remove active class from all links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })

  // Add active class to clicked link
  activeLink.classList.add("active")
}

function closeMobileMenu() {
  const sidebar = document.getElementById("sidebar")
  if (sidebar) {
    sidebar.classList.remove("open")
  }
}

// Theme functions
function initializeTheme() {
  applyTheme(currentTheme)
  setupThemeToggles()
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme)
  currentTheme = theme
  localStorage.setItem("theme", theme)
}

function toggleTheme() {
  const newTheme = currentTheme === "light" ? "dark" : "light"
  applyTheme(newTheme)
}

function setupThemeToggles() {
  const toggleButtons = document.querySelectorAll(".theme-toggle")
  toggleButtons.forEach((button) => {
    button.addEventListener("click", toggleTheme)
  })
}

// Utility functions
function showNotification(message, type = "info", duration = 3000) {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Add styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    zIndex: "10000",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
  })

  // Set background color based on type
  const colors = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  }
  notification.style.backgroundColor = colors[type] || colors.info

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after duration
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, duration)
}

// Utility functions for other modules
window.Utils = {
  formatCPF: (cpf) => {
    if (!cpf || cpf.length !== 11) return cpf
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  },

  cleanCPF: (cpf) => (cpf ? cpf.replace(/\D/g, "") : ""),

  formatDateBR: (dateISO) => {
    if (!dateISO) return ""
    const [year, month, day] = dateISO.split("-")
    return `${day}/${month}/${year}`
  },

  dateToISO: (dateBR) => {
    if (!dateBR) return ""
    const [day, month, year] = dateBR.split("/")
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  },

  generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2),

  isValidCPF: function (cpf) {
    cpf = this.cleanCPF(cpf)

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false
    }

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.charAt(10))) return false

    return true
  },

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand("copy")
        document.body.removeChild(textArea)
        return true
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
    }
  },

  downloadFile: (content, filename, mimeType = "text/plain") => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    const timestamp = new Date().toISOString().split("T")[0]
    const [name, ext] = filename.split(".")
    const finalFilename = `${name}_${timestamp}.${ext}`

    link.setAttribute("href", url)
    link.setAttribute("download", finalFilename)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  },

  escapeHTML: (text) => {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  },

  escapeXML: (text) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;"),

  showNotification: showNotification,
}
