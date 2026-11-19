import { datosNutricionales } from './semillaNutricional';

// Tabla nutricional por porción (HU 4.1.1). Estilos en nutricion.css, bloque 1.
const TablaNutricional = () => {
  return (
    <div className="nutricion-tabla-card">
      <div className="nutricion-tabla-encabezado">
        <div>
          <h3 className="nutricion-tabla-titulo font-poppins">Detalle Nutricional</h3>
          <p className="nutricion-tabla-porcion">
            <span className="nutricion-tabla-punto"></span>
            Porción: 1 unidad (100g)
          </p>
        </div>
        <span className="nutricion-tabla-insignia">Análisis en vivo</span>
      </div>

      <div className="nutricion-tabla-scroll">
        <table className="nutricion-tabla">
          <thead>
            <tr>
              <th scope="col">Nutriente</th>
              <th scope="col" className="nutricion-tabla-num">Cantidad</th>
              <th scope="col" className="nutricion-tabla-col-vd">% Valor Diario*</th>
            </tr>
          </thead>
          <tbody>
            {datosNutricionales.map((item) => (
              <tr key={item.id}>
                <td className="nutricion-tabla-nombre">{item.nutriente}</td>
                <td className="nutricion-tabla-num">
                  <span className="nutricion-tabla-valor font-poppins">{item.valor}</span>
                  <span className="nutricion-tabla-unidad">{item.unidad}</span>
                </td>
                <td>
                  <div className="nutricion-tabla-vd">
                    <div className="nutricion-tabla-barra">
                      <div
                        className="nutricion-tabla-barra-relleno"
                        style={{ width: `${item.porcentaje}%` }}
                      ></div>
                    </div>
                    <span className="nutricion-tabla-porcentaje">{item.porcentaje}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="nutricion-tabla-pie">
        <div className="nutricion-tabla-alergenos">
          <span className="nutricion-tabla-etiqueta">Contiene:</span>
          <span className="nutricion-tabla-alergeno">Gluten</span>
          <span className="nutricion-tabla-alergeno">Leche</span>
        </div>
        <button type="button" className="nutricion-tabla-boton">
          <span>+</span> Agregar al perfil
        </button>
      </div>

      <p className="nutricion-tabla-nota">
        * Los porcentajes se basan en una dieta de 2000 kcal. Los valores pueden variar.
      </p>
    </div>
  );
};

export default TablaNutricional;
