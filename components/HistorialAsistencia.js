'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';

export default function HistorialAsistencia() {
  const { db, usuarioActual, alumnosPermitidos } = useApp();
  const [alumnoId, setAlumnoId] = useState('');

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

  const alumno = db.alumnos.find(a => a.id === alumnoId);
  const registros = alumnoId ? db.asistencias.filter(a => a.alumnoId === alumnoId) : [];
  const ausencias = registros.filter(r => !r.presente).length;

  return (
    <div>
      <div className="section-header">
        <div><h2>Historial de asistencia</h2><p>Registro de presencias y ausencias</p></div>
      </div>

      {usuarioActual?.actor !== 'Alumno' && (
        <div style={{ marginBottom: 16 }}>
          <select value={alumnoId} onChange={e => setAlumnoId(e.target.value)}>
            {alumnosPermitidos().map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
          </select>
        </div>
      )}

      <div className="card">
        {alumno && (
          <>
            <h3>{alumno.nombre} {alumno.apellido}</h3>
            <p>Total de asistencias registradas: <strong>{registros.length}</strong></p>
            <p>Ausencias sin justificar: <strong>{ausencias}</strong></p>
            {ausencias >= 3 && (
              <p><Badge texto="Advertencia" /> Inasistencias frecuentes detectadas.</p>
            )}
          </>
        )}

        {registros.map(r => (
          <div key={r.id} className="list-item">
            <span>{r.fecha} — {db.clases.find(c => c.id === r.claseId)?.nombre || 'Clase'}</span>
            <Badge texto={r.presente ? 'Presente' : 'Ausente'} />
          </div>
        ))}
        {!registros.length && <p>Sin registros de asistencia.</p>}
      </div>
    </div>
  );
}
