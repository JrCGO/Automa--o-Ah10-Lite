/**
 * Utility Helper Functions
 */
class Helpers {
  /**
   * Format CPF with mask
   */
  static formatCPF(cpf) {
    if (!cpf || cpf.length !== 11) return cpf
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  /**
   * Remove CPF formatting
   */
  static cleanCPF(cpf) {
    return cpf ? cpf.replace(/\D/g, "") : ""
  }

  /**
   * Format date to Brazilian format
   */
  static formatDateBR(dateISO) {
    if (!dateISO) return ""
    const [year, month, day] = dateISO.split("-")
    return `${day}/${month}/${year}`
  }

  /**
   * Convert Brazilian date to ISO format
   */
  static dateToISO(dateBR) {
    if (!dateBR) return ""
    const [day, month, year] = dateBR.split("/")
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }

  /**
   * Generate unique ID
   */
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * Debounce function
   */
  static debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  /**
   * Show notification
   */
  static showNotification(message, type = "info", duration = 3000) {
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

  /**
   * Copy text to clipboard
   */
  static async copyToClipboard(text) {
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
  }

  /**
   * Download file
   */
  static downloadFile(content, filename, mimeType = "text/plain") {
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
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validate CPF
   */
  static isValidCPF(cpf) {
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
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  /**
   * Escape HTML
   */
  static escapeHTML(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  /**
   * Escape XML
   */
  static escapeXML(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
  }
}

// Make Helpers globally available
window.Helpers = Helpers
