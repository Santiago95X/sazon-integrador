import { useEffect, useState } from 'react';
import DetalleNutricional from './DetalleNutricional';
import { obtenerTablaNutricional } from './tablaNutricionalServicio';

const TablaNutricional = () => {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    obtenerTablaNutricional()
      .then((respuesta) => {
        if (!activo) return;
        setDatos(respuesta);
        setCargando(false);
      })
      .catch(() => {
        if (!activo) return;
        setError('No pudimos cargar la información nutricional.');
        setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [intento]);

  const reintentar = () => {
    setError(null);
    setCargando(true);
    setIntento((valor) => valor + 1);
  };

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
