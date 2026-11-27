import { porcion, opcionesPorcion, energia, datosNutricionales, alergenos } from './semillaNutricional'

const CLAVE_TABLA_PERFIL = 'sazon-tabla-en-perfil'
const DEMORA_SIMULADA_MS = 600

export function obtenerTablaNutricional() {
  return new Promise((resolver, rechazar) => {
    setTimeout(() => {
      try {
        resolver(structuredClone({ porcion, opcionesPorcion, energia, datosNutricionales, alergenos }))
      } catch (error) {
        rechazar(error)
      }
    }, DEMORA_SIMULADA_MS)
  })
}

export function leerTablaEnPerfil() {
  try {
    const guardado = JSON.parse(sessionStorage.getItem(CLAVE_TABLA_PERFIL))
    if (!guardado || typeof guardado.porcionId !== 'string') return null
    if (guardado.gramos !== undefined && !Number.isInteger(guardado.gramos)) return null
    return guardado
  } catch {
    return null
  }
}

export function guardarTablaEnPerfil(porcionId, gramos) {
  const registro = { porcionId, gramos, fecha: new Date().toISOString() }
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
