/**
 * Conversor Usuário REP-P Module
 * Handles time record conversion and employee linking
 */
class ConversorUsuarioRepP {
  constructor() {
    this.allRecords = []
    this.filteredRecords = []
    this.employees = []
  }

  /**
   * Initialize module
   */
  init() {
    this.setupEventListeners()
    this.updateRecordCount()
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const fileInput = document.getElementById("fileInput")
    const funcionariosInput = document.getElementById("funcionariosInput")
    const filtrarBtn = document.getElementById("filtrarBtn")
    const vincularBtn = document.getElementById("vincularBtn")
    const exportarCSVBtn = document.getElementById("exportarCSVBtn")
    const exportarXMLBtn = document.getElementById("exportarXMLBtn")
    const exportarTXTBtn = document.getElementById("exportarTXTBtn")

    if (fileInput) {
      fileInput.addEventListener("change", (e) => this.processRecordsFile(e))
    }

    if (funcionariosInput) {
      funcionariosInput.addEventListener("change", (e) => this.processEmployeesFile(e))
    }

    if (filtrarBtn) {
      filtrarBtn.addEventListener("click", () => this.filterByDate())
    }

    if (vincularBtn) {
      vincularBtn.addEventListener("click", () => this.linkEmployees())
    }

    if (exportarCSVBtn) {
      exportarCSVBtn.addEventListener("click", () => this.exportCSV())
    }

    if (exportarXMLBtn) {
      exportarXMLBtn.addEventListener("click", () => this.exportXML())
    }

    if (exportarTXTBtn) {
      exportarTXTBtn.addEventListener("click", () => this.exportTXT())
    }
  }

  /**
   * Process records file
   */
  processRecordsFile(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const lines = e.target.result.split("\n")
      this.allRecords = []

      for (let i = 0; i < lines.length; i += 2) {
        const line = lines[i]
        const timeMatch = line.match(/offl_dh:\{hora:(\d{2}:\d{2})/)
        const dateMatch = line.match(/data:(\d{4}-\d{2}-\d{2})/)
        const cpfMatch = line.match(/ident_func:(\d{11})/)

        if (timeMatch && dateMatch && cpfMatch) {
          this.allRecords.push({
            cpf: cpfMatch[1],
            date: dateMatch[1],
            dateFormatted: window.Helpers.formatDateBR(dateMatch[1]),
            time: timeMatch[1],
            name: null,
          })
        }
      }

      this.filteredRecords = [...this.allRecords]
      this.renderTable()
      this.updateRecordCount()

      window.Helpers.showNotification(`${this.allRecords.length} registros carregados!`, "success")
    }

    reader.readAsText(file)
  }

  /**
   * Process employees file
   */
  processEmployeesFile(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const extension = file.name.split(".").pop().toLowerCase()

      if (extension === "csv") {
        this.processCSV(content)
      } else if (extension === "xml") {
        this.processXML(content)
      }
    }

