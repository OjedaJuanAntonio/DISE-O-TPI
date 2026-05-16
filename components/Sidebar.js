'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { menuConfig } from '../utils/permissions';

export default function Sidebar() {
  const { usuarioActual, seccionActiva, navegarA } = useApp();
  const [abierto, setAbierto] = useState(false);

  if (!usuarioActual) return null;

  return (
    <>
      <aside className={`sidebar${abierto ? ' open' : ''}`} id="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon small">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="1.5" y="10.5" width="2.5" height="3" rx="0.6"/>
              <rect x="4" y="8.5" width="3" height="7" rx="0.8"/>
              <rect x="7" y="11.2" width="10" height="1.6" rx="0.4"/>
              <rect x="17" y="8.5" width="3" height="7" rx="0.8"/>
              <rect x="20" y="10.5" width="2.5" height="3" rx="0.6"/>
            </svg>
          </div>
          <span><strong>SquatGym</strong><br /><small style={{ color: '#9ca3af', fontSize: 12 }}>Sistema</small></span>
        </div>

        <nav id="side-menu">
          {menuConfig.map(group => {
            const visibles = group.items.filter(i => i.roles.includes(usuarioActual.actor));
            if (!visibles.length) return null;
            return (
              <div key={group.grupo}>
                <div className="side-group">{group.grupo}</div>
                {visibles.map(item => (
                  <button
                    key={item.id}
                    className={`menu-item${seccionActiva === item.id ? ' active' : ''}`}
                    onClick={() => { navegarA(item.id); setAbierto(false); }}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span>{item.texto}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>

      {abierto && (
        <div className="sidebar-backdrop" onClick={() => setAbierto(false)} />
      )}

      <button
        className="btn btn-light mobile-only"
        style={{ position: 'fixed', top: 14, left: 14, zIndex: 30 }}
        onClick={() => setAbierto(v => !v)}
      >
        ☰
      </button>
    </>
  );
}
