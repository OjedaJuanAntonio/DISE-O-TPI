'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { uid } from '../utils/helpers';

export default function DeclaracionJurada() {
  const { db, usuarioActual, alumnosPermitidos, guardarDatos, mostrarMensaje } = useApp();
  const esAlumno = usuarioActual?.actor === 'Alumno';

  const [alumnoId, setAlumnoId] = useState('');
  const [form, setForm] = useState({ estado: 'Completa', enfermedades: 'No', medicacion: 'No', lesiones: 'No', autorizacion: 'Sí', observaciones: '', certificado: '' });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (!db) return;
    if (esAlumno) {
      setAlumnoId(usuarioActual.alumnoId);
    } else {
      const permitidos = alumnosPermitidos();
      if (permitidos.length) setAlumnoId(permitidos[0].id);
    }
  }, [db, esAlumno]);

  useEffect(() => {
    if (!db || !alumnoId) return;
    const decl = db.declaraciones.find(d => d.alumnoId === alumnoId);
    if (decl) {
      setForm({ estado: decl.estado, enfermedades: decl.enfermedades, medicacion: decl.medicacion, lesiones: decl.lesiones, autorizacion: decl.autorizacion, observaciones: decl.observaciones || '', certificado: decl.certificado || '' });
      setEditando(false);
    } else {
      setForm({ estado: 'Completa', enfermedades: 'No', medicacion: 'No', lesiones: 'No', autorizacion: 'Sí', observaciones: '', certificado: '' });
      setEditando(true);
    }
  }, [alumnoId, db]);

  if (!db) return null;

  const permitidos = alumnosPermitidos();

  function set(f, v) { setForm(prev => ({ ...prev, [f]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    const existing = db.declaraciones.find(d => d.alumnoId === alumnoId);
    const data = { id: existing?.id || uid('d'), alumnoId, ...form };
    const newDeclaraciones = existing
      ? db.declaraciones.map(d => d.alumnoId === alumnoId ? data : d)
      : [...db.declaraciones, data];
    guardarDatos({ ...db, declaraciones: newDeclaraciones });
    mostrarMensaje('success', 'Declaración jurada guardada.');
    setEditando(false);
  }

  function descargar(id) {
    const d = db.declaraciones.find(x => x.id === id);
    if (!d) return;
    const al = db.alumnos.find(a => a.id === d.alumnoId);
    const nombre = al ? `${al.nombre} ${al.apellido}` : 'Desconocido';
    const contenido = `DECLARACIÓN JURADA DE SALUD - SQUATGYM\n=======================================\nAlumno: ${nombre}\nDNI: ${al?.dni || '-'}\nEstado: ${d.estado}\n\nEnfermedades preexistentes: ${d.enfermedades}\nToma medicación: ${d.medicacion}\nLesiones recientes: ${d.lesiones}\nAutorización médica: ${d.autorizacion}\n\nObservaciones: ${d.observaciones || 'Sin observaciones'}\nCertificado adjunto: ${d.certificado || 'No adjunto'}\n\nGenerado el: ${new Date().toLocaleDateString('es-AR')}`;
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `declaracion_jurada_${nombre.replace(/ /g, '_')}.txt`;
    a.click(); URL.revokeObjectURL(url);
  }

  const alumnoNombreById = (id) => {
    const a = db.alumnos.find(x => x.id === id);
    return a ? `${a.nombre} ${a.apellido}` : 'Sin alumno';
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Declaración jurada</h2>
          <p>{esAlumno ? 'Mi declaración de salud' : 'Declaraciones de alumnos'}</p>
        </div>
      </div>

      {esAlumno ? (
        <div className="card" style={{ maxWidth: 560 }}>
          {!editando ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3>Mi declaración jurada</h3>
                <button className="btn btn-light" onClick={() => setEditando(true)}>Editar</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p><strong>Estado:</strong> <Badge texto={form.estado} /></p>
                <p><strong>Enfermedades preexistentes:</strong> {form.enfermedades}</p>
                <p><strong>Toma medicación:</strong> {form.medicacion}</p>
                <p><strong>Lesiones recientes:</strong> {form.lesiones}</p>
                <p><strong>Autorización médica:</strong> {form.autorizacion}</p>
                {form.observaciones && <p><strong>Observaciones:</strong> {form.observaciones}</p>}
              </div>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: 16 }}>
                {db.declaraciones.find(d => d.alumnoId === usuarioActual.alumnoId) ? 'Editar declaración' : 'Completar declaración'}
              </h3>
              <form className="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label>Estado <select value={form.estado} onChange={e => set('estado', e.target.value)}><option>Completa</option><option>Pendiente</option></select></label>
                <label>¿Enfermedades preexistentes? <select value={form.enfermedades} onChange={e => set('enfermedades', e.target.value)}><option>No</option><option>Sí</option></select></label>
                <label>¿Toma medicación? <select value={form.medicacion} onChange={e => set('medicacion', e.target.value)}><option>No</option><option>Sí</option></select></label>
                <label>¿Lesiones recientes? <select value={form.lesiones} onChange={e => set('lesiones', e.target.value)}><option>No</option><option>Sí</option></select></label>
                <label>¿Autorización médica? <select value={form.autorizacion} onChange={e => set('autorizacion', e.target.value)}><option>Sí</option><option>No</option></select></label>
                <label>Observaciones <textarea value={form.observaciones} onChange={e => set('observaciones', e.target.value)} /></label>
                <div className="form-actions">
                  {db.declaraciones.find(d => d.alumnoId === usuarioActual.alumnoId) && (
                    <button type="button" className="btn btn-light" onClick={() => setEditando(false)}>Cancelar</button>
                  )}
                  <button type="submit" className="btn btn-primary">Guardar declaración</button>
                </div>
              </form>
            </>
          )}
        </div>
      ) : (
        <div className="card table-card">
          <table>
            <thead>
              <tr><th>Alumno</th><th>Estado</th><th>Enfermedades</th><th>Medicación</th><th>Lesiones</th><th>Autorización méd.</th><th>Certificado</th><th>Acción</th></tr>
            </thead>
            <tbody>
              {db.declaraciones.filter(d => {
                const a = db.alumnos.find(x => x.id === d.alumnoId);
                return a;
              }).map(d => (
                <tr key={d.id}>
                  <td>{alumnoNombreById(d.alumnoId)}</td>
                  <td><Badge texto={d.estado} /></td>
                  <td>{d.enfermedades}</td>
                  <td>{d.medicacion}</td>
                  <td>{d.lesiones}</td>
                  <td>{d.autorizacion}</td>
                  <td>{d.certificado || 'No adjunto'}</td>
                  <td><button className="btn btn-light small" onClick={() => descargar(d.id)}>Descargar</button></td>
                </tr>
              ))}
              {!db.declaraciones.length && <tr><td colSpan={8}>Sin declaraciones registradas.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
