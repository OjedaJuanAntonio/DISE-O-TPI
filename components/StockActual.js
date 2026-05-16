'use client';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import StatCard from './StatCard';
import { productoEstado } from '../utils/helpers';

export default function StockActual() {
  const { db, usuarioActual, productosPermitidos } = useApp();
  if (!db) return null;

  const productos = productosPermitidos();
  const disponibles = productos.filter(p => productoEstado(p) === 'Disponible').length;
  const stockBajo = productos.filter(p => productoEstado(p) === 'Stock bajo').length;
  const agotados = productos.filter(p => productoEstado(p) === 'Agotado').length;
  const stockTotal = productos.reduce((t, p) => t + Number(p.stock || 0), 0);
  const pedidosPendientes = db.pedidosReposicion.filter(r => r.estado !== 'Recibido').length;

  return (
    <div>
      <div className="section-header">
        <div><h2>Stock actual</h2><p>Estado del inventario por producto y sede</p></div>
      </div>

      <div className="cards-grid">
        <StatCard label="Stock total" value={stockTotal} note="Unidades disponibles" kind="info" />
        <StatCard label="Productos disponibles" value={disponibles} note="Con stock suficiente" kind="success" />
        <StatCard label="Stock bajo" value={stockBajo} note="Requiere reposición" kind={stockBajo > 0 ? 'warning' : 'success'} />
        <StatCard label="Agotados" value={agotados} note="Sin disponibilidad" kind={agotados > 0 ? 'danger' : 'success'} />
        <StatCard label="Pedidos pendientes" value={pedidosPendientes} note="Reposiciones" kind={pedidosPendientes > 0 ? 'warning' : 'success'} />
        {!['Encargado', 'Secretaria'].includes(usuarioActual?.actor) && (
          <StatCard label="Sedes con inventario" value={db.sedes.length} note="Sede 1 y Sede 2" kind="info" />
        )}
      </div>

      <div className="card table-card">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Sede</th><th>Stock</th><th>Mínimo</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td><strong>{p.nombre}</strong></td>
                <td>{p.sede}</td>
                <td>{p.stock}</td>
                <td>{p.minimo}</td>
                <td><Badge texto={productoEstado(p)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
