/**
 * Navigation Manager
 * Handles page navigation and mobile menu
 */
const PAGES = {
  REGISTRO_REP_P: "registro-rep-p",
  // Add other pages here
}

class NavigationManager {
  constructor() {
    this.currentPage = PAGES.REGISTRO_REP_P
    this.init()
  }

  /**
   * Initialize navigation manager
   */
  init() {
    this.setupNavigation()
    this.setupMobileMenu()
  }

  /**
   * Setup navigation links
   */
  setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link")

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const page = e.currentTarget.getAttribute("data-page")
        this.navigateToPage(page)
        this.setActiveNav(e.currentTarget)
        this.closeMobileMenu()
      })
    })
  }

  /**
   * Setup mobile menu
   */
  setupMobileMenu() {
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
          this.closeMobileMenu()
        }
      })
    }
  }

  /**
   * Navigate to specific page
   */
  navigateToPage(page) {
    this.currentPage = page

    // Load page content
    if (window.pageLoader) {
      window.pageLoader.loadPage(page)
    }
  }

  /**
   * Set active navigation link
   */
  setActiveNav(activeLink) {
    // Remove active class from all links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })

    // Add active class to clicked link
    activeLink.classList.add("active")
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    const sidebar = document.getElementById("sidebar")
    if (sidebar) {
      sidebar.classList.remove("open")
    }
  }

  /**
   * Get current page
   */
  getCurrentPage() {
    return this.currentPage
  }
}

// Make NavigationManager globally available
window.NavigationManager = NavigationManager
