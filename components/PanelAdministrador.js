'use client';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import Badge from './Badge';
import { money } from '../utils/helpers';

export default function PanelAdministrador() {
  const { db, navegarA } = useApp();
  if (!db) return null;

  const activos = db.alumnos.filter(a => a.estado === 'Activo').length;
  const deudores = db.alumnos.filter(a => a.estado === 'Deudor').length;
  const bloqueados = db.alumnos.filter(a => a.estado === 'Bloqueado').length;

  return (
    <div>
      <div className="hero">
        <h2>Panel de Administración</h2>
        <p>Resumen general del sistema SquatGym</p>
      </div>

      <div className="cards-grid">
        <StatCard label="Alumnos activos" value={activos} note="Estado activo" kind="success" />
        <StatCard label="Alumnos deudores" value={deudores} note="Mora mayor a 15 días" kind={deudores > 0 ? 'warning' : 'info'} />
        <StatCard label="Alumnos bloqueados" value={bloqueados} note="Mora mayor a 20 días" kind={bloqueados > 0 ? 'danger' : 'info'} />
      </div>

      <div className="two-columns">
        <div className="card">
          <h3>Acciones automáticas recientes</h3>
          {db.accionesSistema.slice(0, 5).map(a => (
            <div key={a.id} className="list-item">
              <span style={{ fontSize: 13 }}>{a.descripcion}</span>
              <Badge texto={a.severidad} />
            </div>
          ))}
          {!db.accionesSistema.length && <p>Sin acciones recientes.</p>}
        </div>
        <div className="card">
          <h3>Últimos alumnos registrados</h3>
          {[...db.alumnos].slice(-5).reverse().map(a => (
            <div key={a.id} className="list-item">
              <span>{a.nombre} {a.apellido}</span>
              <Badge texto={a.estado} />
            </div>
          ))}
          {!db.alumnos.length && <p>Sin alumnos registrados.</p>}
        </div>
      </div>

      <div className="card">
        <h3>Alertas de vencimiento</h3>
        {db.alumnos.filter(a => a.deuda > 0).map(a => (
          <div key={a.id} className="list-item">
            <span>{a.nombre} {a.apellido}: {money(a.deuda)}</span>
            <Badge texto={a.estado} />
          </div>
        ))}
        {!db.alumnos.filter(a => a.deuda > 0).length && <p>Sin vencimientos críticos.</p>}
      </div>

      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => navegarA('alumnos-listado')}>Ver alumnos</button>
        <button className="btn btn-light" onClick={() => navegarA('ventas-diarias')}>Ventas del día</button>
        <button className="btn btn-light" onClick={() => navegarA('acciones-automaticas-sistema')}>Acciones automáticas</button>
      </div>
    </div>
  );
}
