'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const roleColor = { Administrador: '#16a34a', Secretaria: '#2563eb', Encargado: '#f59e0b', Profesor: '#7c3aed', Alumno: '#0891b2' };
const roleIcon  = { Administrador: '⚙️', Secretaria: '📋', Encargado: '🔑', Profesor: '💪', Alumno: '🏃' };

export default function Login() {
  const { db, iniciarSesion } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const ok = iniciarSesion(email.trim(), password.trim());
    if (!ok) setError(true);
    else setError(false);
  }

  function usarAcceso(u) {
    setEmail(u.email);
    setPassword(u.password);
    setError(false);
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="1.5" y="10.5" width="2.5" height="3" rx="0.6"/>
              <rect x="4" y="8.5" width="3" height="7" rx="0.8"/>
              <rect x="7" y="11.2" width="10" height="1.6" rx="0.4"/>
              <rect x="17" y="8.5" width="3" height="7" rx="0.8"/>
              <rect x="20" y="10.5" width="2.5" height="3" rx="0.6"/>
            </svg>
          </div>
          <div>
            <h1>SquatGym</h1>
            <p>Sistema de gestión de gimnasio</p>
          </div>
        </div>

        <div className="login-form">
          <h2 style={{ marginBottom: 18 }}>Iniciar sesión</h2>
          <form className="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              Correo electrónico
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(false); }} placeholder="correo@ejemplo.com" required />
            </label>
            <label>
              Contraseña
              <div className="password-row">
                <input type={mostrarPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(false); }} placeholder="••••••••" required />
                <button type="button" className="btn btn-light" onClick={() => setMostrarPass(v => !v)}>
                  {mostrarPass ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </label>
            {error && <div className="message error">Correo o contraseña incorrectos.</div>}
            <button type="submit" className="btn btn-primary full">Ingresar</button>
          </form>
        </div>

        <div className="quick-access">
          <h3 style={{ marginBottom: 14 }}>Acceso rápido</h3>
          <div className="quick-grid">
            {(db?.usuarios || []).map(u => {
              const c = roleColor[u.actor] || '#6b7280';
              return (
                <div key={u.id} className="quick-card" style={{ borderLeft: `4px solid ${c}` }}>
                  <div className="quick-role-badge" style={{ color: c }}>{roleIcon[u.actor] || '👤'} {u.actor}</div>
                  <strong>{u.nombre}</strong>
                  <span>{u.email}</span>
                  <span>{u.password}</span>
                  <button className="btn btn-light small" onClick={() => usarAcceso(u)}>Usar este acceso</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
