'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { uid } from '../utils/helpers';

const EMPTY = { nombre: '', tipo: 'Porcentaje', valor: '', descripcion: '', estado: 'Activa' };

export default function Promociones() {
  const { db, usuarioActual, guardarDatos, mostrarMensaje } = useApp();
  const [form, setForm] = useState(EMPTY);
  const esAdmin = usuarioActual?.actor === 'Administrador';

  if (!db) return null;

  function set(f, v) { setForm(prev => ({ ...prev, [f]: v })); }

  function handleAgregar(e) {
    e.preventDefault();
    const nueva = { id: uid('pr'), ...form, valor: Number(form.valor) };
    guardarDatos({ ...db, promociones: [...db.promociones, nueva] });
    setForm(EMPTY);
    mostrarMensaje('success', 'Promoción agregada.');
  }

  function handleEliminar(id) {
    guardarDatos({ ...db, promociones: db.promociones.filter(p => p.id !== id) });
    mostrarMensaje('warning', 'Promoción eliminada.');
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Promociones y descuentos</h2><p>Cupones y descuentos disponibles</p></div>
      </div>

      <div className="cards-grid">
        {db.promociones.map(p => (
          <div key={p.id} className="stat-card" style={{ position: 'relative' }}>
            <div className="stat-label">{p.tipo}</div>
            <div className="stat-value">{p.valor}%</div>
            <h3 style={{ margin: '4px 0' }}>{p.nombre}</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 8px' }}>{p.descripcion}</p>
            <Badge texto={p.estado} />
            {esAdmin && (
              <button
                className="btn btn-danger small"
                style={{ marginTop: 12, width: '100%' }}
                onClick={() => handleEliminar(p.id)}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      {esAdmin && (
        <div className="card" style={{ marginTop: 24, maxWidth: 480 }}>
          <h3 style={{ marginBottom: 16 }}>Agregar promoción</h3>
          <form className="form" onSubmit={handleAgregar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>Nombre <input value={form.nombre} onChange={e => set('nombre', e.target.value)} required /></label>
            <label>
              Tipo
              <select value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                <option>Porcentaje</option>
                <option>Base</option>
              </select>
            </label>
            <label>Valor (%) <input type="number" min="0" max="100" value={form.valor} onChange={e => set('valor', e.target.value)} required /></label>
            <label>Descripción <input value={form.descripcion} onChange={e => set('descripcion', e.target.value)} /></label>
            <label>
              Estado
              <select value={form.estado} onChange={e => set('estado', e.target.value)}>
                <option>Activa</option>
                <option>Inactiva</option>
              </select>
            </label>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Agregar promoción</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
