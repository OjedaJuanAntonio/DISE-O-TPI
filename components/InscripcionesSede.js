'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { money } from '../utils/helpers';

export default function InscripcionesSede() {
  const { db, usuarioActual } = useApp();
  const [sede, setSede] = useState(usuarioActual?.actor === 'Encargado' ? (usuarioActual.sede || '') : '');

  if (!db) return null;

  const mensualidad = db.planes[0]?.precio || 0;
  const rows = db.alumnos.filter(a => !sede || a.sede === sede);

  return (
    <div>
      <div className="section-header">
        <div><h2>Inscripciones por sede</h2><p>Alumnos inscriptos</p></div>
      </div>

      <div className="filters">
        {usuarioActual?.actor !== 'Encargado' && (
          <select value={sede} onChange={e => setSede(e.target.value)}>
            <option value="">Todas las sedes</option>
            {db.sedes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        Total de inscripciones encontradas: <strong>{rows.length}</strong>
      </div>

      <div className="card table-card">
        <table>
          <thead>
            <tr><th>Alumno</th><th>Sede</th><th>Mensualidad</th><th>Fecha de inscripción</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {rows.map(a => (
              <tr key={a.id}>
                <td>{a.nombre} {a.apellido}</td>
                <td>{a.sede}</td>
                <td>{money(mensualidad)}</td>
                <td>{a.fechaInscripcion}</td>
                <td><Badge texto={a.estado} /></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={5}>Sin inscripciones para la selección.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
