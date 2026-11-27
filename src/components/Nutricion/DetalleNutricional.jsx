import { useEffect, useId, useState } from 'react';
import { leerTablaEnPerfil, guardarTablaEnPerfil, quitarTablaDelPerfil } from './tablaNutricionalServicio';
import { formatearNumero, porcentajeDiario, calcularDistribucion } from './formatoNutricional';

const FilaNutriente = ({ item, factor }) => {
  const valor = item.valor * factor;
  const porcentaje = porcentajeDiario(valor, item.valorDiario);
  return (
    <tr className={item.nivel === 1 ? 'nutricion-tabla-fila-sub' : undefined}>
      <th scope="row" className="nutricion-tabla-nombre">{item.nutriente}</th>
      <td className="nutricion-tabla-num">
        <span className="nutricion-tabla-valor">{formatearNumero(valor)}</span>
        <span className="nutricion-tabla-unidad">{item.unidad}</span>
      </td>
      <td>
        {porcentaje === null ? (
          <span className="nutricion-tabla-sin-vd" aria-label="Sin valor diario de referencia">—</span>
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

const ID_PERSONALIZADA = 'personalizada';
const GRAMOS_MIN = 10;
const GRAMOS_MAX = 1000;

const validarGramos = (texto) => {
  if (texto.trim() === '') return 'Escribe los gramos de la porción.';
  const gramos = Number(texto);
  if (!Number.isInteger(gramos)) return 'Usa un número entero, sin decimales.';
  if (gramos < GRAMOS_MIN || gramos > GRAMOS_MAX) return `Debe estar entre ${GRAMOS_MIN} y ${GRAMOS_MAX} g.`;
  return '';
};

const DetalleNutricional = ({ porcion, opcionesPorcion, energia, datosNutricionales, alergenos }) => {
  const idMicros = useId();
  const opcionBase = opcionesPorcion.find((opcion) => opcion.factor === 1) ?? opcionesPorcion[0];
  const buscarOpcion = (id) => opcionesPorcion.find((opcion) => opcion.id === id) ?? opcionBase;
  const distribucion = calcularDistribucion(datosNutricionales);
  const [enPerfil, setEnPerfil] = useState(() => leerTablaEnPerfil());
  const [porcionId, setPorcionId] = useState(() => enPerfil?.porcionId ?? opcionBase.id);
  const [formulario, setFormulario] = useState(() => ({ gramos: String(enPerfil?.gramos ?? 150) }));
  const [gramosValidos, setGramosValidos] = useState(() => enPerfil?.gramos ?? 150);
  const [verMicros, setVerMicros] = useState(false);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    if (!aviso) return undefined;
    const temporizador = setTimeout(() => setAviso(null), 4000);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  const errorGramos = validarGramos(formulario.gramos);
  const opcion =
    porcionId === ID_PERSONALIZADA
      ? {
          id: ID_PERSONALIZADA,
          etiqueta: 'Porción personalizada',
          gramos: gramosValidos,
          factor: gramosValidos / porcion.gramos,
        }
      : buscarOpcion(porcionId);
  const gramosParaGuardar = (id, gramos) => (id === ID_PERSONALIZADA ? gramos : undefined);
  const factor = opcion.factor;
  const macros = datosNutricionales.filter((item) => item.grupo === 'macro');
  const micros = datosNutricionales.filter((item) => item.grupo === 'micro');
  const kcal = energia.valor * factor;

  const agregarAlPerfil = () => {
    setEnPerfil(guardarTablaEnPerfil(opcion.id, gramosParaGuardar(opcion.id, opcion.gramos)));
    const texto = `${opcion.etiqueta} (${opcion.gramos} g) · ${formatearNumero(kcal)} kcal`;
    setAviso({ id: Date.now(), tipo: 'agregado', texto });
  };

  const quitarDelPerfil = () => {
    quitarTablaDelPerfil();
    setEnPerfil(null);
    setAviso({ id: Date.now(), tipo: 'quitado', texto: 'Ya no aparece en tu perfil' });
  };

  const alternarPerfil = () => (enPerfil ? quitarDelPerfil() : agregarAlPerfil());

  const deshacer = () => (aviso?.tipo === 'agregado' ? quitarDelPerfil() : agregarAlPerfil());

  const cambiarPorcion = (id) => {
    setPorcionId(id);
    if (enPerfil) setEnPerfil(guardarTablaEnPerfil(id, gramosParaGuardar(id, gramosValidos)));
  };

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
    if (validarGramos(value)) return;
    const gramos = Number(value);
    setGramosValidos(gramos);
    if (enPerfil && porcionId === ID_PERSONALIZADA) {
      setEnPerfil(guardarTablaEnPerfil(ID_PERSONALIZADA, gramos));
    }
  };

  return (
    <div className="nutricion-tabla-card">
      <div className="nutricion-tabla-encabezado">
        <div>
          <p className="nutricion-tabla-eyebrow">
            Información nutricional
            {enPerfil && (
              <span className="nutricion-tabla-en-perfil">
                <i className="bi bi-check2" aria-hidden="true"></i> En tu perfil
              </span>
            )}
          </p>
          <h3 className="nutricion-tabla-titulo font-poppins">Detalle por porción</h3>
          <p className="nutricion-tabla-porcion">
            Porción base: {porcion.descripcion} ({porcion.gramos} g)
          </p>
        </div>
        <div className="nutricion-tabla-energia" aria-live="polite">
          <span className="nutricion-tabla-energia-valor font-poppins">
            {formatearNumero(kcal)}
          </span>
          <span className="nutricion-tabla-energia-unidad">
            {energia.unidad} · {porcentajeDiario(kcal, energia.valorDiario)}% VD
          </span>
        </div>
      </div>

      <div className="nutricion-tabla-controles">
        <span className="nutricion-tabla-subtitulo" id={`${idMicros}-porcion`}>Ver valores para</span>
        <div className="nutricion-tabla-segmentos" role="radiogroup" aria-labelledby={`${idMicros}-porcion`}>
          {opcionesPorcion.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={item.id === opcion.id}
              className={`nutricion-tabla-segmento-opcion${item.id === opcion.id ? ' esta-activa' : ''}`}
              onClick={() => cambiarPorcion(item.id)}
            >
              {item.etiqueta}
              <span className="nutricion-tabla-segmento-gramos">{item.gramos} g</span>
            </button>
          ))}
          <button
            type="button"
            role="radio"
            aria-checked={porcionId === ID_PERSONALIZADA}
            className={`nutricion-tabla-segmento-opcion${porcionId === ID_PERSONALIZADA ? ' esta-activa' : ''}`}
            onClick={() => cambiarPorcion(ID_PERSONALIZADA)}
          >
            Personalizada
            <span className="nutricion-tabla-segmento-gramos">{gramosValidos} g</span>
          </button>
        </div>
        {porcionId === ID_PERSONALIZADA && (
          <form className="nutricion-tabla-personalizada" onSubmit={(evento) => evento.preventDefault()} noValidate>
            <label htmlFor={`${idMicros}-gramos`}>Gramos por porción</label>
            <div className={`nutricion-tabla-campo${errorGramos ? ' es-invalido' : ''}`}>
              <input
                id={`${idMicros}-gramos`}
                name="gramos"
                type="number"
                inputMode="numeric"
                min={GRAMOS_MIN}
                max={GRAMOS_MAX}
                step={1}
                value={formulario.gramos}
                onChange={manejarCambio}
                aria-invalid={Boolean(errorGramos)}
                aria-describedby={`${idMicros}-gramos-ayuda`}
              />
              <span aria-hidden="true">g</span>
            </div>
            <p
              id={`${idMicros}-gramos-ayuda`}
              className={`nutricion-tabla-campo-ayuda${errorGramos ? ' es-error' : ''}`}
              aria-live="polite"
            >
              {errorGramos || `Entre ${GRAMOS_MIN} y ${GRAMOS_MAX} g. Los valores se actualizan mientras escribes.`}
            </p>
          </form>
        )}
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
            Valores nutricionales para {opcion.etiqueta} ({opcion.gramos} g)
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
              <FilaNutriente key={item.id} item={item} factor={factor} />
            ))}
          </tbody>
          <tbody>
            <tr className="nutricion-tabla-grupo">
              <th scope="colgroup" colSpan={3}>
                <button
                  type="button"
                  className="nutricion-tabla-desplegar"
                  aria-expanded={verMicros}
                  aria-controls={idMicros}
                  onClick={() => setVerMicros((visible) => !visible)}
                >
                  <span>Vitaminas y minerales</span>
                  <span className="nutricion-tabla-desplegar-accion">
                    {verMicros ? 'Ocultar' : `Ver ${micros.length}`}
                    <i className={`bi ${verMicros ? 'bi-chevron-up' : 'bi-chevron-down'}`} aria-hidden="true"></i>
                  </span>
                </button>
              </th>
            </tr>
          </tbody>
          <tbody id={idMicros} hidden={!verMicros}>
            {micros.map((item) => (
              <FilaNutriente key={item.id} item={item} factor={factor} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="nutricion-tabla-pie">
        <div className="nutricion-tabla-alergenos">
          <span className="nutricion-tabla-etiqueta">Contiene:</span>
          {alergenos.map((alergeno) => (
            <span key={alergeno} className="nutricion-tabla-alergeno">
              <i className="bi bi-exclamation-triangle" aria-hidden="true"></i>
              {alergeno}
            </span>
          ))}
        </div>
        <button
          key={enPerfil ? 'agregado' : 'sin-agregar'}
          type="button"
          className={`nutricion-tabla-boton${enPerfil ? ' esta-agregado' : ''}`}
          aria-pressed={Boolean(enPerfil)}
          onClick={alternarPerfil}
        >
          <i className={`bi ${enPerfil ? 'bi-check2-circle' : 'bi-plus-lg'}`} aria-hidden="true"></i>
          <span>{enPerfil ? 'Agregado al perfil' : 'Agregar al perfil'}</span>
          {enPerfil && <span className="nutricion-tabla-boton-quitar">Quitar</span>}
        </button>
      </div>

      <div className="nutricion-tabla-aviso-zona" role="status" aria-live="polite">
        {aviso && (
          <div key={aviso.id} className={`nutricion-tabla-aviso es-${aviso.tipo}`}>
            <i
              className={`bi ${aviso.tipo === 'agregado' ? 'bi-check-circle-fill' : 'bi-dash-circle'}`}
              aria-hidden="true"
            ></i>
            <div className="nutricion-tabla-aviso-texto">
              <strong>{aviso.tipo === 'agregado' ? 'Agregado a tu perfil' : 'Quitado de tu perfil'}</strong>
              <span>{aviso.texto}</span>
            </div>
            <button type="button" className="nutricion-tabla-aviso-deshacer" onClick={deshacer}>
              Deshacer
            </button>
            <button
              type="button"
              className="nutricion-tabla-aviso-cerrar"
              aria-label="Cerrar aviso"
              onClick={() => setAviso(null)}
            >
              <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </div>
        )}
      </div>

      <p className="nutricion-tabla-nota">
        * El % del valor diario indica cuánto aporta un nutriente de la porción elegida a una
        dieta diaria de 2000 kcal. 20% o más se considera alto; 5% o menos, bajo. La distribución
        de energía se calcula con 4 kcal/g para proteínas y carbohidratos y 9 kcal/g para grasas.
      </p>
    </div>
  );
};

export default DetalleNutricional;
