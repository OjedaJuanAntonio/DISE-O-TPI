'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { today, uid } from '../utils/helpers';

export default function AsistenciaAlumnos() {
  const { db, usuarioActual, guardarDatos, mostrarMensaje } = useApp();
  const [claseId, setClaseId] = useState('');
  const [fecha, setFecha] = useState(today());
  const [asistencias, setAsistencias] = useState({});
  const [cargado, setCargado] = useState(false);

  if (!db) return null;

  const clasesDisponibles = usuarioActual?.actor === 'Profesor'
    ? db.clases.filter(c => c.profesor === usuarioActual.nombre)
    : db.clases;

  function cargar() {
    if (!claseId) return;
    setCargado(true);
    const inscritos = (db.inscripcionesClase || [])
      .filter(i => i.claseId === claseId && i.estado === 'Activa')
      .map(i => i.alumnoId);
    const estado = {};
    inscritos.forEach(id => { estado[id] = false; });
    db.asistencias
      .filter(a => a.claseId === claseId && a.fecha === fecha)
      .forEach(a => { estado[a.alumnoId] = a.presente; });
    setAsistencias(estado);
  }

  function handleGuardar(e) {
    e.preventDefault();
    const nuevas = db.asistencias.filter(a => !(a.claseId === claseId && a.fecha === fecha));
    Object.entries(asistencias).forEach(([alumnoId, presente]) => {
      nuevas.push({ id: uid('as'), alumnoId, claseId, fecha, presente });
    });
    guardarDatos({ ...db, asistencias: nuevas });
    mostrarMensaje('success', 'Asistencia guardada correctamente.');
  }

  const clase = db.clases.find(c => c.id === claseId);
  const alumnosClase = clase
    ? (db.inscripcionesClase || [])
        .filter(i => i.claseId === claseId && i.estado === 'Activa')
        .map(i => db.alumnos.find(a => a.id === i.alumnoId))
        .filter(Boolean)
    : [];

  return (
    <div>
      <div className="section-header">
        <div><h2>Asistencia</h2><p>Registrá la asistencia de la clase</p></div>
      </div>

      <div className="card">
        <div className="filters">
          <select value={claseId} onChange={e => { setClaseId(e.target.value); setCargado(false); }}>
            <option value="">Seleccioná una clase</option>
            {clasesDisponibles.map(c => <option key={c.id} value={c.id}>{c.nombre} - {c.sede}</option>)}
          </select>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          <button type="button" className="btn btn-primary" onClick={cargar} disabled={!claseId}>Cargar alumnos</button>
        </div>

        {cargado && (
          <form onSubmit={handleGuardar}>
            <table>
              <thead>
                <tr><th>Alumno</th><th>Sede</th><th>Estado</th><th>Presente</th></tr>
              </thead>
              <tbody>
                {alumnosClase.map(a => {
                  const habilitado = a.estado === 'Activo';
                  return (
                    <tr key={a.id}>
                      <td>{a.nombre} {a.apellido}</td>
                      <td>{a.sede}</td>
                      <td><Badge texto={a.estado} /></td>
                      <td>
                        <input
                          type="checkbox"
                          checked={asistencias[a.id] || false}
                          disabled={!habilitado}
                          onChange={e => setAsistencias(prev => ({ ...prev, [a.id]: e.target.checked }))}
                        />
                      </td>
                    </tr>
                  );
                })}
                {!alumnosClase.length && (
                  <tr><td colSpan={4}>No hay alumnos inscriptos en esta clase.</td></tr>
                )}
              </tbody>
            </table>
            {alumnosClase.length > 0 && (
              <div className="form-actions" style={{ marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">Guardar asistencia</button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
