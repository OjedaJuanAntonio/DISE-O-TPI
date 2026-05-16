'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Badge from './Badge';
import { uid, today } from '../utils/helpers';

export default function PedidosReposicion() {
  const { db, usuarioActual, guardarDatos, addAccionToDb, mostrarMensaje } = useApp();
  const [productoId, setProductoId] = useState('');
  const [sede, setSede] = useState(usuarioActual?.actor === 'Encargado' ? (usuarioActual.sede || '') : '');
  const [cantidad, setCantidad] = useState(10);
  const [fechaPedido, setFechaPedido] = useState(today());
  const [motivo, setMotivo] = useState('Producto agotado');

  if (!db) return null;

  // Catálogo completo de la cadena: un único registro por nombre de producto (sin filtrar por sede)
  const catalogoCompleto = db.productos
    .reduce((acc, p) => {
      if (!acc.find(x => x.nombre === p.nombre)) acc.push(p);
      return acc;
    }, [])
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  const pedidos = usuarioActual?.actor === 'Encargado'
    ? db.pedidosReposicion.filter(r => r.sede === usuarioActual.sede)
    : db.pedidosReposicion;

  function handleSubmit(e) {
    e.preventDefault();
    const prod = db.productos.find(p => p.id === productoId);
    if (!prod) return;
    const pedido = { id: uid('r'), productoId: prod.id, producto: prod.nombre, sede, cantidad: Number(cantidad), fecha: fechaPedido, motivo, estado: 'Pendiente' };
    guardarDatos({ ...db, pedidosReposicion: [...db.pedidosReposicion, pedido] });
    setProductoId(''); setCantidad(10);
    mostrarMensaje('success', 'Pedido de reposición generado.');
  }

  function marcarRecibido(id) {
    const r = db.pedidosReposicion.find(x => x.id === id);
    const sourceProd = db.productos.find(x => x.id === r.productoId);
    if (!r || !sourceProd) return;

    // Buscar el producto por nombre en la sede del pedido (puede diferir de la sede del producto fuente)
    const targetProd = db.productos.find(x => x.nombre === r.producto && x.sede === r.sede);

    let newProductos;
    if (targetProd) {
      newProductos = db.productos.map(x => x.id === targetProd.id ? { ...x, stock: x.stock + Number(r.cantidad) } : x);
    } else {
      // El producto aún no existe en esta sede: se crea automáticamente con el stock recibido
      const newProd = { ...sourceProd, id: uid('k'), sede: r.sede, stock: Number(r.cantidad) };
      newProductos = [...db.productos, newProd];
    }

    const newPedidos = db.pedidosReposicion.map(x => x.id === id ? { ...x, estado: 'Recibido' } : x);
    let newDb = { ...db, productos: newProductos, pedidosReposicion: newPedidos };
    newDb = addAccionToDb(newDb, 'Reposición recibida', 'Administración de Kiosco', `Se recibió reposición de ${r.producto}.`, 'Informativa');
    guardarDatos(newDb);
    mostrarMensaje('success', 'Pedido marcado como recibido y stock aumentado.');
  }

  return (
    <div>
      <div className="section-header">
        <div><h2>Pedidos de reposición</h2><p>Generá y recibí pedidos de stock</p></div>
      </div>

      <div className="two-columns">
        <div className="card">
          <h3>Nuevo pedido</h3>
          <form className="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label>
              Producto
              <select value={productoId} onChange={e => setProductoId(e.target.value)} required>
                <option value="">Seleccioná un producto</option>
                {catalogoCompleto.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.categoria})</option>)}
              </select>
            </label>
            {usuarioActual?.actor !== 'Encargado' && (
              <label>
                Sede
                <select value={sede} onChange={e => setSede(e.target.value)}>
                  {db.sedes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            )}
            <label>Cantidad <input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} required /></label>
            <label>Fecha <input type="date" value={fechaPedido} onChange={e => setFechaPedido(e.target.value)} /></label>
            <label>
              Motivo
              <select value={motivo} onChange={e => setMotivo(e.target.value)}>
                {['Producto agotado', 'Stock bajo', 'Reposición periódica', 'Otro'].map(m => <option key={m}>{m}</option>)}
              </select>
            </label>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Generar pedido</button>
            </div>
          </form>
        </div>

        <div className="card table-card">
          <h3>Pedidos registrados</h3>
          <table>
            <thead>
              <tr><th>Producto</th><th>Sede</th><th>Cantidad</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr>
            </thead>
            <tbody>
              {pedidos.map(r => (
                <tr key={r.id}>
                  <td>{r.producto}</td>
                  <td>{r.sede}</td>
                  <td>{r.cantidad}</td>
                  <td>{r.fecha}</td>
                  <td><Badge texto={r.estado} /></td>
                  <td>
                    {r.estado !== 'Recibido' && (
                      <button className="btn btn-success small" onClick={() => marcarRecibido(r.id)}>Marcar recibido</button>
                    )}
                  </td>
                </tr>
              ))}
              {!pedidos.length && <tr><td colSpan={6}>Sin pedidos.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
