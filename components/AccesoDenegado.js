'use client';
import { useApp } from '../context/AppContext';
import { panelInicial } from '../utils/permissions';

export default function AccesoDenegado() {
  const { usuarioActual, navegarA } = useApp();
  return (
    <div className="empty-state">
      <div style={{ fontSize: 48 }}>🔒</div>
      <h2>Acceso denegado</h2>
      <p>No tenés permiso para ver esta sección.</p>
      {usuarioActual && (
        <button className="btn btn-primary" onClick={() => navegarA(panelInicial(usuarioActual.actor))}>
          Ir al panel principal
        </button>
      )}
    </div>
  );
}
