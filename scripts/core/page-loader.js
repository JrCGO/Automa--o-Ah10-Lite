/**
 * Page Loader
 * Dynamically loads page content
 */
const PAGES = {
  REGISTRO_REP_P: "registroRepP",
  FUNCIONARIOS_REP_P: "funcionariosRepP",
  CONVERSOR_USUARIO_REP_P: "conversorUsuarioRepP",
}

class PageLoader {
  constructor() {
    this.pageContent = document.getElementById("pageContent")
    this.pages = {
      [PAGES.REGISTRO_REP_P]: this.createRegistroRepPPage,
      [PAGES.FUNCIONARIOS_REP_P]: this.createFuncionariosRepPPage,
      [PAGES.CONVERSOR_USUARIO_REP_P]: this.createConversorUsuarioRepPPage,
    }
  }

  /**
   * Load page content
   */
  loadPage(pageId) {
    if (this.pages[pageId]) {
      this.pageContent.innerHTML = ""
      const pageElement = this.pages[pageId]()
      this.pageContent.appendChild(pageElement)

      // Initialize page-specific functionality
      this.initializePage(pageId)
    }
  }

  /**
   * Initialize page-specific functionality
   */
  initializePage(pageId) {
    switch (pageId) {
      case PAGES.REGISTRO_REP_P:
        if (window.RegistroRepP) {
          window.RegistroRepP.init()
        }
        break
      case PAGES.FUNCIONARIOS_REP_P:
        if (window.FuncionariosRepP) {
          window.FuncionariosRepP.init()
        }
        break
      case PAGES.CONVERSOR_USUARIO_REP_P:
        if (window.ConversorUsuarioRepP) {
          window.ConversorUsuarioRepP.init()
        }
        break
    }
  }

  /**
   * Create Registro REP-P page
   */
  createRegistroRepPPage() {
    const page = document.createElement("div")
    page.innerHTML = `
            <div class="page-header">
                <h1>Gerador de Registros de Funcionários</h1>
                <p>Crie registros de ponto para múltiplos colaboradores de forma rápida e eficiente</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 4.354a4 4 0 110 5.292V4.354zM12 10.373a4 4 0 110 5.292V10.373zM12 16.319a4 4 0 110 5.292V16.319z"></path>
                        </svg>
                    </div>
                    <h2>Inserção de Funcionários</h2>
                </div>
                <div class="card-content">
                    <div class="grid">
                        <div class="form-group">
                            <label for="nomes">Nomes dos Colaboradores:</label>
                            <textarea id="nomes" placeholder="Digite um nome por linha&#10;Ex: Gestor 00001&#10;Colaborador 00002"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="cpfs">CPFs dos Colaboradores:</label>
                            <textarea id="cpfs" placeholder="Digite um CPF por linha&#10;Ex: 93544955083&#10;12345678901"></textarea>
                        </div>
                    </div>
                    <div class="actions">
                        <button id="importBtn" class="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Importar Funcionários
                        </button>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"></path>
                        </svg>
                    </div>
                    <h2>Configuração dos Registros</h2>
                </div>
                <div class="card-content">
                    <div class="grid">
                        <div class="form-group">
                            <label for="dataHora">Data e Hora Inicial:</label>
                            <input type="datetime-local" id="dataHora">
                        </div>
                        <div class="form-group">
                            <label for="quantidade">Quantidade de Registros:</label>
                            <input type="number" id="quantidade" min="1" value="10">
                            <div class="info-text">
                                Total: <strong id="totalRegistros">0</strong> registros serão gerados
                            </div>
                        </div>
                    </div>
                    <div class="actions">
                        <button id="gerarBtn" class="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 3v18"></path>
                                <path d="M17 8l-5-5-5 5"></path>
                                <path d="M17 16l-5 5-5-5"></path>
                            </svg>
                            Gerar Registros
                        </button>
                        <button id="copiarBtn" class="btn btn-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copiar Registros
                        </button>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 010 7.75"></path>
                        </svg>
                    </div>
                    <h2>Funcionários Adicionados <span id="funcionarioCount" class="funcionario-count">0</span></h2>
                </div>
                <div class="card-content">
                    <div id="listaFuncionarios" class="lista-funcionarios">
                        <!-- Funcionários serão adicionados aqui -->
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <h2>Resultado</h2>
                </div>
                <div class="card-content">
                    <div class="resultado-container">
                        <textarea id="resultado" readonly placeholder="Os registros gerados aparecerão aqui..."></textarea>
                        <div id="copyIndicator" class="copy-indicator">Copiado!</div>
                    </div>
                </div>
            </div>
        `
    return page
  }

