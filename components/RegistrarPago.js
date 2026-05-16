'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { uid, today, money } from '../utils/helpers';

export default function RegistrarPago() {
  const { db, alumnosPermitidos, guardarDatos, addAccionToDb, mostrarMensaje } = useApp();
  const [alumnoId, setAlumnoId] = useState('');
  const [monto, setMonto] = useState('');
  const [medio, setMedio] = useState('Efectivo');
  const [fecha, setFecha] = useState(today());
  const [promoId, setPromoId] = useState('pr1');
  const [recibo, setRecibo] = useState(null);

  useEffect(() => {
    if (!db) return;
    const permitidos = alumnosPermitidos();
    if (permitidos.length) {
      const a = permitidos[0];
      setAlumnoId(a.id);
      setMonto(a.deuda || 0);
    }
  }, [db]);

  useEffect(() => {
    if (!db || !alumnoId) return;
    const a = db.alumnos.find(x => x.id === alumnoId);
    if (a) setMonto(a.deuda || db.planes[0]?.precio || 0);
  }, [alumnoId, db]);

  if (!db) return null;

  const alumno = db.alumnos.find(x => x.id === alumnoId);
  const montoNum = Number(monto) || 0;
  const promo = db.promociones.find(p => p.id === promoId);
  const descuento = promo ? Math.round(montoNum * (promo.valor || 0) / 100) : 0;
  const total = Math.max(0, montoNum - descuento);

  function handleSubmit(e) {
    e.preventDefault();
    if (!alumno) return;
    const pago = { id: uid('p'), alumnoId: alumno.id, fecha, medio, monto: montoNum, descuento, total, recibo: `R-${String(db.pagos.length + 1).padStart(4, '0')}`, tipo: 'Mensualidad' };
    let newAlumnos = db.alumnos.map(a => {
      if (a.id !== alumno.id) return a;
      const nuevaDeuda = Math.max(0, a.deuda - total);
      return { ...a, deuda: nuevaDeuda, estado: nuevaDeuda <= 0 ? 'Activo' : a.estado, diasMora: nuevaDeuda <= 0 ? 0 : a.diasMora, fechaLimitePago: nuevaDeuda <= 0 ? today() : a.fechaLimitePago };
    });
    let newDb = { ...db, pagos: [...db.pagos, pago], alumnos: newAlumnos };
    const alumnoActualizado = newAlumnos.find(a => a.id === alumno.id);
    if (alumnoActualizado?.deuda <= 0) {
      newDb = addAccionToDb(newDb, 'Rehabilitación de acceso', 'Gestión de Alumnos', `El sistema rehabilitó a ${alumno.nombre} ${alumno.apellido} tras confirmar el pago.`, 'Informativa');
    }
    guardarDatos(newDb);
    setRecibo(pago);
    mostrarMensaje('success', 'Pago registrado y recibo emitido correctamente.');
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Registrar pago</h2><p>Ingresá los datos del cobro</p></div>
      </div>

      <div className="two-columns">
        <div className="card">
          <form className="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              Alumno
              <select value={alumnoId} onChange={e => setAlumnoId(e.target.value)}>
                {alumnosPermitidos().map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
              </select>
            </label>
            <label>Fecha <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required /></label>
            <label>
              Medio de pago
              <select value={medio} onChange={e => setMedio(e.target.value)}>
                {['Efectivo', 'Transferencia', 'Débito', 'Crédito', 'QR'].map(m => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label>
              Promoción
              <select value={promoId} onChange={e => setPromoId(e.target.value)}>
                {db.promociones.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.valor}%)</option>)}
              </select>
            </label>
            <label>Monto <input type="number" min="0" value={monto} onChange={e => setMonto(e.target.value)} required /></label>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Registrar pago</button>
            </div>
          </form>
        </div>

        <div className="card">
          <h3>Resumen del pago</h3>
          {alumno && (
            <div style={{ marginBottom: 12 }}>
              <strong>{alumno.nombre} {alumno.apellido}</strong>
              <p>Deuda actual: {money(alumno.deuda)}</p>
              <p>Descuento: {money(descuento)}</p>
              <div className="total-box">Total: {money(total)}</div>
            </div>
          )}

          {recibo && (
            <div className="receipt">
              <h3>Recibo digital simulado</h3>
              <p><strong>{recibo.recibo}</strong></p>
              <p>Alumno: {alumno?.nombre} {alumno?.apellido}</p>
              <p>Fecha: {recibo.fecha}</p>
              <p>Medio: {recibo.medio}</p>
              <p>Monto: {money(recibo.monto)}</p>
              <p>Descuento: {money(recibo.descuento)}</p>
              <p>Total: <strong>{money(recibo.total)}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
