'use client';
import { useApp } from '../context/AppContext';
import { money } from '../utils/helpers';

export default function CronogramaPlan() {
  const { db } = useApp();
  if (!db) return null;

  return (
    <div>
      <div className="section-header">
        <div><h2>Cronograma de clases</h2><p>Horarios y precios de todas las clases disponibles</p></div>
      </div>

      <div className="card table-card">
        <table>
          <thead>
            <tr><th>Día</th><th>Horario</th><th>Clase</th><th>Profesor/a</th><th>Sede</th><th>Cupos</th><th>Precio</th></tr>
          </thead>
          <tbody>
            {db.clases.map(c => (
              <tr key={c.id}>
                <td>{c.dia}</td>
                <td>{c.horario}</td>
                <td><strong>{c.nombre}</strong></td>
                <td>{c.profesor}</td>
                <td>{c.sede}</td>
                <td>{c.cupos}</td>
                <td>{money(c.precio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
