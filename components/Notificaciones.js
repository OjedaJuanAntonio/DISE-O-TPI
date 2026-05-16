'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { uid, today } from '../utils/helpers';

export default function Notificaciones() {
  const { db, usuarioActual, alumnosPermitidos, guardarDatos, mostrarMensaje } = useApp();
  const [destinatario, setDestinatario] = useState('todos');
  const [motivo, setMotivo] = useState('Vencimiento');
  const [mensaje, setMensaje] = useState('');

  if (!db) return null;

  const permitidos = alumnosPermitidos();
  const esAlumno = usuarioActual?.actor === 'Alumno';

  const alumnoNombre = (id) => {
    const a = db.alumnos.find(x => x.id === id);
    return a ? `${a.nombre} ${a.apellido}` : 'Sin alumno';
  };

  let notifFiltradas = db.notificaciones;
  if (esAlumno) {
    const nombre = alumnoNombre(usuarioActual.alumnoId);
    notifFiltradas = db.notificaciones.filter(n => n.destinatario === nombre || n.destinatario === 'Todos los alumnos');
  }

  function handleEnviar(e) {
    e.preventDefault();
    const dest = destinatario === 'todos' ? 'Todos los alumnos' : alumnoNombre(destinatario);
    const notif = { id: uid('n'), fecha: today(), destinatario: dest, motivo, estado: 'Enviada', emisor: usuarioActual.nombre, mensaje };
    guardarDatos({ ...db, notificaciones: [notif, ...db.notificaciones] });
    setMensaje('');
    mostrarMensaje('success', 'Notificación enviada correctamente.');
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Notificaciones</h2><p>Enviá mensajes a los alumnos</p></div>
      </div>

      {!esAlumno && (
        <div className="card">
          <h3>Enviar notificación</h3>
          <form className="form-grid" onSubmit={handleEnviar}>
            <label>
              Destinatario
              <select value={destinatario} onChange={e => setDestinatario(e.target.value)}>
                <option value="todos">Todos los alumnos</option>
                {permitidos.map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
              </select>
            </label>
            <label>
              Motivo
              <select value={motivo} onChange={e => setMotivo(e.target.value)}>
                {['Vencimiento', 'Mora', 'Bloqueo', 'Rehabilitación', 'Promoción', 'Recordatorio', 'Otro'].map(m => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="span-2">
              Mensaje
              <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} required />
            </label>
            <div className="form-actions span-2">
              <button type="submit" className="btn btn-primary">Enviar notificación</button>
            </div>
          </form>
        </div>
      )}

      <div className="card table-card">
        <h3>Historial de notificaciones</h3>
        <table>
          <thead>
            <tr><th>Fecha</th><th>Destinatario</th><th>Motivo</th><th>Estado</th><th>Emisor</th></tr>
          </thead>
          <tbody>
            {notifFiltradas.map(n => (
              <tr key={n.id}>
                <td>{n.fecha}</td>
                <td>{n.destinatario}</td>
                <td>{n.motivo}</td>
                <td><Badge texto={n.estado} /></td>
                <td>{n.emisor}</td>
              </tr>
            ))}
            {!notifFiltradas.length && <tr><td colSpan={5}>Sin notificaciones.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
