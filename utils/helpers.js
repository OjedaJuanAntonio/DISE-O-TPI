export const today = () => new Date().toISOString().slice(0, 10);
export const money = (n) => `$${Number(n || 0).toLocaleString('es-AR')}`;
export const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`;

export function badgeClass(text) {
  const t = String(text);
  if (['Activo', 'Al día', 'Habilitado', 'Disponible', 'Completa', 'Ejecutado', 'Recibido', 'Enviada', 'Presente'].includes(t)) return 'success';
  if (['Deudor', 'Próxima a vencer', 'Stock bajo', 'Pendiente', 'Advertencia', 'Ausente'].includes(t)) return 'warning';
  if (['Bloqueado', 'Vencida', 'Agotado', 'No habilitado', 'Crítica', 'Baja'].includes(t)) return 'danger';
  if (['Aprobado', 'Informativa'].includes(t)) return 'info';
  return 'gray';
}

export function productoEstado(p) {
  if (p.stock <= 0) return 'Agotado';
  if (p.stock <= p.minimo) return 'Stock bajo';
  return 'Disponible';
}

const kindIcon = { success: '✅', warning: '⚠️', danger: '🚨', info: 'ℹ️' };
export function kindIconFor(kind) {
  return kindIcon[kind] || '';
}
