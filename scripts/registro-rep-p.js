/**
 * Registro REP-P Module
 * Handles employee record generation functionality
 */
window.RegistroRepP = {
  funcionarios: [],
  registrosGerados: "",

  init: function () {
    this.setupEventListeners()
    this.updateTotalRecords()
    this.updateEmployeeList()
  },

  setupEventListeners: function () {
    const importBtn = document.getElementById("importBtn")
    const gerarBtn = document.getElementById("gerarBtn")
    const copiarBtn = document.getElementById("copiarBtn")
    const quantidadeInput = document.getElementById("quantidade")

    if (importBtn) {
      importBtn.addEventListener("click", () => this.importEmployees())
    }

    if (gerarBtn) {
      gerarBtn.addEventListener("click", () => this.generateRecords())
    }

    if (copiarBtn) {
      copiarBtn.addEventListener("click", () => this.copyRecords())
    }

    if (quantidadeInput) {
      quantidadeInput.addEventListener("input", () => this.updateTotalRecords())
    }
  },

  importEmployees: function () {
    const nomesText = document.getElementById("nomes")?.value.trim()
    const cpfsText = document.getElementById("cpfs")?.value.trim()

    if (!nomesText || !cpfsText) {
      window.Utils.showNotification("Por favor, preencha os nomes e CPFs dos funcionários", "warning")
      return
    }

    const nomes = nomesText
      .split("\n")
      .map((nome) => nome.trim())
      .filter((nome) => nome)
    const cpfs = cpfsText
      .split("\n")
      .map((cpf) => window.Utils.cleanCPF(cpf))
      .filter((cpf) => cpf)

    if (nomes.length !== cpfs.length) {
      window.Utils.showNotification("A quantidade de nomes deve ser igual à quantidade de CPFs", "error")
      return
    }

    // Validate CPFs
    const invalidCPFs = cpfs.filter((cpf) => !window.Utils.isValidCPF(cpf))
    if (invalidCPFs.length > 0) {
      window.Utils.showNotification(`CPFs inválidos encontrados: ${invalidCPFs.join(", ")}`, "error")
      return
    }

    // Clear existing employees and add new ones
    this.funcionarios = []
    for (let i = 0; i < nomes.length; i++) {
      this.funcionarios.push({
        id: window.Utils.generateId(),
        nome: nomes[i],
        cpf: cpfs[i],
      })
    }

    this.updateEmployeeList()
    this.updateTotalRecords()

    // Clear text areas
    document.getElementById("nomes").value = ""
    document.getElementById("cpfs").value = ""

    window.Utils.showNotification(`${this.funcionarios.length} funcionários importados com sucesso!`, "success")
  },

  removeEmployee: function (id) {
    this.funcionarios = this.funcionarios.filter((func) => func.id !== id)
    this.updateEmployeeList()
    this.updateTotalRecords()
    window.Utils.showNotification("Funcionário removido", "info")
  },

  updateEmployeeList: function () {
    const lista = document.getElementById("listaFuncionarios")
    const count = document.getElementById("funcionarioCount")

    if (!lista || !count) return

    count.textContent = this.funcionarios.length

    if (this.funcionarios.length === 0) {
      lista.innerHTML = ""
      return
    }

    lista.innerHTML = this.funcionarios
      .map(
        (func) => `
            <div class="funcionario-item">
                <div class="funcionario-info">
                    <div class="funcionario-nome">${window.Utils.escapeHTML(func.nome)}</div>
                    <div class="funcionario-cpf">${window.Utils.formatCPF(func.cpf)}</div>
                </div>
                <div class="funcionario-actions">
                    <button class="btn btn-small btn-secondary" onclick="window.RegistroRepP.removeEmployee('${func.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Remover
                    </button>
                </div>
            </div>
        `,
      )
      .join("")
  },

  updateTotalRecords: function () {
    const quantidade = Number.parseInt(document.getElementById("quantidade")?.value) || 0
    const totalElement = document.getElementById("totalRegistros")

    if (totalElement) {
      const total = this.funcionarios.length * quantidade
      totalElement.textContent = total
    }
  },

  generateRecords: function () {
    if (this.funcionarios.length === 0) {
      window.Utils.showNotification("Adicione funcionários antes de gerar registros", "warning")
      return
    }

    const dataHoraInput = document.getElementById("dataHora")
    const quantidadeInput = document.getElementById("quantidade")

    if (!dataHoraInput?.value) {
      window.Utils.showNotification("Selecione a data e hora inicial", "warning")
      return
    }

    const dataHoraInicial = new Date(dataHoraInput.value)
    const quantidade = Number.parseInt(quantidadeInput?.value) || 1

    const registros = []
    let dataHoraAtual = new Date(dataHoraInicial)

    for (let i = 0; i < quantidade; i++) {
      this.funcionarios.forEach((func) => {
        const registro = this.createRecord(func, dataHoraAtual)
        registros.push(registro)
      })

      // Increment time by 1 minute for next batch
      dataHoraAtual = new Date(dataHoraAtual.getTime() + 60000)
    }

    this.registrosGerados = registros.join("\n")

    const resultadoTextarea = document.getElementById("resultado")
    if (resultadoTextarea) {
      resultadoTextarea.value = this.registrosGerados
    }

    window.Utils.showNotification(`${registros.length} registros gerados com sucesso!`, "success")
  },

  createRecord: (funcionario, dataHora) => {
    const ano = dataHora.getFullYear()
    const mes = String(dataHora.getMonth() + 1).padStart(2, "0")
    const dia = String(dataHora.getDate()).padStart(2, "0")
    const hora = String(dataHora.getHours()).padStart(2, "0")
    const minuto = String(dataHora.getMinutes()).padStart(2, "0")

    return `offl_dh:{hora:${hora}:${minuto},data:${ano}-${mes}-${dia}},ident_func:${funcionario.cpf},nome_func:${funcionario.nome}`
  },

  copyRecords: async function () {
    if (!this.registrosGerados) {
      window.Utils.showNotification("Gere os registros primeiro", "warning")
      return
    }

    const success = await window.Utils.copyToClipboard(this.registrosGerados)

    if (success) {
      window.Utils.showNotification("Registros copiados para a área de transferência!", "success")

      // Show copy indicator
      const indicator = document.getElementById("copyIndicator")
      if (indicator) {
        indicator.classList.add("show")
        setTimeout(() => {
          indicator.classList.remove("show")
        }, 2000)
      }
    } else {
      window.Utils.showNotification("Erro ao copiar registros", "error")
    }
  },
}