    reader.readAsText(file)
  }

  /**
   * Process CSV file
   */
  processCSV(content) {
    const lines = content.split("\n")
    const header = lines[0].toLowerCase()

    const separator = header.includes(";") ? ";" : ","
    const columns = header.split(separator).map((col) => col.trim().replace(/"/g, ""))

    const nameIndex = this.findColumnIndex(columns, ["nome", "name", "funcionario"])
    const cpfIndex = this.findColumnIndex(columns, ["cpf", "documento", "doc"])

    if (nameIndex === -1 || cpfIndex === -1) {
      this.showStatus("error", 'Arquivo CSV deve conter colunas "nome" e "cpf"')
      return
    }

    this.employees = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(separator).map((val) => val.trim().replace(/"/g, ""))

      if (values.length > Math.max(nameIndex, cpfIndex)) {
        const name = values[nameIndex]
        const cpf = window.Helpers.cleanCPF(values[cpfIndex])

        if (name && cpf) {
          this.employees.push({ name, cpf })
        }
      }
    }

    this.showStatus("success", `${this.employees.length} funcionários carregados do CSV`)
  }

  /**
   * Process XML file
   */
  processXML(content) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(content, "text/xml")

      const elements = xmlDoc.querySelectorAll("*")
      this.employees = []

      let currentEmployee = {}

      elements.forEach((element) => {
        const tagName = element.tagName.toLowerCase()
        const text = element.textContent.trim()

        if (this.isNameTag(tagName) && text) {
          currentEmployee.name = text
        } else if (this.isCpfTag(tagName) && text) {
          currentEmployee.cpf = window.Helpers.cleanCPF(text)
        }

        if (currentEmployee.name && currentEmployee.cpf) {
          this.employees.push({ ...currentEmployee })
          currentEmployee = {}
        }
      })

      this.showStatus("success", `${this.employees.length} funcionários carregados do XML`)
    } catch (error) {
      this.showStatus("error", "Erro ao processar arquivo XML")
    }
  }

  /**
   * Find column index
   */
  findColumnIndex(columns, possibleNames) {
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i].toLowerCase()
      if (possibleNames.some((name) => column.includes(name))) {
        return i
      }
    }
    return -1
  }

  /**
   * Check if tag is name tag
   */
  isNameTag(tagName) {
    const nameTags = ["nome", "name", "funcionario", "employee", "pessoa"]
    return nameTags.some((tag) => tagName.includes(tag))
  }

  /**
   * Check if tag is CPF tag
   */
  isCpfTag(tagName) {
    const cpfTags = ["cpf", "documento", "doc", "document"]
    return cpfTags.some((tag) => tagName.includes(tag))
  }

  /**
   * Link employees to records
   */
  linkEmployees() {
    if (this.employees.length === 0) {
      this.showStatus("error", "Carregue primeiro um arquivo de funcionários")
      return
    }

    if (this.allRecords.length === 0) {
      this.showStatus("error", "Carregue primeiro um arquivo de registros de ponto")
      return
    }

    let linked = 0

    this.allRecords.forEach((record) => {
      const employee = this.employees.find(
        (emp) => emp.cpf === record.cpf || this.normalizeText(emp.name) === this.normalizeText(record.name),
      )

      if (employee) {
        record.name = employee.name
        linked++
      }
    })

    this.filteredRecords = [...this.allRecords]
    this.renderTable()
    this.showStatus("success", `${linked} registros vinculados com sucesso`)
  }

  /**
   * Normalize text for comparison
   */
  normalizeText(text) {
    if (!text) return ""
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  }

  /**
   * Filter records by date
   */
  filterByDate() {
    const filter = document.getElementById("filtroData")?.value.trim()

    if (!filter) {
      this.filteredRecords = [...this.allRecords]
    } else {
      if (filter.includes("/")) {
        this.filteredRecords = this.allRecords.filter((r) => r.dateFormatted === filter)
      } else {
        try {
          const dateISO = window.Helpers.dateToISO(filter)
          this.filteredRecords = this.allRecords.filter((r) => r.date === dateISO)
        } catch {
          this.filteredRecords = this.allRecords.filter((r) => r.dateFormatted.includes(filter))
        }
      }
    }

    this.renderTable()
    this.updateRecordCount()
  }

  /**
   * Render records table
   */
  renderTable() {
    const tbody = document.querySelector("#tabelaRegistros tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    if (this.filteredRecords.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Nenhum registro encontrado</td></tr>'
      return
    }

    this.filteredRecords.forEach((record) => {
      const cpfFormatted = window.Helpers.formatCPF(record.cpf)
      const nameDisplay = record.name
        ? `<span class="nome-vinculado">${window.Helpers.escapeHTML(record.name)}</span>`
        : '<span class="nome-nao-vinculado">Não vinculado</span>'

      const row = `
                <tr>
                    <td>${cpfFormatted}</td>
                    <td>${nameDisplay}</td>
                    <td>${record.dateFormatted}</td>
                    <td>${record.time}</td>
                </tr>
            `
      tbody.insertAdjacentHTML("beforeend", row)
    })
  }

  /**
   * Update record count
   */
  updateRecordCount() {
    const countElement = document.getElementById("registroCount")
    if (countElement) {
      countElement.textContent = this.filteredRecords.length
    }
  }

  /**
   * Show status message
   */
  showStatus(type, message) {
    const statusDiv = document.getElementById("vinculacaoStatus")
    if (statusDiv) {
      statusDiv.className = `vinculacao-status ${type}`
      statusDiv.textContent = message
      statusDiv.style.display = "block"

      setTimeout(() => {
        statusDiv.style.display = "none"
      }, 5000)
    }
  }

  /**
   * Export to CSV
   */
  exportCSV() {
    if (this.filteredRecords.length === 0) {
      window.Helpers.showNotification("Não há registros para exportar", "warning")
      return
    }

    let csv = "CPF,Nome,Data,Hora\n"

    this.filteredRecords.forEach((record) => {
      const name = record.name || "Não vinculado"
      csv += `${record.cpf},"${name}",${record.dateFormatted},${record.time}\n`
    })

    window.Helpers.downloadFile(csv, "registros_ponto.csv", "text/csv")
    window.Helpers.showNotification("Arquivo CSV baixado!", "success")
  }

  /**
   * Export to XML
   */
  exportXML() {
    if (this.filteredRecords.length === 0) {
      window.Helpers.showNotification("Não há registros para exportar", "warning")
      return
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<registros>\n'

    this.filteredRecords.forEach((record) => {
      const name = record.name || "Não vinculado"
      xml += "  <registro>\n"
      xml += `    <cpf>${record.cpf}</cpf>\n`
      xml += `    <nome>${window.Helpers.escapeXML(name)}</nome>\n`
      xml += `    <data>${record.dateFormatted}</data>\n`
      xml += `    <hora>${record.time}</hora>\n`
      xml += "  </registro>\n"
    })

    xml += "</registros>"

    window.Helpers.downloadFile(xml, "registros_ponto.xml", "text/xml")
    window.Helpers.showNotification("Arquivo XML baixado!", "success")
  }

  /**
   * Export to TXT
   */
  exportTXT() {
    if (this.filteredRecords.length === 0) {
      window.Helpers.showNotification("Não há registros para exportar", "warning")
      return
    }

    let txt = "REGISTROS DE PONTO\n"
    txt += "==================\n\n"

    this.filteredRecords.forEach((record) => {
      const name = record.name || "Não vinculado"
      txt += `CPF: ${window.Helpers.formatCPF(record.cpf)}\n`
      txt += `Nome: ${name}\n`
      txt += `Data: ${record.dateFormatted}\n`
      txt += `Hora: ${record.time}\n`
      txt += "-------------------\n"
    })

    window.Helpers.downloadFile(txt, "registros_ponto.txt", "text/plain")
    window.Helpers.showNotification("Arquivo TXT baixado!", "success")
  }
}

// Create global instance
window.ConversorUsuarioRepP = new ConversorUsuarioRepP()
