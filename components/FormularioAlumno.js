'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { uid, today } from '../utils/helpers';

const EMPTY = { id: '', nombre: '', apellido: '', dni: '', fechaNacimiento: '', telefono: '', email: '', direccion: '', emergencia: '', sede: '', fechaInscripcion: today(), observaciones: '' };

export default function FormularioAlumno({ alumnoId, onGuardado }) {
  const { db, guardarDatos, navegarA, mostrarMensaje } = useApp();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (alumnoId && db) {
      const a = db.alumnos.find(x => x.id === alumnoId);
      if (a) {
        setForm({
          id: a.id, nombre: a.nombre, apellido: a.apellido, dni: a.dni,
          fechaNacimiento: a.fechaNacimiento || '', telefono: a.telefono,
          email: a.email, direccion: a.direccion || '', emergencia: a.emergencia || '',
          sede: a.sede, fechaInscripcion: a.fechaInscripcion,
          observaciones: a.observaciones || ''
        });
      }
    } else {
      setForm({ ...EMPTY, sede: db?.sedes[0] || '', fechaInscripcion: today() });
    }
  }, [alumnoId, db]);

  if (!db) return null;

  function set(field, val) {
    setForm(prev => ({ ...prev, [field]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const exists = db.alumnos.find(a => a.id === form.id);
    const data = {
      id: form.id || uid('a'),
      nombre: form.nombre.trim(), apellido: form.apellido.trim(),
      dni: form.dni.trim(), fechaNacimiento: form.fechaNacimiento,
      telefono: form.telefono.trim(), email: form.email.trim(),
      direccion: form.direccion.trim(), emergencia: form.emergencia.trim(),
      sede: form.sede,
      fechaInscripcion: form.fechaInscripcion,
      observaciones: form.observaciones.trim(),
      estado: exists?.estado || 'Activo',
      deuda: exists ? exists.deuda : 0,
      diasMora: exists?.diasMora || 0,
      fechaLimitePago: exists?.fechaLimitePago || today()
    };
    const newAlumnos = exists
      ? db.alumnos.map(a => a.id === data.id ? data : a)
      : [...db.alumnos, data];
    guardarDatos({ ...db, alumnos: newAlumnos });
    setForm({ ...EMPTY, sede: db.sedes[0] || '', fechaInscripcion: today() });
    mostrarMensaje('success', exists ? 'Alumno actualizado correctamente.' : 'Alumno registrado correctamente.');
    navegarA('alumnos-listado');
    if (onGuardado) onGuardado();
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>{form.id ? 'Editar alumno' : 'Registrar nuevo alumno'}</h2>
          <p>Completá los datos del alumno</p>
        </div>
      </div>

      <div className="card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <h3 className="span-2">Datos personales</h3>
          <label>Nombre <input value={form.nombre} onChange={e => set('nombre', e.target.value)} required /></label>
          <label>Apellido <input value={form.apellido} onChange={e => set('apellido', e.target.value)} required /></label>
          <label>DNI <input value={form.dni} onChange={e => set('dni', e.target.value)} required /></label>
          <label>Fecha de nacimiento <input type="date" value={form.fechaNacimiento} onChange={e => set('fechaNacimiento', e.target.value)} /></label>
          <label>Teléfono <input value={form.telefono} onChange={e => set('telefono', e.target.value)} /></label>
          <label>Email <input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></label>
          <label className="span-2">Dirección <input value={form.direccion} onChange={e => set('direccion', e.target.value)} /></label>
          <label className="span-2">Contacto de emergencia <input value={form.emergencia} onChange={e => set('emergencia', e.target.value)} /></label>

          <h3 className="span-2">Inscripción</h3>
          <label>
            Sede
            <select value={form.sede} onChange={e => set('sede', e.target.value)}>
              {db.sedes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label>Fecha de inscripción <input type="date" value={form.fechaInscripcion} onChange={e => set('fechaInscripcion', e.target.value)} required /></label>
          <label className="span-2">Observaciones <textarea value={form.observaciones} onChange={e => set('observaciones', e.target.value)} /></label>

          <div className="form-actions span-2">
            <button type="button" className="btn btn-light" onClick={() => setForm({ ...EMPTY, sede: db.sedes[0] || '', fechaInscripcion: today() })}>
              Limpiar
            </button>
            <button type="submit" className="btn btn-primary">
              {form.id ? 'Guardar cambios' : 'Registrar alumno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
