'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { uid, today } from '../utils/helpers';

export default function DiferenciasInventario() {
  const { db, usuarioActual, productosPermitidos, guardarDatos, addAccionToDb, mostrarMensaje } = useApp();
  const [productoId, setProductoId] = useState('');
  const [real, setReal] = useState('');
  const [observacion, setObservacion] = useState('');

  useEffect(() => {
    if (!db) return;
    const permitidos = productosPermitidos();
    if (permitidos.length) setProductoId(permitidos[0].id);
  }, [db]);

  if (!db) return null;

  const permitidos = productosPermitidos();
  const producto = db.productos.find(p => p.id === productoId);
  const registrado = producto?.stock ?? 0;
  const diferencia = real !== '' ? Number(real) - registrado : 0;
  const difs = usuarioActual?.actor === 'Encargado'
    ? db.diferenciasInventario.filter(d => {
        const prod = db.productos.find(p => p.nombre === d.producto);
        return prod?.sede === usuarioActual.sede;
      })
    : db.diferenciasInventario;

  function handleSubmit(e) {
    e.preventDefault();
    if (!producto) return;
    const realNum = Number(real);
    const diff = realNum - producto.stock;
    const dif = { id: uid('di'), fecha: today(), producto: producto.nombre, sede: producto.sede, registrado: producto.stock, real: realNum, diferencia: diff, observacion };
    let newDb = { ...db, diferenciasInventario: [dif, ...db.diferenciasInventario], productos: db.productos.map(p => p.id === productoId ? { ...p, stock: realNum } : p) };
    if (diff !== 0) {
      newDb = addAccionToDb(newDb, 'Diferencia de inventario', 'Administración de Kiosco', `El sistema detectó diferencia de ${diff} unidades en ${producto.nombre}.`, 'Advertencia');
    }
    guardarDatos(newDb);
    setReal(''); setObservacion('');
    mostrarMensaje('warning', 'Diferencia de inventario registrada.');
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Diferencias de inventario</h2><p>Registrá discrepancias entre el stock real y el sistema</p></div>
      </div>

      <div className="two-columns">
        <div className="card">
          <h3>Registrar diferencia</h3>
          <form className="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              Producto
              <select value={productoId} onChange={e => setProductoId(e.target.value)} required>
                {permitidos.map(p => <option key={p.id} value={p.id}>{p.nombre} - {p.sede}</option>)}
              </select>
            </label>
            <label>Stock registrado en sistema
              <input type="number" value={registrado} readOnly style={{ background: '#f8fafc' }} />
            </label>
            <label>Stock real contado
              <input type="number" min="0" value={real} onChange={e => setReal(e.target.value)} required />
            </label>
            <label>Diferencia
              <input type="number" value={diferencia} readOnly style={{ background: '#f8fafc', color: diferencia !== 0 ? 'var(--danger)' : 'inherit' }} />
            </label>
            <label>Observación <textarea value={observacion} onChange={e => setObservacion(e.target.value)} /></label>
            <div className="form-actions">
              <button type="submit" className="btn btn-warning">Registrar diferencia</button>
            </div>
          </form>
        </div>

        <div className="card table-card">
          <h3>Diferencias registradas</h3>
          <table>
            <thead>
              <tr><th>Fecha</th><th>Producto</th><th>Sede</th><th>Registrado</th><th>Real</th><th>Diferencia</th><th>Observación</th></tr>
            </thead>
            <tbody>
              {difs.map(d => (
                <tr key={d.id}>
                  <td>{d.fecha}</td>
                  <td>{d.producto}</td>
                  <td>{d.sede}</td>
                  <td>{d.registrado}</td>
                  <td>{d.real}</td>
                  <td style={{ color: d.diferencia !== 0 ? 'var(--danger)' : 'inherit', fontWeight: 700 }}>{d.diferencia}</td>
                  <td>{d.observacion}</td>
                </tr>
              ))}
              {!difs.length && <tr><td colSpan={7}>Sin diferencias registradas.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
