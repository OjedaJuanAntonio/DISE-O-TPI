'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import { today, money } from '../utils/helpers';

export default function VentasDiarias() {
  const { db, usuarioActual } = useApp();
  const [sede, setSede] = useState(usuarioActual?.actor === 'Encargado' ? (usuarioActual.sede || '') : '');
  const [fecha, setFecha] = useState(today());

  if (!db) return null;

  const rows = db.ventas.filter(v => (!sede || v.sede === sede) && v.fecha === fecha);
  const total = rows.reduce((s, v) => s + v.total, 0);

  return (
    <div>
      <div className="section-header">
        <div><h2>Ventas diarias por sede</h2><p>Reporte de ventas del kiosco</p></div>
      </div>

      <div className="filters">
        {usuarioActual?.actor !== 'Encargado' && (
          <select value={sede} onChange={e => setSede(e.target.value)}>
            <option value="">Todas las sedes</option>
            {db.sedes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      </div>

      <div className="cards-grid">
        <StatCard label="Total recaudado" value={money(total)} note={fecha} kind="success" />
        <StatCard label="Cantidad de ventas" value={rows.length} note={sede || 'Todas las sedes'} kind="info" />
        <StatCard label="Producto más vendido" value={rows[0]?.items[0]?.nombre || '—'} note="Dato simulado" kind="info" />
      </div>

      <div className="card table-card">
        <table>
          <thead>
            <tr><th>Hora</th><th>Productos</th><th>Cantidad total</th><th>Total</th><th>Medio</th><th>Usuario</th></tr>
          </thead>
          <tbody>
            {rows.map(v => (
              <tr key={v.id}>
                <td>{v.hora}</td>
                <td>{v.items.map(i => `${i.nombre} x${i.cantidad}`).join(', ')}</td>
                <td>{v.items.reduce((s, i) => s + i.cantidad, 0)}</td>
                <td><strong>{money(v.total)}</strong></td>
                <td>{v.medio}</td>
                <td>{v.usuario}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={6}>Sin ventas para la selección.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
