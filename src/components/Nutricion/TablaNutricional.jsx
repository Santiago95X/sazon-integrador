import { porcion, energia, datosNutricionales, alergenos } from './semillaNutricional';

// Tabla nutricional por porción (HU 4.1.1). Estilos en nutricion.css, bloque 1.

const formatoNumero = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 });

const porcentajeDiario = (valor, valorDiario) =>
  valorDiario ? Math.round((valor / valorDiario) * 100) : null;

// Calorías aportadas por cada macronutriente (4 kcal/g proteína y carbohidrato, 9 kcal/g grasa)
const buscarValor = (nombre) => datosNutricionales.find((item) => item.nutriente === nombre)?.valor ?? 0;
const kcalMacros = [
  { nombre: 'Proteínas', kcal: buscarValor('Proteínas') * 4, clase: 'proteina' },
  { nombre: 'Carbohidratos', kcal: buscarValor('Carbohidratos totales') * 4, clase: 'carbohidrato' },
  { nombre: 'Grasas', kcal: buscarValor('Grasa total') * 9, clase: 'grasa' },
];
const kcalTotalMacros = kcalMacros.reduce((suma, macro) => suma + macro.kcal, 0);
// El último macro toma lo que falta para que la suma siempre dé 100%
const distribucion = kcalMacros.map((macro) => ({
  ...macro,
  porcentaje: kcalTotalMacros ? Math.round((macro.kcal / kcalTotalMacros) * 100) : 0,
}));
if (kcalTotalMacros) {
  const ultimo = distribucion[distribucion.length - 1];
  ultimo.porcentaje = 100 - distribucion.slice(0, -1).reduce((suma, macro) => suma + macro.porcentaje, 0);
}

const FilaNutriente = ({ item }) => {
  const porcentaje = porcentajeDiario(item.valor, item.valorDiario);
  return (
    <tr className={item.nivel === 1 ? 'nutricion-tabla-fila-sub' : undefined}>
      <th scope="row" className="nutricion-tabla-nombre">{item.nutriente}</th>
      <td className="nutricion-tabla-num">
        <span className="nutricion-tabla-valor">{formatoNumero.format(item.valor)}</span>
        <span className="nutricion-tabla-unidad">{item.unidad}</span>
      </td>
      <td>
        {porcentaje === null ? (
          <span className="nutricion-tabla-sin-vd">—</span>
        ) : (
          <div className="nutricion-tabla-vd">
            <div
              className="nutricion-tabla-barra"
              role="progressbar"
              aria-valuenow={porcentaje}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${item.nutriente}: ${porcentaje}% del valor diario`}
            >
              <div
                className="nutricion-tabla-barra-relleno"
                style={{ width: `${Math.min(porcentaje, 100)}%` }}
              ></div>
            </div>
            <span className="nutricion-tabla-porcentaje">{porcentaje}%</span>
          </div>
        )}
      </td>
    </tr>
  );
};

const TablaNutricional = () => {
  const macros = datosNutricionales.filter((item) => item.grupo === 'macro');
  const micros = datosNutricionales.filter((item) => item.grupo === 'micro');

  return (
    <div className="nutricion-tabla-card">
      <div className="nutricion-tabla-encabezado">
        <div>
          <p className="nutricion-tabla-eyebrow">Información nutricional</p>
          <h3 className="nutricion-tabla-titulo font-poppins">Detalle por porción</h3>
          <p className="nutricion-tabla-porcion">
            Tamaño de porción: {porcion.descripcion} ({porcion.gramos} g)
          </p>
        </div>
        <div className="nutricion-tabla-energia">
          <span className="nutricion-tabla-energia-valor font-poppins">
            {formatoNumero.format(energia.valor)}
          </span>
          <span className="nutricion-tabla-energia-unidad">
            {energia.unidad} · {porcentajeDiario(energia.valor, energia.valorDiario)}% VD
          </span>
        </div>
      </div>

      <div className="nutricion-tabla-distribucion">
        <p className="nutricion-tabla-subtitulo">Distribución de energía</p>
        <div className="nutricion-tabla-distribucion-barra">
          {distribucion.map((macro) => (
            <div
              key={macro.nombre}
              className={`nutricion-tabla-segmento es-${macro.clase}`}
              style={{ width: `${macro.porcentaje}%` }}
              title={`${macro.nombre}: ${macro.porcentaje}%`}
            ></div>
          ))}
        </div>
        <ul className="nutricion-tabla-leyenda">
          {distribucion.map((macro) => (
            <li key={macro.nombre}>
              <span className={`nutricion-tabla-leyenda-punto es-${macro.clase}`}></span>
              {macro.nombre}
              <strong>{macro.porcentaje}%</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="nutricion-tabla-scroll">
        <table className="nutricion-tabla">
          <caption className="nutricion-tabla-oculto">
            Valores nutricionales por porción de {porcion.gramos} g
          </caption>
          <thead>
            <tr>
              <th scope="col">Nutriente</th>
              <th scope="col" className="nutricion-tabla-num">Cantidad</th>
              <th scope="col" className="nutricion-tabla-col-vd">% Valor diario*</th>
            </tr>
          </thead>
          <tbody>
            {macros.map((item) => (
              <FilaNutriente key={item.id} item={item} />
            ))}
          </tbody>
          <tbody>
            <tr className="nutricion-tabla-grupo">
              <th scope="colgroup" colSpan={3}>Vitaminas y minerales</th>
            </tr>
            {micros.map((item) => (
              <FilaNutriente key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="nutricion-tabla-pie">
        <div className="nutricion-tabla-alergenos">
          <span className="nutricion-tabla-etiqueta">Contiene:</span>
          {alergenos.map((alergeno) => (
            <span key={alergeno} className="nutricion-tabla-alergeno">{alergeno}</span>
          ))}
        </div>
        <button type="button" className="nutricion-tabla-boton">
          <span aria-hidden="true">+</span> Agregar al perfil
        </button>
      </div>

      <p className="nutricion-tabla-nota">
        * El % del valor diario indica cuánto aporta un nutriente de una porción a una dieta
        diaria de 2000 kcal. 20% o más se considera alto; 5% o menos, bajo. La distribución de
        energía se calcula con 4 kcal/g para proteínas y carbohidratos y 9 kcal/g para grasas.
      </p>
    </div>
  );
};

export default TablaNutricional;
