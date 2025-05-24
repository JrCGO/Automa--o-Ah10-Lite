/**
 * Funcionários REP-P Module
 * Handles employee JSON generation functionality
 */
class FuncionariosRepP {
  constructor() {
    this.funcionarios = []
    this.jsonGerado = ""
  }

  /**
   * Initialize module
   */
  init() {
    this.setupEventListeners()
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const gerarBtn = document.getElementById("gerarBtnFunc")
    const copiarBtn = document.getElementById("copiarBtnFunc")
    const downloadBtn = document.getElementById("downloadBtnFunc")

    if (gerarBtn) {
      gerarBtn.addEventListener("click", () => this.generateJSON())
    }

    if (copiarBtn) {
      copiarBtn.addEventListener("click", () => this.copyJSON())
    }

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => this.downloadJSON())
    }
  }

  /**
   * Generate JSON from form data
   */
  generateJSON() {
    const nomes = this.getTextareaLines("nomes-func")
    const cpfs = this.getTextareaLines("cpfs-func")
    const matriculas = this.getTextareaLines("matrs")

    if (!nomes.length || !cpfs.length || !matriculas.length) {
      window.Helpers.showNotification("Preencha pelo menos os campos obrigatórios: Nome, CPF e Matrícula", "warning")
      return
    }

    if (nomes.length !== cpfs.length || nomes.length !== matriculas.length) {
      window.Helpers.showNotification("Todos os campos obrigatórios devem ter a mesma quantidade de linhas", "error")
      return
    }

    // Validate CPFs
    const invalidCPFs = cpfs.filter((cpf) => !window.Helpers.isValidCPF(cpf))
    if (invalidCPFs.length > 0) {
      window.Helpers.showNotification(`CPFs inválidos encontrados: ${invalidCPFs.join(", ")}`, "error")
      return
    }

    // Get optional fields
    const mifareDados = this.getTextareaLines("mifare")
    const senhas = this.getTextareaLines("passwd")
    const bioDados = this.getTextareaLines("biodados")

    // Generate employee objects
    this.funcionarios = []
    for (let i = 0; i < nomes.length; i++) {
      const funcionario = {
        nome: nomes[i],
        cpf: window.Helpers.cleanCPF(cpfs[i]),
        matricula: matriculas[i],
      }

      // Add optional fields if provided
      if (mifareDados[i]) funcionario.mifareDado = mifareDados[i]
      if (senhas[i]) funcionario.senha = senhas[i]
      if (bioDados[i]) funcionario.bioDados = bioDados[i]

      this.funcionarios.push(funcionario)
    }

    // Generate JSON
    this.jsonGerado = JSON.stringify(this.funcionarios, null, 2)

    // Display result
    const resultadoTextarea = document.getElementById("resultado-func")
    if (resultadoTextarea) {
      resultadoTextarea.value = this.jsonGerado
    }

    window.Helpers.showNotification(`JSON gerado com ${this.funcionarios.length} funcionários!`, "success")
  }

  /**
   * Get lines from textarea
   */
  getTextareaLines(id) {
    const textarea = document.getElementById(id)
    if (!textarea || !textarea.value.trim()) return []

    return textarea.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
  }

  /**
   * Copy JSON to clipboard
   */
  async copyJSON() {
    if (!this.jsonGerado) {
      window.Helpers.showNotification("Gere o JSON primeiro", "warning")
      return
    }

    const success = await window.Helpers.copyToClipboard(this.jsonGerado)

    if (success) {
      window.Helpers.showNotification("JSON copiado para a área de transferência!", "success")

      // Show copy indicator
      const indicator = document.getElementById("copyIndicator-func")
      if (indicator) {
        indicator.classList.add("show")
        setTimeout(() => {
          indicator.classList.remove("show")
        }, 2000)
      }
    } else {
      window.Helpers.showNotification("Erro ao copiar JSON", "error")
    }
  }

  /**
   * Download JSON file
   */
  downloadJSON() {
    if (!this.jsonGerado) {
      window.Helpers.showNotification("Gere o JSON primeiro", "warning")
      return
    }

    window.Helpers.downloadFile(this.jsonGerado, "funcionarios.json", "application/json")
    window.Helpers.showNotification("Download iniciado!", "success")
  }
}

// Create global instance
window.FuncionariosRepP = new FuncionariosRepP()
