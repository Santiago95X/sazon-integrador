// Servicio de la tabla nutricional (datos simulados en sessionStorage mientras no haya API).

const CLAVE_TABLA_PERFIL = 'sazon-tabla-en-perfil'

// Devuelve { porcionId } si la tabla está agregada al perfil, o null si no lo está
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
  } catch {
    // Sin almacenamiento disponible: el estado vive solo en pantalla
  }
  return registro
}

export function quitarTablaDelPerfil() {
  try {
    sessionStorage.removeItem(CLAVE_TABLA_PERFIL)
  } catch {
    // Sin almacenamiento disponible: nada que borrar
  }
}
