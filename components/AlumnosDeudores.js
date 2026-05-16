'use client';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { money } from '../utils/helpers';

export default function AlumnosDeudores() {
  const { db, alumnoVisible, guardarDatos, addAccionToDb, mostrarMensaje } = useApp();
  if (!db) return null;

  const rows = db.alumnos.filter(a => (a.deuda > 0 || ['Deudor', 'Bloqueado'].includes(a.estado)) && alumnoVisible(a));

  function rehabilitar(id) {
    const a = db.alumnos.find(x => x.id === id);
    if (!a) return;
    const newA = { ...a, deuda: 0, diasMora: 0, estado: 'Activo' };
    let newDb = { ...db, alumnos: db.alumnos.map(x => x.id === id ? newA : x) };
    newDb = addAccionToDb(newDb, 'Rehabilitación manual', 'Gestión de Alumnos', `${a.nombre} ${a.apellido} fue rehabilitado.`, 'Informativa');
    guardarDatos(newDb);
    mostrarMensaje('success', 'Acceso rehabilitado.');
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Alumnos con deuda</h2><p>Alumnos deudores o bloqueados por mora</p></div>
      </div>

      <div className="card table-card">
        <table>
          <thead>
            <tr><th>Alumno</th><th>Sede</th><th>Deuda</th><th>Días de mora</th><th>Estado</th><th>Acción</th></tr>
          </thead>
          <tbody>
            {rows.map(a => (
              <tr key={a.id}>
                <td><strong>{a.nombre} {a.apellido}</strong></td>
                <td>{a.sede}</td>
                <td>{money(a.deuda)}</td>
                <td>{a.diasMora}</td>
                <td><Badge texto={a.estado} /></td>
                <td>
                  <button className="btn btn-success small" onClick={() => rehabilitar(a.id)}>Rehabilitar</button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={6}>Sin alumnos con deuda.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
