const CLAVE_TABLA_PERFIL = 'sazon-tabla-en-perfil'

export function leerTablaEnPerfil() {
  try {
    const guardado = JSON.parse(sessionStorage.getItem(CLAVE_TABLA_PERFIL))
    return guardado && typeof guardado.porcionId === 'string' ? guardado : null
  } catch {
    return null
  }
}

export function guardarTablaEnPerfil(porcionId) {
  const registro = { porcionId, fecha: new Date().toISOString() }
  try {
    sessionStorage.setItem(CLAVE_TABLA_PERFIL, JSON.stringify(registro))
    return registro
  } catch {
    return registro
  }
}

export function quitarTablaDelPerfil() {
  try {
    sessionStorage.removeItem(CLAVE_TABLA_PERFIL)
    return true
  } catch {
    return false
  }
}
