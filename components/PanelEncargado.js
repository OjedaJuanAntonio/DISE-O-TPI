'use client';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import { today, money, productoEstado } from '../utils/helpers';

export default function PanelEncargado() {
  const { db, usuarioActual, navegarA } = useApp();
  if (!db) return null;

  const sede = usuarioActual?.sede;
  const alumnosSede = db.alumnos.filter(a => a.sede === sede).length;
  const deudaSede = db.alumnos.filter(a => a.sede === sede && a.deuda > 0).length;
  const ventasHoy = db.ventas.filter(v => v.fecha === today() && v.sede === sede);
  const recaudado = ventasHoy.reduce((s, v) => s + v.total, 0);
  const stockBajoSede = db.productos.filter(p => p.sede === sede && productoEstado(p) !== 'Disponible').length;
  const pedidosPendientes = db.pedidosReposicion.filter(r => r.estado !== 'Recibido').length;

  return (
    <div>
      <div className="hero">
        <h2>Panel de Encargado</h2>
        <p>Control de {sede}</p>
      </div>

      <div className="cards-grid">
        <StatCard label="Alumnos de la sede" value={alumnosSede} note={sede} kind="info" />
        <StatCard label="Alumnos con deuda" value={deudaSede} note="Requieren seguimiento" kind={deudaSede > 0 ? 'warning' : 'success'} />
        <StatCard label="Ventas de la sede" value={ventasHoy.length} note={`Recaudado ${money(recaudado)}`} kind="info" />
        <StatCard label="Stock bajo" value={stockBajoSede} note="De la sede" kind={stockBajoSede > 0 ? 'warning' : 'success'} />
        <StatCard label="Pedidos pendientes" value={pedidosPendientes} note="Reposiciones" kind={pedidosPendientes > 0 ? 'warning' : 'success'} />
      </div>

      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => navegarA('inscripciones-sede')}>Inscripciones por sede</button>
<button className="btn btn-light" onClick={() => navegarA('pedidos-reposicion')}>Pedidos de reposición</button>
        <button className="btn btn-light" onClick={() => navegarA('ventas-diarias')}>Ventas diarias</button>
      </div>
    </div>
  );
}
