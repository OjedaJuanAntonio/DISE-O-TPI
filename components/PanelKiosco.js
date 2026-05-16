'use client';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import Badge from './Badge';
import { today, money, productoEstado } from '../utils/helpers';

export default function PanelKiosco() {
  const { db, usuarioActual, productosPermitidos, navegarA } = useApp();
  if (!db) return null;

  const sede = usuarioActual?.sede;
  const sedeFija = ['Encargado', 'Secretaria'].includes(usuarioActual?.actor);
  const productos = productosPermitidos();
  const ventasHoy = db.ventas.filter(v => v.fecha === today() && (!sedeFija || v.sede === sede));
  const recaudado = ventasHoy.reduce((s, v) => s + v.total, 0);
  const stockBajo = productos.filter(p => productoEstado(p) === 'Stock bajo').length;
  const agotados = productos.filter(p => productoEstado(p) === 'Agotado').length;
  const stockTotal = productos.reduce((t, p) => t + Number(p.stock || 0), 0);
  const pedidosPendientes = db.pedidosReposicion.filter(p => p.estado !== 'Recibido' && (!sedeFija || p.sede === sede)).length;

  return (
    <div>
      <div className="hero">
        <h2>Administración de Kiosco</h2>
        <p>Gestión de productos, ventas e inventario</p>
      </div>

      <div className="cards-grid">
        <StatCard label="Ventas del día" value={ventasHoy.length} note="Operaciones registradas" kind="info" />
        <StatCard label="Total recaudado" value={money(recaudado)} note="Recaudación del kiosco" kind="success" />
        <StatCard label="Stock bajo" value={stockBajo} note="Requiere reposición" kind={stockBajo > 0 ? 'warning' : 'success'} />
        <StatCard label="Productos agotados" value={agotados} note="Sin disponibilidad" kind={agotados > 0 ? 'danger' : 'success'} />
        <StatCard label="Stock total" value={stockTotal} note="Unidades registradas" kind="info" />
        <StatCard label="Pedidos pendientes" value={pedidosPendientes} note="Reposiciones" kind={pedidosPendientes > 0 ? 'warning' : 'success'} />
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
          {productos.filter(p => productoEstado(p) !== 'Disponible').map(p => (
            <div key={p.id} className="list-item">
              <span>{p.nombre} ({p.stock})</span>
              <Badge texto={productoEstado(p)} />
            </div>
          ))}
          {!productos.filter(p => productoEstado(p) !== 'Disponible').length && <p>Sin productos críticos.</p>}
        </div>
      </div>
    </div>
  );
}
