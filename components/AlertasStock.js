'use client';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { productoEstado } from '../utils/helpers';

export default function AlertasStock() {
  const { db, productosPermitidos } = useApp();
  if (!db) return null;

  const criticos = productosPermitidos().filter(p => productoEstado(p) !== 'Disponible');

  return (
    <div>
      <div className="section-header">
        <div><h2>Alertas de stock</h2><p>Productos que requieren reposición inmediata</p></div>
      </div>

      {criticos.length ? (
        <div className="alerts-list">
          {criticos.map(p => (
            <div key={p.id} className={`alert-card ${productoEstado(p) === 'Agotado' ? 'danger' : ''}`}>
              <h3>{p.nombre}</h3>
              <p>{p.sede} — Stock actual: {p.stock} / mínimo {p.minimo}</p>
              <Badge texto={productoEstado(p)} />
              <p><small style={{ color: 'var(--muted)' }}>Acción automática del sistema</small></p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 42 }}>
          <div style={{ fontSize: 40 }}>✅</div>
          <h3>Sin alertas de stock</h3>
          <p>Todos los productos están en niveles óptimos.</p>
        </div>
      )}
    </div>
  );
}
