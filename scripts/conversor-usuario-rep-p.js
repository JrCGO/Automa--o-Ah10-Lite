/**
 * Conversor Usuário REP-P Module
 * Handles time record conversion and employee linking
 */
window.ConversorUsuarioRepP = {
  allRecords: [],
  filteredRecords: [],
  employees: [],

  init: function () {
    this.setupEventListeners()
    this.updateRecordCount()
  },

  setupEventListeners: function () {
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
  },

  processRecordsFile: function (event) {
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
            dateFormatted: window.Utils.formatDateBR(dateMatch[1]),
            time: timeMatch[1],
            name: null,
          })
        }
      }

      this.filteredRecords = [...this.allRecords]
      this.renderTable()
      this.updateRecordCount()

      window.Utils.showNotification(`${this.allRecords.length} registros carregados!`, "success")
    }

    reader.readAsText(file)
  },

  processEmployeesFile: function (event) {
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
  },

  processCSV: function (content) {
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
        const cpf = window.Utils.cleanCPF(values[cpfIndex])

        if (name && cpf) {
          this.employees.push({ name, cpf })
        }
      }
    }

    this.showStatus("success", `${this.employees.length} funcionários carregados do CSV`)
  },

  processXML: function (content) {
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
          currentEmployee.cpf = window.Utils.cleanCPF(text)
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
  },

  findColumnIndex: (columns, possibleNames) => {
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i].toLowerCase()
      if (possibleNames.some((name) => column.includes(name))) {
        return i
      }
    }
    return -1
  },

  isNameTag: (tagName) => {
    const nameTags = ["nome", "name", "funcionario", "employee", "pessoa"]
    return nameTags.some((tag) => tagName.includes(tag))
  },

  isCpfTag: (tagName) => {
    const cpfTags = ["cpf", "documento", "doc", "document"]
    return cpfTags.some((tag) => tagName.includes(tag))
  },

  linkEmployees: function () {
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
  },

  normalizeText: (text) => {
    if (!text) return ""
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  },

  filterByDate: function () {
    const filter = document.getElementById("filtroData")?.value.trim()

    if (!filter) {
      this.filteredRecords = [...this.allRecords]
    } else {
      if (filter.includes("/")) {
        this.filteredRecords = this.allRecords.filter((r) => r.dateFormatted === filter)
      } else {
        try {
          const dateISO = window.Utils.dateToISO(filter)
          this.filteredRecords = this.allRecords.filter((r) => r.date === dateISO)
        } catch {
          this.filteredRecords = this.allRecords.filter((r) => r.dateFormatted.includes(filter))
        }
      }
    }

    this.renderTable()
    this.updateRecordCount()
  },

  renderTable: function () {
    const tbody = document.querySelector("#tabelaRegistros tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    if (this.filteredRecords.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Nenhum registro encontrado</td></tr>'
      return
    }

    this.filteredRecords.forEach((record) => {
      const cpfFormatted = window.Utils.formatCPF(record.cpf)
      const nameDisplay = record.name
        ? `<span class="nome-vinculado">${window.Utils.escapeHTML(record.name)}</span>`
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
  },

  updateRecordCount: function () {
    const countElement = document.getElementById("registroCount")
    if (countElement) {
      countElement.textContent = this.filteredRecords.length
    }
  },

  showStatus: (type, message) => {
    const statusDiv = document.getElementById("vinculacaoStatus")
    if (statusDiv) {
      statusDiv.className = `vinculacao-status ${type}`
      statusDiv.textContent = message
      statusDiv.style.display = "block"

      setTimeout(() => {
        statusDiv.style.display = "none"
      }, 5000)
    }
  },

  exportCSV: function () {
    if (this.filteredRecords.length === 0) {
      window.Utils.showNotification("Não há registros para exportar", "warning")
      return
    }

    let csv = "CPF,Nome,Data,Hora\n"

    this.filteredRecords.forEach((record) => {
      const name = record.name || "Não vinculado"
      csv += `${record.cpf},"${name}",${record.dateFormatted},${record.time}\n`
    })

    window.Utils.downloadFile(csv, "registros_ponto.csv", "text/csv")
    window.Utils.showNotification("Arquivo CSV baixado!", "success")
  },

  exportXML: function () {
    if (this.filteredRecords.length === 0) {
      window.Utils.showNotification("Não há registros para exportar", "warning")
      return
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<registros>\n'

    this.filteredRecords.forEach((record) => {
      const name = record.name || "Não vinculado"
      xml += "  <registro>\n"
      xml += `    <cpf>${record.cpf}</cpf>\n`
      xml += `    <nome>${window.Utils.escapeXML(name)}</nome>\n`
      xml += `    <data>${record.dateFormatted}</data>\n`
      xml += `    <hora>${record.time}</hora>\n`
      xml += "  </registro>\n"
    })

    xml += "</registros>"

    window.Utils.downloadFile(xml, "registros_ponto.xml", "text/xml")
    window.Utils.showNotification("Arquivo XML baixado!", "success")
  },

  exportTXT: function () {
    if (this.filteredRecords.length === 0) {
      window.Utils.showNotification("Não há registros para exportar", "warning")
      return
    }

    let txt = "REGISTROS DE PONTO\n"
    txt += "==================\n\n"

    this.filteredRecords.forEach((record) => {
      const name = record.name || "Não vinculado"
      txt += `CPF: ${window.Utils.formatCPF(record.cpf)}\n`
      txt += `Nome: ${name}\n`
      txt += `Data: ${record.dateFormatted}\n`
      txt += `Hora: ${record.time}\n`
      txt += "-------------------\n"
    })

    window.Utils.downloadFile(txt, "registros_ponto.txt", "text/plain")
    window.Utils.showNotification("Arquivo TXT baixado!", "success")
  },
}
