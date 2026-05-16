'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { uid, today, money, productoEstado } from '../utils/helpers';

export default function RegistrarVenta() {
  const { db, usuarioActual, productosPermitidos, guardarDatos, addAccionToDb, mostrarMensaje } = useApp();
  const [sede, setSede] = useState(usuarioActual?.sede === 'Todas' ? '' : (usuarioActual?.sede || ''));
  const [buscar, setBuscar] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [medio, setMedio] = useState('Efectivo');
  const [comprobante, setComprobante] = useState(null);
  const [imgModal, setImgModal] = useState(null);

  if (!db) return null;

  const productos = productosPermitidos().filter(p =>
    (!sede || p.sede === sede) && p.nombre.toLowerCase().includes(buscar.toLowerCase())
  );

  const total = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);

  function agregar(id) {
    const p = db.productos.find(x => x.id === id);
    const item = carrito.find(i => i.productoId === id);
    const qty = item ? item.cantidad + 1 : 1;
    if (qty > p.stock) { mostrarMensaje('error', 'No se puede vender más cantidad que el stock disponible.'); return; }
    setCarrito(prev => item ? prev.map(i => i.productoId === id ? { ...i, cantidad: i.cantidad + 1 } : i) : [...prev, { productoId: id, nombre: p.nombre, precio: p.precio, cantidad: 1 }]);
  }

  function quitar(id) { setCarrito(prev => prev.filter(i => i.productoId !== id)); }

  function setCantidad(id, cantidad) {
    const p = db.productos.find(x => x.id === id);
    const c = Math.max(1, Number(cantidad));
    if (c > p.stock) { mostrarMensaje('error', 'No se puede vender más cantidad que el stock disponible.'); return; }
    setCarrito(prev => prev.map(i => i.productoId === id ? { ...i, cantidad: c } : i));
  }

  function confirmarVenta() {
    if (!carrito.length) { mostrarMensaje('warning', 'Agregá productos al carrito.'); return; }
    for (const item of carrito) {
      const p = db.productos.find(x => x.id === item.productoId);
      if (item.cantidad > p.stock) { mostrarMensaje('error', `Stock insuficiente para ${p.nombre}.`); return; }
    }
    let newDb = { ...db };
    const newProductos = db.productos.map(p => {
      const item = carrito.find(i => i.productoId === p.id);
      if (!item) return p;
      return { ...p, stock: p.stock - item.cantidad };
    });
    newDb.productos = newProductos;
    newProductos.forEach(p => {
      if (productoEstado(p) !== 'Disponible') {
        newDb = addAccionToDb(newDb, 'Alerta de stock', 'Administración de Kiosco', `El sistema detectó ${productoEstado(p).toLowerCase()} en ${p.nombre}.`, productoEstado(p) === 'Agotado' ? 'Crítica' : 'Advertencia');
      }
    });
    const venta = { id: uid('v'), fecha: today(), hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }), sede: sede || (usuarioActual?.sede !== 'Todas' ? usuarioActual?.sede : 'Sede 1'), items: [...carrito], total, medio, usuario: usuarioActual.nombre };
    newDb.ventas = [...newDb.ventas, venta];
    guardarDatos(newDb);
    setComprobante(venta);
    setCarrito([]);
    mostrarMensaje('success', 'Venta registrada y stock actualizado.');
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Registrar venta</h2><p>Punto de venta del kiosco</p></div>
      </div>

      <div className="two-columns wide">
        <div>
          <div className="filters">
            {(usuarioActual?.sede === 'Todas' || !usuarioActual?.sede) && (
              <select value={sede} onChange={e => setSede(e.target.value)}>
                <option value="">Todas las sedes</option>
                {db.sedes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
            <input placeholder="Buscar producto..." value={buscar} onChange={e => setBuscar(e.target.value)} />
          </div>

          <div className="product-list">
            {productos.map(p => (
              <div key={p.id} className="product-card">
                {p.imagen && (
                  <img src={p.imagen} alt={p.nombre} className="product-img" onClick={() => setImgModal(p)} />
                )}
                <strong>{p.nombre}</strong>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0' }}>{p.categoria} — {money(p.precio)}</p>
                <p style={{ fontSize: 13, margin: '4px 0' }}>Stock: {p.stock} <Badge texto={productoEstado(p)} /></p>
                <button className="btn btn-primary small" onClick={() => agregar(p.id)} disabled={p.stock <= 0}>
                  Agregar
                </button>
              </div>
            ))}
            {!productos.length && <p>No hay productos disponibles.</p>}
          </div>
        </div>

        <div className="card">
          <h3>Carrito</h3>
          {carrito.map(i => (
            <div key={i.productoId} className="list-item">
              <div>
                <strong>{i.nombre}</strong>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{money(i.precio)} c/u</div>
              </div>
              <input type="number" min="1" value={i.cantidad} onChange={e => setCantidad(i.productoId, e.target.value)} style={{ maxWidth: 70 }} />
              <button className="btn btn-danger small" onClick={() => quitar(i.productoId)}>Quitar</button>
            </div>
          ))}
          {!carrito.length && <p>Carrito vacío.</p>}

          <div className="total-box">Total: {money(total)}</div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
            Medio de pago
            <select value={medio} onChange={e => setMedio(e.target.value)}>
              {['Efectivo', 'Tarjeta', 'Transferencia', 'QR'].map(m => <option key={m}>{m}</option>)}
            </select>
          </label>

          <button className="btn btn-primary full" onClick={confirmarVenta} disabled={!carrito.length}>
            Confirmar venta
          </button>

          {comprobante && (
            <div className="receipt" style={{ marginTop: 14 }}>
              <h3>Comprobante simulado</h3>
              <p>Venta {comprobante.id}</p>
              <p>{comprobante.fecha} {comprobante.hora}</p>
              <p>Total: <strong>{money(comprobante.total)}</strong></p>
            </div>
          )}
        </div>
      </div>

      {imgModal && (
        <div className="img-modal" onClick={() => setImgModal(null)}>
          <img src={imgModal.imagen} alt={imgModal.nombre} />
        </div>
      )}
    </div>
  );
}
