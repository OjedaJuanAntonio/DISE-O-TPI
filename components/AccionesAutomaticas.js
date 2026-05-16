'use client';
import { useApp } from '../context/AppContext';
import Badge from './Badge';

export default function AccionesAutomaticas() {
  const { db } = useApp();
  if (!db) return null;

  return (
    <div>
      <div className="section-header">
        <div><h2>Acciones automáticas del sistema</h2><p>Registro de operaciones ejecutadas automáticamente</p></div>
      </div>

      <div className="card table-card">
        <table>
          <thead>
            <tr><th>Fecha</th><th>Tipo</th><th>Módulo</th><th>Descripción</th><th>Estado</th><th>Severidad</th></tr>
          </thead>
          <tbody>
            {db.accionesSistema.map(a => (
              <tr key={a.id}>
                <td style={{ fontSize: 13 }}>{a.fecha}</td>
                <td>{a.tipo}</td>
                <td>{a.modulo}</td>
                <td style={{ fontSize: 13 }}>{a.descripcion}</td>
                <td><Badge texto={a.estado} /></td>
                <td><Badge texto={a.severidad} /></td>
              </tr>
            ))}
            {!db.accionesSistema.length && <tr><td colSpan={6}>Sin acciones registradas.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
