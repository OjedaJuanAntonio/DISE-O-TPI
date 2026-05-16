'use client';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import Badge from './Badge';
export default function GestionAlumnos() {
  const { db, navegarA } = useApp();
  if (!db) return null;

  const activos = db.alumnos.filter(a => a.estado === 'Activo').length;
  const deudores = db.alumnos.filter(a => a.estado === 'Deudor').length;
  const bloqueados = db.alumnos.filter(a => a.estado === 'Bloqueado').length;

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Gestión de Alumnos</h2>
          <p>Resumen general del padrón</p>
        </div>
      </div>

      <div className="cards-grid">
        <StatCard label="Total alumnos activos" value={activos} note="Estado activo" kind="success" />
        <StatCard label="Alumnos con deuda" value={deudores} note="Mora mayor a 15 días" kind={deudores > 0 ? 'warning' : 'success'} />
        <StatCard label="Bloqueados por mora" value={bloqueados} note="Mora mayor a 20 días" kind={bloqueados > 0 ? 'danger' : 'success'} />
        <StatCard label="Sedes activas" value={db.sedes.length} note="Sede 1 y Sede 2" kind="info" />
      </div>

      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => navegarA('alumnos-listado')}>Ver listado completo</button>
        <button className="btn btn-light" onClick={() => navegarA('alumno-formulario')}>Registrar alumno</button>
        <button className="btn btn-light" onClick={() => navegarA('estado-cuenta')}>Estado de cuenta</button>
      </div>

      <div className="card">
        <h3>Últimos alumnos</h3>
        {[...db.alumnos].slice(-6).reverse().map(a => (
          <div key={a.id} className="list-item">
            <div>
              <strong>{a.nombre} {a.apellido}</strong>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--muted)' }}>{a.sede}</span>
            </div>
            <Badge texto={a.estado} />
          </div>
        ))}
      </div>
    </div>
  );
}
