'use client';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { permisos } from '../utils/permissions';

export default function MiPerfil() {
  const { usuarioActual } = useApp();
  if (!usuarioActual) return null;

  const allowed = permisos[usuarioActual.actor]?.length || 0;

  return (
    <div>
      <div className="section-header">
        <div><h2>Mi perfil</h2><p>Información de tu cuenta</p></div>
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <h3>Usuario conectado</h3>
          <p><strong>{usuarioActual.nombre}</strong></p>
          <p>{usuarioActual.email}</p>
        </div>
        <div className="detail-item">
          <h3>Actor iniciador</h3>
          <p><Badge texto={usuarioActual.actor} /></p>
          <p>Sede: {usuarioActual.sede}</p>
        </div>
        <div className="detail-item">
          <h3>Permisos principales</h3>
          <p>{allowed} secciones disponibles</p>
          <p>Último acceso: {new Date().toLocaleString('es-AR')}</p>
        </div>
      </div>
    </div>
  );
}
