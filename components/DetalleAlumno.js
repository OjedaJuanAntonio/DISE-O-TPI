'use client';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { money } from '../utils/helpers';

export default function DetalleAlumno({ alumnoId, onEditar }) {
  const { db, guardarDatos, mostrarMensaje, navegarA } = useApp();
  if (!db || !alumnoId) return <div className="card"><p>Seleccioná un alumno desde el listado.</p></div>;

  const a = db.alumnos.find(x => x.id === alumnoId);
  if (!a) return <div className="card"><p>Alumno no encontrado.</p></div>;

  const pagos = db.pagos.filter(p => p.alumnoId === alumnoId);
  const asist = db.asistencias.filter(as => as.alumnoId === alumnoId);
  const decl = db.declaraciones.find(d => d.alumnoId === alumnoId);

  function reactivar() {
    const newA = { ...a, estado: a.deuda > 0 ? 'Deudor' : 'Activo' };
    guardarDatos({ ...db, alumnos: db.alumnos.map(x => x.id === a.id ? newA : x) });
    mostrarMensaje('success', 'Alumno reactivado.');
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>{a.nombre} {a.apellido}</h2>
          <p>Detalle completo del alumno</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-light" onClick={() => navegarA('alumnos-listado')}>← Volver</button>
          {onEditar && <button className="btn btn-primary" onClick={() => onEditar(a.id)}>Editar</button>}
          {a.estado === 'Baja' && (
            <button className="btn btn-success" onClick={reactivar}>Reactivar</button>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <h3>Datos personales</h3>
          <p><strong>{a.nombre} {a.apellido}</strong></p>
          <p>DNI: {a.dni}</p>
          <p>{a.email}</p>
          <p>{a.telefono}</p>
          {a.direccion && <p>{a.direccion}</p>}
          {a.emergencia && <p><small>Emergencia: {a.emergencia}</small></p>}
        </div>
        <div className="detail-item">
          <h3>Inscripción</h3>
          <p>Sede: {a.sede}</p>
          <p>Fecha: {a.fechaInscripcion}</p>
          <p><Badge texto={a.estado} /></p>
          {a.observaciones && <p><small>{a.observaciones}</small></p>}
        </div>
        <div className="detail-item">
          <h3>Estado de cuenta</h3>
          <p>Deuda: <strong>{money(a.deuda)}</strong></p>
          <p>Días de mora: {a.diasMora}</p>
          <p>Vence: {a.fechaLimitePago}</p>
        </div>
        <div className="detail-item">
          <h3>Últimos pagos</h3>
          {pagos.slice(-3).map(p => (
            <p key={p.id}>{p.fecha}: {money(p.total)} ({p.medio})</p>
          ))}
          {!pagos.length && <p>Sin pagos.</p>}
        </div>
        <div className="detail-item">
          <h3>Asistencia</h3>
          <p>Total registros: {asist.length}</p>
          <p>Presentes: {asist.filter(x => x.presente).length}</p>
          <p>Ausencias: {asist.filter(x => !x.presente).length}</p>
        </div>
        <div className="detail-item">
          <h3>Declaración jurada</h3>
          <p>{decl ? <Badge texto={decl.estado} /> : <Badge texto="Pendiente" />}</p>
          <p>{decl?.observaciones || 'Sin datos cargados.'}</p>
        </div>
      </div>
    </div>
  );
}
