import DetalleNutricional from './DetalleNutricional';
import { useTablaNutricional } from './useTablaNutricional';

const TablaNutricional = () => {
  const { datos, cargando, error, reintentar } = useTablaNutricional();

  if (cargando) {
    return (
      <div className="nutricion-tabla-card nutricion-tabla-cargando" role="status" aria-live="polite">
        <span className="nutricion-tabla-oculto">Cargando tabla nutricional…</span>
        <div className="nutricion-tabla-esqueleto es-titulo"></div>
        <div className="nutricion-tabla-esqueleto es-subtitulo"></div>
        <div className="nutricion-tabla-esqueleto es-barra"></div>
        {[1, 2, 3, 4, 5, 6].map((fila) => (
          <div key={fila} className="nutricion-tabla-esqueleto es-fila"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="nutricion-tabla-card nutricion-tabla-error" role="alert">
        <i className="bi bi-exclamation-octagon" aria-hidden="true"></i>
        <p>{error}</p>
        <button type="button" className="nutricion-tabla-boton" onClick={reintentar}>
          <i className="bi bi-arrow-clockwise" aria-hidden="true"></i>
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  return (
    <DetalleNutricional
      porcion={datos.porcion}
      opcionesPorcion={datos.opcionesPorcion}
      energia={datos.energia}
      datosNutricionales={datos.datosNutricionales}
      alergenos={datos.alergenos}
    />
  );
};

export default TablaNutricional;
