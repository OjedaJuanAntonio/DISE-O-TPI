'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';

export default function ListadoAlumnos({ onVerDetalle, onEditar }) {
  const { db, usuarioActual, alumnosPermitidos, guardarDatos, navegarA, mostrarMensaje } = useApp();
  const [texto, setTexto] = useState('');
  const [sede, setSede] = useState('');
  const [estado, setEstado] = useState('');

  if (!db) return null;

  const rows = alumnosPermitidos().filter(a => {
    const match = `${a.nombre} ${a.apellido} ${a.dni} ${a.email}`.toLowerCase().includes(texto.toLowerCase());
    return match && (!sede || a.sede === sede) && (!estado || a.estado === estado);
  });

  function darDeBaja(id) {
    const newDb = { ...db, alumnos: db.alumnos.map(a => a.id === id ? { ...a, estado: 'Baja' } : a) };
    guardarDatos(newDb);
    mostrarMensaje('warning', 'Alumno dado de baja lógicamente.');
  }

  const puedeEditar = ['Administrador', 'Secretaria'].includes(usuarioActual?.actor);

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Listado de alumnos</h2>
          <p>{rows.length} alumno(s) encontrado(s)</p>
        </div>
      </div>

      <div className="filters">
        <input placeholder="Buscar por nombre, DNI, email..." value={texto} onChange={e => setTexto(e.target.value)} style={{ maxWidth: 280 }} />
        <select value={sede} onChange={e => setSede(e.target.value)}>
          <option value="">Todas las sedes</option>
          {db.sedes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={estado} onChange={e => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {['Activo', 'Deudor', 'Bloqueado', 'Baja'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="table-card card">
        <table>
          <thead>
            <tr>
              <th>Nombre y apellido</th><th>DNI</th><th>Teléfono</th><th>Email</th>
              <th>Sede</th><th>Estado</th><th>Inscripción</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map(a => (
              <tr key={a.id}>
                <td><strong>{a.nombre} {a.apellido}</strong></td>
                <td>{a.dni}</td>
                <td>{a.telefono}</td>
                <td>{a.email}</td>
                <td>{a.sede}</td>
                <td><Badge texto={a.estado} /></td>
                <td>{a.fechaInscripcion}</td>
                <td style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <button className="btn btn-light small" onClick={() => onVerDetalle(a.id)}>Ver</button>
                  {puedeEditar && (
                    <>
                      <button className="btn btn-light small" onClick={() => onEditar(a.id)}>Editar</button>
                      {a.estado !== 'Baja' && (
                        <button className="btn btn-danger small" onClick={() => darDeBaja(a.id)}>Baja</button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={8}>No hay alumnos para mostrar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
