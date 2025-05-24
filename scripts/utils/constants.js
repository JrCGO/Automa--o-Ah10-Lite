/**
 * Application Constants
 */
const APP_CONFIG = {
  NAME: "REP-P Tools",
  VERSION: "2.0.0",
  SESSION_KEY: "repPSession",
  THEME_KEY: "repPTheme",
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  SESSION_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
}

const PAGES = {
  REGISTRO_REP_P: "registro-rep-p",
  FUNCIONARIOS_REP_P: "funcionarios-rep-p",
  CONVERSOR_USUARIO_REP_P: "conversor-usuario-rep-p",
}

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
}

const MESSAGES = {
  LOGIN_ERROR: "Usuário ou senha incorretos",
  SESSION_EXPIRED: "Sua sessão expirou. Faça login novamente.",
  LOGOUT_CONFIRM: "Tem certeza que deseja sair?",
  LOADING: "Carregando...",
  SUCCESS: "Operação realizada com sucesso!",
  ERROR: "Ocorreu um erro. Tente novamente.",
}

const CREDENTIALS = {
  // Encoded credentials for security
  ENCODED: "cm9vdC4xODAyOTg=", // base64 encoded "root.180298"
  SALT: "repPSalt2024",
}
