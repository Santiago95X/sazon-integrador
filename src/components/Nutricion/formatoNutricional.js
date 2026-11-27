const formatoNumero = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 })

export const formatearNumero = (valor) => formatoNumero.format(valor)

export const porcentajeDiario = (valor, valorDiario) =>
  valorDiario ? Math.round((valor / valorDiario) * 100) : null

export const calcularDistribucion = (datosNutricionales) => {
  const buscarValor = (nombre) => datosNutricionales.find((item) => item.nutriente === nombre)?.valor ?? 0
  const kcalMacros = [
    { nombre: 'Proteínas', kcal: buscarValor('Proteínas') * 4, clase: 'proteina' },
    { nombre: 'Carbohidratos', kcal: buscarValor('Carbohidratos totales') * 4, clase: 'carbohidrato' },
    { nombre: 'Grasas', kcal: buscarValor('Grasa total') * 9, clase: 'grasa' },
  ]
  const kcalTotal = kcalMacros.reduce((suma, macro) => suma + macro.kcal, 0)
  const distribucion = kcalMacros.map((macro) => ({
    ...macro,
    porcentaje: kcalTotal ? Math.round((macro.kcal / kcalTotal) * 100) : 0,
  }))
  if (kcalTotal) {
    const ultimo = distribucion[distribucion.length - 1]
    ultimo.porcentaje = 100 - distribucion.slice(0, -1).reduce((suma, macro) => suma + macro.porcentaje, 0)
  }
  return distribucion
}
