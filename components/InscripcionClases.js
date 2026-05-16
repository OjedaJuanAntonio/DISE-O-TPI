'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { today, uid, money } from '../utils/helpers';

export default function InscripcionClases() {
  const { db, updateDb, usuarioActual, alumnosPermitidos } = useApp();
  const [alumnoId, setAlumnoId] = useState('');
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (!db) return;
    if (usuarioActual?.actor === 'Alumno') {
      setAlumnoId(usuarioActual.alumnoId);
    } else {
      const permitidos = alumnosPermitidos();
      if (permitidos.length) setAlumnoId(permitidos[0].id);
    }
  }, [db, usuarioActual]);

  if (!db) return null;

  const esAlumno = usuarioActual?.actor === 'Alumno';
  const alumno = db.alumnos.find(a => a.id === alumnoId);
  const inscripcionesAlumno = alumno
    ? (db.inscripcionesClase || []).filter(i => i.alumnoId === alumnoId && i.estado === 'Activa')
    : [];
  const clasesInscriptasIds = new Set(inscripcionesAlumno.map(i => i.claseId));

  function handleInscribir(claseId) {
    if (!alumno) return;
    setMensaje(null);

    if (alumno.estado === 'Baja') {
      setMensaje({ ok: false, texto: 'El alumno está dado de baja y no puede inscribirse.' });
      return;
    }
    if (alumno.estado === 'Bloqueado' || alumno.deuda > 0) {
      setMensaje({ ok: false, texto: 'No puede inscribirse si no pagó la cuota general primero.' });
      return;
    }

    const clase = db.clases.find(c => c.id === claseId);
    const capturedAlumnoId = alumnoId;
    const capturedNombre = `${alumno.nombre} ${alumno.apellido}`;

    updateDb(prev => {
      const yaInscripto = (prev.inscripcionesClase || []).some(
        i => i.alumnoId === capturedAlumnoId && i.claseId === claseId && i.estado === 'Activa'
      );
      if (yaInscripto) return prev;

      const inscripcion = {
        id: uid('ic'),
        alumnoId: capturedAlumnoId,
        alumnoNombre: capturedNombre,
        claseId,
        claseNombre: clase.nombre,
        precio: clase.precio,
        fechaInscripcion: today(),
        estado: 'Activa',
      };
      const pago = {
        id: uid('p'),
        alumnoId: capturedAlumnoId,
        claseId,
        claseNombre: clase.nombre,
        fecha: today(),
        medio: 'Débito automático',
        monto: clase.precio,
        descuento: 0,
        total: clase.precio,
        recibo: `RC-${String((prev.pagos?.length || 0) + 1).padStart(4, '0')}`,
        tipo: 'Clase',
      };
      return {
        ...prev,
        inscripcionesClase: [...(prev.inscripcionesClase || []), inscripcion],
        pagos: [...(prev.pagos || []), pago],
      };
    });

    setMensaje({ ok: true, texto: `Inscripción en ${clase.nombre} registrada. Pago de ${money(clase.precio)} debitado automáticamente.` });
  }

  function handleDesinscribir(inscripcionId) {
    updateDb(prev => ({
      ...prev,
      inscripcionesClase: (prev.inscripcionesClase || []).map(i =>
        i.id === inscripcionId ? { ...i, estado: 'Cancelada' } : i
      ),
    }));
    setMensaje({ ok: true, texto: 'Inscripción cancelada.' });
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Inscripción en clases</h2><p>Inscribite en clases pagas adicionales a la mensualidad</p></div>
      </div>

      {!esAlumno && (
        <div style={{ marginBottom: 16 }}>
          <select value={alumnoId} onChange={e => { setAlumnoId(e.target.value); setMensaje(null); }}>
            {alumnosPermitidos().map(a => (
              <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
            ))}
          </select>
        </div>
      )}

      {mensaje && (
        <div className={`alert ${mensaje.ok ? 'alert-success' : 'alert-warning'}`} style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, background: mensaje.ok ? 'var(--success-bg, #d1fae5)' : 'var(--warning-bg, #fef3c7)', color: mensaje.ok ? 'var(--success, #065f46)' : 'var(--warning-dark, #92400e)' }}>
          {mensaje.texto}
        </div>
      )}

      {alumno && (
        <>
          {alumno.deuda > 0 && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: '#fef3c7', color: '#92400e', marginBottom: 16 }}>
              El alumno tiene deuda pendiente. Debe pagar la cuota general antes de inscribirse en clases.
            </div>
          )}

          <div className="two-columns">
            <div>
              <div className="card table-card">
                <h3>Clases disponibles</h3>
                <table>
                  <thead>
                    <tr><th>Clase</th><th>Día</th><th>Horario</th><th>Sede</th><th>Precio</th><th></th></tr>
                  </thead>
                  <tbody>
                    {db.clases.map(c => {
                      const inscripto = clasesInscriptasIds.has(c.id);
                      return (
                        <tr key={c.id}>
                          <td><strong>{c.nombre}</strong></td>
                          <td>{c.dia}</td>
                          <td>{c.horario}</td>
                          <td>{c.sede}</td>
                          <td>{money(c.precio)}</td>
                          <td>
                            {inscripto
                              ? <Badge texto="Inscripto" />
                              : <button className="btn btn-primary small" onClick={() => handleInscribir(c.id)} disabled={alumno.deuda > 0 || alumno.estado === 'Bloqueado' || alumno.estado === 'Baja'}>Inscribirse</button>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h3>Clases inscriptas</h3>
              {inscripcionesAlumno.length ? (
                inscripcionesAlumno.map(i => (
                  <div key={i.id} className="list-item">
                    <div>
                      <strong>{i.claseNombre}</strong>
                      <span style={{ display: 'block', fontSize: 13, color: 'var(--muted)' }}>
                        Inscripto: {i.fechaInscripcion} — {money(i.precio)}
                      </span>
                    </div>
                    <button className="btn btn-danger small" onClick={() => handleDesinscribir(i.id)}>Cancelar</button>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--muted)' }}>Sin inscripciones activas.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
