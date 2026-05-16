'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { money, productoEstado } from '../utils/helpers';

export default function InventarioKiosco() {
  const { db, productosPermitidos, guardarDatos, mostrarMensaje, usuarioActual } = useApp();
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [sede, setSede] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [editandoStock, setEditandoStock] = useState(null);
  const [nuevoStock, setNuevoStock] = useState('');
  const [editandoImg, setEditandoImg] = useState(null);
  const [imgModal, setImgModal] = useState(null);

  if (!db) return null;

  const sedeFija = ['Encargado', 'Secretaria'].includes(usuarioActual?.actor);
  const sedesVisibles = sedeFija ? [usuarioActual.sede] : db.sedes;
  const sedeEfectiva = sedeFija ? usuarioActual.sede : sede;

  const permitidos = productosPermitidos();
  const categorias = [...new Set(permitidos.map(p => p.categoria))];

  const rows = permitidos.filter(p =>
    p.nombre.toLowerCase().includes(texto.toLowerCase()) &&
    (!categoria || p.categoria === categoria) &&
    (!sedeEfectiva || p.sede === sedeEfectiva) &&
    (!estadoFiltro || productoEstado(p) === estadoFiltro)
  );

  function guardarStock(id) {
    const val = Number(nuevoStock);
    if (isNaN(val) || val < 0) return;
    const newDb = { ...db, productos: db.productos.map(p => p.id === id ? { ...p, stock: val } : p) };
    guardarDatos(newDb);
    setEditandoStock(null);
    mostrarMensaje('success', 'Stock actualizado correctamente.');
  }

  function guardarImagen(id, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const newDb = { ...db, productos: db.productos.map(p => p.id === id ? { ...p, imagen: ev.target.result } : p) };
      guardarDatos(newDb);
      setEditandoImg(null);
      mostrarMensaje('success', 'Imagen cargada correctamente.');
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Productos e inventario</h2><p>Gestión del stock por producto y sede</p></div>
      </div>

      <div className="filters">
        <input placeholder="Buscar producto..." value={texto} onChange={e => setTexto(e.target.value)} style={{ maxWidth: 220 }} />
        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sedeFija ? usuarioActual.sede : sede} onChange={e => !sedeFija && setSede(e.target.value)} disabled={sedeFija}>
          {!sedeFija && <option value="">Todas las sedes</option>}
          {sedesVisibles.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}>
          <option value="">Todos los estados</option>
          {['Disponible', 'Stock bajo', 'Agotado'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card table-card">
        <table>
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Mínimo</th><th>Sede</th><th>Estado</th><th>Imagen</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td><strong>{p.nombre}</strong></td>
                <td>{p.categoria}</td>
                <td>{money(p.precio)}</td>
                <td>
                  {editandoStock === p.id ? (
                    <span style={{ display: 'flex', gap: 4 }}>
                      <input type="number" min="0" value={nuevoStock} onChange={e => setNuevoStock(e.target.value)} style={{ width: 70, padding: '4px 8px', border: '1px solid var(--primary)', borderRadius: 8 }} />
                      <button className="btn btn-primary small" onClick={() => guardarStock(p.id)}>OK</button>
                      <button className="btn btn-light small" onClick={() => setEditandoStock(null)}>✕</button>
                    </span>
                  ) : p.stock}
                </td>
                <td>{p.minimo}</td>
                <td>{p.sede}</td>
                <td><Badge texto={productoEstado(p)} /></td>
                <td>
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.nombre} className="prod-thumb" onClick={() => setImgModal(p)} style={{ cursor: 'zoom-in' }} />
                  ) : '—'}
                </td>
                <td style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <button className="btn btn-light small" onClick={() => { setEditandoStock(p.id); setNuevoStock(String(p.stock)); }}>Ajustar</button>
                  <button className="btn btn-light small" onClick={() => setEditandoImg(editandoImg === p.id ? null : p.id)}>Imagen</button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={10}>No hay productos.</td></tr>}
          </tbody>
        </table>
      </div>

      {editandoImg && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Cargar imagen para: {db.productos.find(p => p.id === editandoImg)?.nombre}</h3>
          <input type="file" accept="image/*" onChange={e => guardarImagen(editandoImg, e.target.files[0])} />
          <button className="btn btn-light small" style={{ marginLeft: 8 }} onClick={() => setEditandoImg(null)}>Cancelar</button>
        </div>
      )}

      {imgModal && (
        <div className="img-modal" onClick={() => setImgModal(null)}>
          <img src={imgModal.imagen} alt={imgModal.nombre} />
        </div>
      )}
    </div>
  );
}
