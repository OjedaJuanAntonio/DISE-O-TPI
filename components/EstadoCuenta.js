'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import Badge from './Badge';
import { money } from '../utils/helpers';

export default function EstadoCuenta() {
  const { db, updateDb, usuarioActual, alumnosPermitidos, mostrarMensaje } = useApp();
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

  const alumno = db.alumnos.find(x => x.id === alumnoId);
  const todosPagos = alumno ? db.pagos.filter(p => p.alumnoId === alumnoId) : [];
  const pagosMensualidad = todosPagos.filter(p => p.tipo === 'Mensualidad' || !p.tipo);
  const pagosClases = todosPagos.filter(p => p.tipo === 'Clase');
  const clasesInscriptas = alumno
    ? (db.inscripcionesClase || []).filter(i => i.alumnoId === alumnoId && i.estado === 'Activa')
    : [];
  const estadoCuota = !alumno ? '' :
    alumno.deuda <= 0 ? 'Al día' :
    alumno.diasMora > 20 ? 'Bloqueado' :
    alumno.diasMora > 15 ? 'Vencida' : 'Próxima a vencer';

  const esAlumno = usuarioActual?.actor === 'Alumno';

  function handleDesinscribir(inscripcionId) {
    updateDb(prev => ({
      ...prev,
      inscripcionesClase: (prev.inscripcionesClase || []).map(i =>
        i.id === inscripcionId ? { ...i, estado: 'Cancelada' } : i
      ),
    }));
    mostrarMensaje('warning', 'Inscripción cancelada.');
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Estado de cuenta</h2>
          <p>Historial de pagos, deuda e inscripciones</p>
        </div>
      </div>

      {!esAlumno && (
        <div style={{ marginBottom: 16 }}>
          <select value={alumnoId} onChange={e => setAlumnoId(e.target.value)}>
            {alumnosPermitidos().map(a => (
              <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
            ))}
          </select>
        </div>
      )}

      {alumno && (
        <>
          <div className="cards-grid">
            <StatCard label="Alumno" value={`${alumno.nombre} ${alumno.apellido}`} note={alumno.sede} kind="info" />
            <StatCard label="Deuda de cuota" value={money(alumno.deuda)} note={`Vence: ${alumno.fechaLimitePago}`} kind={alumno.deuda > 0 ? 'warning' : 'success'} />
            <StatCard label="Estado de cuota" value={<Badge texto={estadoCuota} />} note={`Días de mora: ${alumno.diasMora}`} kind={alumno.deuda <= 0 ? 'success' : 'warning'} />
            <StatCard label="Estado del alumno" value={<Badge texto={alumno.estado} />} note={alumno.sede} kind={alumno.estado === 'Activo' ? 'success' : 'danger'} />
          </div>

          <div className="card table-card">
            <h3>Clases inscriptas</h3>
            <table>
              <thead>
                <tr><th>Clase</th><th>Fecha inscripción</th><th>Precio pagado</th>{!esAlumno && <th></th>}</tr>
              </thead>
              <tbody>
                {clasesInscriptas.map(i => (
                  <tr key={i.id}>
                    <td><strong>{i.claseNombre}</strong></td>
                    <td>{i.fechaInscripcion}</td>
                    <td>{money(i.precio)}</td>
                    {!esAlumno && (
                      <td>
                        <button className="btn btn-danger small" onClick={() => handleDesinscribir(i.id)}>
                          Desinscribir
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {!clasesInscriptas.length && <tr><td colSpan={esAlumno ? 3 : 4}>Sin inscripciones activas.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="card table-card" style={{ marginTop: 16 }}>
            <h3>Pagos de cuota mensual</h3>
            <table>
              <thead>
                <tr><th>Fecha</th><th>Monto</th><th>Medio</th><th>Descuento</th><th>Total</th><th>Recibo</th></tr>
              </thead>
              <tbody>
                {pagosMensualidad.map(p => (
                  <tr key={p.id}>
                    <td>{p.fecha}</td>
                    <td>{money(p.monto)}</td>
                    <td>{p.medio}</td>
                    <td>{money(p.descuento)}</td>
                    <td><strong>{money(p.total)}</strong></td>
                    <td>{p.recibo}</td>
                  </tr>
                ))}
                {!pagosMensualidad.length && <tr><td colSpan={6}>Sin pagos de cuota registrados.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="card table-card" style={{ marginTop: 16 }}>
            <h3>Pagos de clases</h3>
            <table>
              <thead>
                <tr><th>Fecha</th><th>Clase</th><th>Total</th><th>Recibo</th></tr>
              </thead>
              <tbody>
                {pagosClases.map(p => (
                  <tr key={p.id}>
                    <td>{p.fecha}</td>
                    <td>{p.claseNombre}</td>
                    <td><strong>{money(p.total)}</strong></td>
                    <td>{p.recibo}</td>
                  </tr>
                ))}
                {!pagosClases.length && <tr><td colSpan={4}>Sin pagos de clases registrados.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