  /**
   * Create Funcionários REP-P page
   */
  createFuncionariosRepPPage() {
    const page = document.createElement("div")
    page.innerHTML = `
            <div class="page-header">
                <h1>Gerador de Funcionários JSON</h1>
                <p>Crie arquivos JSON com dados de funcionários para importação no sistema REP-P</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <h2>Dados Obrigatórios</h2>
                </div>
                <div class="card-content">
                    <div class="grid-three">
                        <div class="form-group">
                            <label for="nomes-func">Nome dos Funcionários:</label>
                            <textarea id="nomes-func" placeholder="Digite um nome por linha&#10;Ex: João Silva&#10;Maria Souza"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="cpfs-func">CPF dos Funcionários:</label>
                            <textarea id="cpfs-func" placeholder="Digite um CPF por linha&#10;Ex: 12345678900&#10;98765432100"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="matrs">Matrícula:</label>
                            <textarea id="matrs" placeholder="Digite uma matrícula por linha&#10;Ex: 2000001&#10;2000002"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                    <h2>Dados Opcionais</h2>
                </div>
                <div class="card-content">
                    <div class="grid-three">
                        <div class="form-group">
                            <label for="mifare">MiFareDado:</label>
                            <textarea id="mifare" placeholder="Digite um código por linha&#10;Ex: ABCD1234&#10;EFGH5678"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="passwd">Senha:</label>
                            <textarea id="passwd" placeholder="Digite uma senha por linha&#10;Ex: senha123&#10;senha456"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="biodados">BioDados:</label>
                            <textarea id="biodados" placeholder="Digite um template por linha&#10;Ex: TemplateXYZ&#10;TemplateABC"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 3v18"/>
                            <path d="M17 8l-5-5-5 5"/>
                            <path d="M17 16l-5 5-5-5"/>
                        </svg>
                    </div>
                    <h2>Ações</h2>
                </div>
                <div class="card-content">
                    <div class="actions">
                        <button id="gerarBtnFunc" class="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10,9 9,9 8,9"/>
                            </svg>
                            Gerar JSON
                        </button>
                        <button id="copiarBtnFunc" class="btn btn-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                            Copiar JSON
                        </button>
                        <button id="downloadBtnFunc" class="btn btn-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            Download JSON
                        </button>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                    </div>
                    <h2>Resultado JSON</h2>
                </div>
                <div class="card-content">
                    <div class="resultado-container">
                        <textarea id="resultado-func" readonly placeholder="O JSON gerado aparecerá aqui..."></textarea>
                        <div id="copyIndicator-func" class="copy-indicator">Copiado!</div>
                    </div>
                </div>
            </div>
        `
    return page
  }

  /**
   * Create Conversor Usuário REP-P page
   */
  createConversorUsuarioRepPPage() {
    const page = document.createElement("div")
    page.innerHTML = `
            <div class="page-header">
                <h1>Conversor Del Usuário REP-P</h1>
                <p>Importe e visualize registros de ponto do sistema REP-P</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </div>
                    <h2>Importar Registros de Ponto</h2>
                </div>
                <div class="card-content">
                    <div class="form-group">
                        <label for="fileInput">Selecione o arquivo de registros (.txt):</label>
                        <input type="file" id="fileInput" accept=".txt" class="file-input">
                    </div>
                    <div class="filtros">
                        <div class="form-group">
                            <label for="filtroData">Filtrar por data (DD/MM/AAAA):</label>
                            <div class="filtro-container">
                                <input type="text" id="filtroData" placeholder="Ex: 15/05/2023">
                                <button class="btn btn-primary" id="filtrarBtn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    Filtrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <h2>Importar Dados de Funcionários</h2>
                </div>
                <div class="card-content">
                    <div class="form-group">
                        <label for="funcionariosInput">Selecione arquivo CSV ou XML com dados dos funcionários:</label>
                        <input type="file" id="funcionariosInput" accept=".csv,.xml" class="file-input">
                        <div class="info-text">
                            Arquivo deve conter colunas: nome, cpf (outros campos serão ignorados)
                        </div>
                    </div>
                    <div class="actions">
                        <button id="vincularBtn" class="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            Vincular Funcionários
                        </button>
                    </div>
                    <div id="vinculacaoStatus" class="vinculacao-status"></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <h2>Registros de Ponto <span id="registroCount" class="registro-count">0</span></h2>
                </div>
                <div class="card-content">
                    <div class="tabela-container">
                        <table id="tabelaRegistros">
                            <thead>
                                <tr>
                                    <th>CPF</th>
                                    <th>Nome</th>
                                    <th>Data do Registro</th>
                                    <th>Hora do Registro</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Dados serão adicionados aqui -->
                            </tbody>
                        </table>
                    </div>
                    <div class="actions">
                        <button id="exportarCSVBtn" class="btn btn-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            Baixar CSV
                        </button>
                        <button id="exportarXMLBtn" class="btn btn-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10,9 9,9 8,9"/>
                            </svg>
                            Baixar XML
                        </button>
                        <button id="exportarTXTBtn" class="btn btn-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10,9 9,9 8,9"/>
                            </svg>
                            Baixar TXT
                        </button>
                    </div>
                </div>
            </div>
        `
    return page
  }
}

// Make PageLoader globally available
window.PageLoader = PageLoader
