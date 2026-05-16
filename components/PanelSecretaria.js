'use client';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import Badge from './Badge';
import { today, money, productoEstado } from '../utils/helpers';

export default function PanelSecretaria() {
  const { db, usuarioActual, navegarA } = useApp();
  if (!db) return null;

  const activos = db.alumnos.filter(a => a.estado === 'Activo').length;
  const conDeuda = db.alumnos.filter(a => a.deuda > 0).length;
  const ventasHoy = db.ventas.filter(v => v.fecha === today() && (!usuarioActual?.sede || usuarioActual.sede === 'Todas' || v.sede === usuarioActual.sede));
  const recaudado = ventasHoy.reduce((s, v) => s + v.total, 0);
  const criticos = db.productos.filter(p => productoEstado(p) !== 'Disponible');

  return (
    <div>
      <div className="hero">
        <h2>Panel de Secretaría</h2>
        <p>Gestión diaria de alumnos y kiosco — {usuarioActual?.sede}</p>
      </div>

      <div className="cards-grid">
        <StatCard label="Alumnos activos" value={activos} note="Gestión diaria" kind="success" />
        <StatCard label="Pagos pendientes" value={conDeuda} note="Alumnos con deuda" kind={conDeuda > 0 ? 'warning' : 'success'} />
        <StatCard label="Ventas del kiosco" value={ventasHoy.length} note={`Recaudado ${money(recaudado)}`} kind="info" />
        <StatCard label="Stock bajo" value={criticos.length} note="Revisar inventario" kind={criticos.length > 0 ? 'warning' : 'success'} />
        <StatCard label="Notificaciones" value={db.notificaciones.length} note="Enviadas" kind="info" />
      </div>

      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => navegarA('alumnos-listado')}>Ver alumnos</button>
        <button className="btn btn-light" onClick={() => navegarA('registrar-pago')}>Registrar pago</button>
        <button className="btn btn-light" onClick={() => navegarA('registrar-venta')}>Registrar venta</button>
      </div>

      <div className="two-columns">
        <div className="card">
          <h3>Últimas ventas</h3>
          {db.ventas.slice(-5).reverse().map(v => (
            <div key={v.id} className="list-item">
              <span>{v.sede} - {v.hora}</span>
              <strong>{money(v.total)}</strong>
            </div>
          ))}
          {!db.ventas.length && <p>Sin ventas.</p>}
        </div>
        <div className="card">
          <h3>Productos críticos</h3>
          {criticos.map(p => (
            <div key={p.id} className="list-item">
              <span>{p.nombre} ({p.stock})</span>
              <Badge texto={productoEstado(p)} />
            </div>
          ))}
          {!criticos.length && <p>Sin productos críticos.</p>}
        </div>
      </div>
    </div>
  );
}
