// Semilla de datos nutricionales por porción (datos simulados mientras no haya API).
// valorDiario: referencia para una dieta de 2000 kcal; null si no aplica.
// nivel: 0 = nutriente principal, 1 = subcomponente (se muestra con sangría).

export const porcion = {
  descripcion: '1 unidad',
  gramos: 100,
}

export const energia = { valor: 250, unidad: 'kcal', valorDiario: 2000 }

export const datosNutricionales = [
  { id: 1, nutriente: 'Grasa total', valor: 10.2, unidad: 'g', valorDiario: 78, nivel: 0, grupo: 'macro' },
  { id: 2, nutriente: 'Grasa saturada', valor: 3.1, unidad: 'g', valorDiario: 20, nivel: 1, grupo: 'macro' },
  { id: 3, nutriente: 'Grasa trans', valor: 0, unidad: 'g', valorDiario: null, nivel: 1, grupo: 'macro' },
  { id: 4, nutriente: 'Colesterol', valor: 25, unidad: 'mg', valorDiario: 300, nivel: 0, grupo: 'macro' },
  { id: 5, nutriente: 'Sodio', valor: 450, unidad: 'mg', valorDiario: 2300, nivel: 0, grupo: 'macro' },
  { id: 6, nutriente: 'Carbohidratos totales', valor: 30, unidad: 'g', valorDiario: 275, nivel: 0, grupo: 'macro' },
  { id: 7, nutriente: 'Fibra dietaria', valor: 2.5, unidad: 'g', valorDiario: 28, nivel: 1, grupo: 'macro' },
  { id: 8, nutriente: 'Azúcares totales', valor: 8, unidad: 'g', valorDiario: null, nivel: 1, grupo: 'macro' },
  { id: 9, nutriente: 'Azúcares añadidos', valor: 5, unidad: 'g', valorDiario: 50, nivel: 1, grupo: 'macro' },
  { id: 10, nutriente: 'Proteínas', valor: 15.5, unidad: 'g', valorDiario: 50, nivel: 0, grupo: 'macro' },
  { id: 11, nutriente: 'Calcio', valor: 120, unidad: 'mg', valorDiario: 1300, nivel: 0, grupo: 'micro' },
  { id: 12, nutriente: 'Hierro', valor: 1.8, unidad: 'mg', valorDiario: 18, nivel: 0, grupo: 'micro' },
  { id: 13, nutriente: 'Potasio', valor: 280, unidad: 'mg', valorDiario: 4700, nivel: 0, grupo: 'micro' },
]

export const alergenos = ['Gluten', 'Leche']
