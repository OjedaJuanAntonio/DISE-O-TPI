'use client';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import { today } from '../utils/helpers';

export default function PanelProfesor() {
  const { db, usuarioActual, navegarA } = useApp();
  if (!db) return null;

  const sede = usuarioActual?.sede;
  const clasesSede = db.clases.filter(c => c.sede === sede).length;
  const alumnosSede = db.alumnos.filter(a => a.sede === sede).length;
  const asistenciasHoy = db.asistencias.filter(a => a.fecha === today()).length;
  const bloqueadosSede = db.alumnos.filter(a => a.sede === sede && a.estado === 'Bloqueado').length;

  return (
    <div>
      <div className="hero">
        <h2>Panel del Profesor</h2>
        <p>Gestión de clases y asistencia — {sede}</p>
      </div>

      <div className="cards-grid">
        <StatCard label="Clases asignadas" value={clasesSede} note={sede} kind="info" />
        <StatCard label="Alumnos de la sede" value={alumnosSede} note="Disponibles para clase" kind="success" />
        <StatCard label="Asistencias de hoy" value={asistenciasHoy} note="Registros" kind="info" />
        <StatCard label="Alumnos bloqueados" value={bloqueadosSede} note="No habilitados" kind={bloqueadosSede > 0 ? 'danger' : 'success'} />
      </div>

      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => navegarA('asistencia-alumnos')}>Tomar asistencia</button>
        <button className="btn btn-light" onClick={() => navegarA('historial-asistencia')}>Ver historial</button>
        <button className="btn btn-light" onClick={() => navegarA('cronograma-plan')}>Ver cronograma</button>
      </div>
    </div>
  );
}
