'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { uid, today, money } from '../utils/helpers';

export default function PagoDigital() {
  const { db, usuarioActual, guardarDatos, addAccionToDb, mostrarMensaje } = useApp();
  const [medio, setMedio] = useState('Transferencia');
  const [aprobado, setAprobado] = useState(false);

  if (!db || !usuarioActual) return null;

  const alumno = db.alumnos.find(a => a.id === usuarioActual.alumnoId);
  if (!alumno) return <div className="card"><p>Sin alumno asociado.</p></div>;

  const monto = alumno.deuda || db.planes[0]?.precio || 0;

  function handlePago(e) {
    e.preventDefault();
    const pago = { id: uid('p'), alumnoId: alumno.id, fecha: today(), medio, monto, descuento: 0, total: monto, recibo: `R-${String(db.pagos.length + 1).padStart(4, '0')}` };
    const nuevaDeuda = Math.max(0, alumno.deuda - monto);
    const newAlumnos = db.alumnos.map(a => a.id === alumno.id ? { ...a, deuda: nuevaDeuda, estado: nuevaDeuda <= 0 ? 'Activo' : a.estado, diasMora: nuevaDeuda <= 0 ? 0 : a.diasMora } : a);
    let newDb = { ...db, pagos: [...db.pagos, pago], alumnos: newAlumnos };
    if (nuevaDeuda <= 0) {
      newDb = addAccionToDb(newDb, 'Rehabilitación de acceso', 'Gestión de Alumnos', `El sistema rehabilitó a ${alumno.nombre} ${alumno.apellido} tras confirmar el pago.`, 'Informativa');
    }
    guardarDatos(newDb);
    setAprobado(true);
    mostrarMensaje('success', 'Pago digital simulado aprobado.');
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Pago digital simulado</h2><p>Realizá tu pago desde la app</p></div>
      </div>

      <div className="two-columns">
        <div className="card">
          <h3>Datos del pago</h3>
          <p><strong>{alumno.nombre} {alumno.apellido}</strong></p>
          <p>Sede: {alumno.sede}</p>
          <p>Monto a pagar:</p>
          <div className="total-box">{money(monto)}</div>

          {!aprobado ? (
            <form className="form" onSubmit={handlePago} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              <label>
                Medio de pago
                <select value={medio} onChange={e => setMedio(e.target.value)}>
                  {['Transferencia', 'Débito', 'Crédito', 'QR'].map(m => <option key={m}>{m}</option>)}
                </select>
              </label>
              <button type="submit" className="btn btn-primary full">Confirmar pago</button>
            </form>
          ) : (
            <div className="receipt" style={{ marginTop: 16 }}>
              <h3>✅ Pago aprobado</h3>
              <p>Tu pago fue procesado correctamente.</p>
              <p>Medio: {medio}</p>
              <p>Monto: <strong>{money(monto)}</strong></p>
            </div>
          )}
        </div>

        <div className="card soft">
          <h3>Información</h3>
          <p>El pago digital es simulado. No se procesa ningún débito real.</p>
          <p>Una vez confirmado, tu deuda quedará saldada y tu acceso será rehabilitado automáticamente.</p>
          {medio === 'QR' && (
            <div style={{ marginTop: 16, textAlign: 'center', padding: 24, background: '#f3f4f6', borderRadius: 12 }}>
              <div style={{ fontSize: 64 }}>📱</div>
              <p>Código QR simulado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
