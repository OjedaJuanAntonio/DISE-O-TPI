'use client';
import { useApp } from '../context/AppContext';
import { tituloPorId, panelInicial } from '../utils/permissions';

export default function Topbar() {
  const { usuarioActual, seccionActiva, navegarA, cerrarSesion } = useApp();
  if (!usuarioActual) return null;

  const iniciales = usuarioActual.nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const titulo = tituloPorId(seccionActiva);

  return (
    <header className="topbar">
      <div>
        <h2>{titulo}</h2>
        <p style={{ margin: '2px 0 0', color: 'var(--muted)', fontSize: 14 }}>
          {usuarioActual.nombre} — {usuarioActual.actor}
        </p>
      </div>
      <div className="user-box">
        <div style={{ textAlign: 'right' }}>
          <strong style={{ display: 'block', fontSize: 15 }}>{usuarioActual.nombre}</strong>
          <span>{usuarioActual.actor} — {usuarioActual.sede}</span>
        </div>
        <div className="user-avatar">{iniciales}</div>
        <button className="btn btn-light small" onClick={cerrarSesion}>Cerrar sesión</button>
      </div>
    </header>
  );
}
