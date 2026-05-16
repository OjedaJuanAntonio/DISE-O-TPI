'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { today, uid } from '../utils/helpers';

export default function VerificarIngreso() {
  const { db, updateDb } = useApp();
  const [alumnoId, setAlumnoId] = useState('');
  const [sede, setSede] = useState('');
  const [resultado, setResultado] = useState(null);

  if (!db) return null;

  const ingresosHoy = (db.ingresos || []).filter(i => i.fecha === today());

  function handleRegistrar(e) {
    e.preventDefault();
    const alumno = db.alumnos.find(a => a.id === alumnoId);

    if (alumno.estado === 'Baja') {
      setResultado({ ok: false, motivo: 'No habilitado: el alumno está dado de baja.' });
      return;
    }
    if (alumno.estado === 'Bloqueado') {
      setResultado({ ok: false, motivo: 'No habilitado: bloqueo por mora.' });
      return;
    }
    if (alumno.deuda > 0) {
      setResultado({ ok: false, motivo: 'No habilitado: el alumno tiene deuda pendiente.' });
      return;
    }

    const capturedAlumnoId = alumnoId;
    const capturedSede = sede;
    const capturedFecha = today();
    const capturedNombre = `${alumno.nombre} ${alumno.apellido}`;
    let duplicado = false;

    updateDb(prev => {
      const yaIngreso = (prev.ingresos || []).some(
        i => i.alumnoId === capturedAlumnoId && i.sede === capturedSede && i.fecha === capturedFecha
      );
      if (yaIngreso) {
        duplicado = true;
        return prev;
      }
      const ingreso = {
        id: uid('ing'),
        alumnoId: capturedAlumnoId,
        alumnoNombre: capturedNombre,
        sede: capturedSede,
        fecha: capturedFecha,
      };
      return { ...prev, ingresos: [...(prev.ingresos || []), ingreso] };
    });

    if (duplicado) {
      setResultado({ ok: false, motivo: 'El alumno ya registró un ingreso en esta sede hoy.' });
    } else {
      setResultado({ ok: true, motivo: `Ingreso registrado para ${capturedNombre}.` });
      setAlumnoId('');
      setSede('');
    }
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Registrar ingreso</h2><p>Registrá la entrada de un alumno al gimnasio</p></div>
      </div>

      <div className="two-columns">
        <div className="card">
          <form className="form" onSubmit={handleRegistrar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              Alumno
              <select value={alumnoId} onChange={e => { setAlumnoId(e.target.value); setResultado(null); }} required>
                <option value="">Seleccioná un alumno</option>
                {db.alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
              </select>
            </label>
            <label>
              Sede
              <select value={sede} onChange={e => { setSede(e.target.value); setResultado(null); }} required>
                <option value="">Seleccioná una sede</option>
                {db.sedes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label>
              Fecha
              <input type="text" value={today()} readOnly style={{ background: 'var(--surface)', color: 'var(--muted)' }} />
            </label>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Registrar ingreso</button>
            </div>
          </form>
        </div>

        <div className="card">
          {resultado ? (
            <>
              <h3>Resultado</h3>
              <p>{resultado.motivo}</p>
              <Badge texto={resultado.ok ? 'Ingreso registrado' : 'No habilitado'} />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--muted)' }}>
              <div style={{ fontSize: 40 }}>🚪</div>
              <p>Completá los datos y presioná Registrar ingreso.</p>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3>Ingresos del día</h3>
        {ingresosHoy.length ? (
          ingresosHoy.map(i => (
            <div key={i.id} className="list-item">
              <span>{i.alumnoNombre}</span>
              <span style={{ color: 'var(--muted)' }}>{i.sede}</span>
              <small style={{ color: 'var(--muted)' }}>{i.fecha}</small>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--muted)' }}>Sin ingresos registrados hoy.</p>
        )}
      </div>
    </div>
  );
}
