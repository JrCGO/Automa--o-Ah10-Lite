/**
 * Theme Manager
 * Handles light/dark theme switching
 */
const APP_CONFIG = {
  THEME_KEY: "theme",
}

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
}

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem(APP_CONFIG.THEME_KEY) || THEMES.LIGHT
    this.init()
  }

  /**
   * Initialize theme manager
   */
  init() {
    this.applyTheme(this.currentTheme)
    this.setupThemeToggles()
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    this.currentTheme = theme
    localStorage.setItem(APP_CONFIG.THEME_KEY, theme)
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    this.applyTheme(newTheme)
  }

  /**
   * Setup theme toggle buttons
   */
  setupThemeToggles() {
    const toggleButtons = document.querySelectorAll(".theme-toggle")

    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.toggleTheme()
      })
    })
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme
  }
}

// Make ThemeManager globally available
window.ThemeManager = ThemeManager
