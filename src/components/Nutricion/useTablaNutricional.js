import { useEffect, useState } from 'react'
import { obtenerTablaNutricional } from './tablaNutricionalServicio'

export function useTablaNutricional() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let activo = true
    obtenerTablaNutricional()
      .then((respuesta) => {
        if (!activo) return
        setDatos(respuesta)
        setCargando(false)
      })
      .catch(() => {
        if (!activo) return
        setError('No pudimos cargar la información nutricional.')
        setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [intento])

  const reintentar = () => {
    setError(null)
    setCargando(true)
    setIntento((valor) => valor + 1)
  }

  return { datos, cargando, error, reintentar }
}
