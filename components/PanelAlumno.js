'use client';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import Badge from './Badge';
import { money } from '../utils/helpers';

export default function PanelAlumno() {
  const { db, usuarioActual, navegarA } = useApp();
  if (!db || !usuarioActual) return null;

  const alumno = db.alumnos.find(a => a.id === usuarioActual.alumnoId);
  if (!alumno) return (
    <div className="empty-state">
      <h2>Perfil no encontrado</h2>
      <p>No se encontró el alumno asociado a tu cuenta.</p>
    </div>
  );

  const clasesInscriptas = (db.inscripcionesClase || []).filter(i => i.alumnoId === alumno.id && i.estado === 'Activa');

  return (
    <div>
      <div className="hero">
        <h2>Bienvenido/a, {alumno.nombre}</h2>
        <p>Mensualidad general — {alumno.sede}</p>
      </div>

      <div className="cards-grid">
        <StatCard
          label="Estado del alumno"
          value={<Badge texto={alumno.estado} />}
          note={alumno.sede}
          kind={alumno.estado === 'Activo' ? 'success' : alumno.estado === 'Bloqueado' ? 'danger' : 'warning'}
        />
        <StatCard
          label="Cuota general"
          value={alumno.deuda > 0 ? money(alumno.deuda) : 'Al día'}
          note={`Vence: ${alumno.fechaLimitePago}`}
          kind={alumno.deuda > 0 ? 'warning' : 'success'}
        />
        <StatCard
          label="Clases inscriptas"
          value={clasesInscriptas.length}
          note="Activas este mes"
          kind="info"
        />
      </div>

      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => navegarA('estado-cuenta')}>Ver estado de cuenta</button>
<button className="btn btn-light" onClick={() => navegarA('cronograma-plan')}>Ver cronograma</button>
        <button className="btn btn-light" onClick={() => navegarA('declaracion-jurada')}>Declaración jurada</button>
      </div>
    </div>
  );
}
