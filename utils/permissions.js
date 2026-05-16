export const permisos = {
  Administrador: [
    'panel-administrador', 'alumnos-panel', 'alumnos-listado', 'alumno-detalle', 'alumno-formulario',
    'estado-cuenta', 'promociones', 'inscripciones-sede',
    'ventas-diarias', 'acciones-automaticas-sistema', 'mi-perfil'
  ],
  Secretaria: [
    'panel-secretaria', 'alumnos-panel', 'alumnos-listado', 'alumno-detalle', 'alumno-formulario', 'declaracion-jurada',
    'estado-cuenta', 'registrar-pago', 'promociones', 'historial-asistencia',
    'cronograma-plan', 'inscripcion-clases', 'verificar-ingreso', 'notificaciones', 'kiosco-panel', 'kiosco-inventario', 'registrar-venta',
    'stock-actual', 'alertas-stock', 'mi-perfil'
  ],
  Encargado: [
    'panel-encargado', 'inscripciones-sede', 'kiosco-panel', 'kiosco-inventario',
    'stock-actual', 'pedidos-reposicion', 'alertas-stock', 'ventas-diarias',
    'acciones-automaticas-sistema', 'mi-perfil'
  ],
  Profesor: [
    'panel-profesor', 'asistencia-alumnos', 'historial-asistencia', 'cronograma-plan', 'mi-perfil'
  ],
  Alumno: [
    'panel-alumno', 'declaracion-jurada', 'estado-cuenta', 'historial-asistencia', 'cronograma-plan', 'mi-perfil'
  ]
};

export const menuConfig = [
  { grupo: 'Inicio', items: [
    { id: 'panel-administrador', icon: '🏠', texto: 'Panel principal', roles: ['Administrador'] },
    { id: 'panel-secretaria',   icon: '🏠', texto: 'Panel principal', roles: ['Secretaria'] },
    { id: 'panel-encargado',    icon: '🏠', texto: 'Panel principal', roles: ['Encargado'] },
    { id: 'panel-profesor',     icon: '🏠', texto: 'Panel principal', roles: ['Profesor'] },
    { id: 'panel-alumno',       icon: '🏠', texto: 'Panel principal', roles: ['Alumno'] }
  ]},
  { grupo: 'Gestión de Alumnos', items: [
    { id: 'alumnos-panel',        icon: '👥', texto: 'Panel de alumnos',         roles: ['Administrador', 'Secretaria'] },
    { id: 'alumnos-listado',      icon: '📋', texto: 'Listado de alumnos',        roles: ['Administrador', 'Secretaria'] },
    { id: 'alumno-formulario',    icon: '✏️', texto: 'Registrar inscripción',     roles: ['Administrador', 'Secretaria'] },
    { id: 'declaracion-jurada',   icon: '📄', texto: 'Declaración jurada',        roles: ['Secretaria', 'Alumno'] },
    { id: 'estado-cuenta',        icon: '💳', texto: 'Estado de cuenta',          roles: ['Administrador', 'Secretaria', 'Alumno'] },
    { id: 'registrar-pago',       icon: '💰', texto: 'Registrar pago',            roles: ['Secretaria'] },
    { id: 'pago-digital',         icon: '📱', texto: 'Pago digital simulado',     roles: [] },
    { id: 'promociones',          icon: '🏷️', texto: 'Promociones y descuentos', roles: ['Administrador', 'Secretaria'] },
    { id: 'asistencia-alumnos',   icon: '✅', texto: 'Asistencia',                roles: ['Profesor'] },
    { id: 'historial-asistencia', icon: '📅', texto: 'Historial de asistencia',  roles: ['Secretaria', 'Profesor', 'Alumno'] },
    { id: 'cronograma-plan',      icon: '📆', texto: 'Cronograma de clases',      roles: ['Secretaria', 'Profesor', 'Alumno'] },
    { id: 'inscripcion-clases',   icon: '🎓', texto: 'Inscripción en clases',     roles: ['Secretaria'] },
    { id: 'verificar-ingreso',    icon: '🚪', texto: 'Verificar ingreso',         roles: ['Secretaria'] },
    { id: 'notificaciones',       icon: '🔔', texto: 'Notificaciones',            roles: ['Secretaria'] },
    { id: 'inscripciones-sede',   icon: '🏢', texto: 'Inscripciones por sede',    roles: ['Administrador', 'Encargado'] },
    { id: 'alumnos-deudores',     icon: '⚠️', texto: 'Alumnos con deuda',        roles: [] }
  ]},
  { grupo: 'Administración de Kiosco', items: [
    { id: 'kiosco-panel',             icon: '🛒', texto: 'Panel de kiosco',          roles: ['Secretaria', 'Encargado'] },
    { id: 'kiosco-inventario',        icon: '📦', texto: 'Productos e inventario',   roles: ['Secretaria', 'Encargado'] },
    { id: 'registrar-venta',          icon: '💵', texto: 'Registrar venta',          roles: ['Secretaria'] },
    { id: 'stock-actual',             icon: '📊', texto: 'Stock actual',             roles: ['Secretaria', 'Encargado'] },
    { id: 'pedidos-reposicion',       icon: '🚚', texto: 'Pedidos de reposición',    roles: ['Encargado'] },
    { id: 'alertas-stock',            icon: '🚨', texto: 'Alertas de stock',         roles: ['Secretaria', 'Encargado'] },
    { id: 'ventas-diarias',           icon: '📈', texto: 'Ventas diarias por sede',  roles: ['Administrador', 'Encargado'] },
    { id: 'diferencias-inventario',   icon: '⚖️', texto: 'Diferencias de inventario', roles: [] }
  ]},
  { grupo: 'Sistema', items: [
    { id: 'acciones-automaticas-sistema', icon: '⚙️', texto: 'Acciones automáticas', roles: ['Administrador', 'Encargado'] }
  ]},
  { grupo: 'Usuario', items: [
    { id: 'mi-perfil', icon: '👤', texto: 'Mi perfil', roles: ['Administrador', 'Secretaria', 'Encargado', 'Profesor', 'Alumno'] }
  ]}
];

export function puedeAcceder(actor, pantalla) {
  return permisos[actor]?.includes(pantalla) ?? false;
}

export function panelInicial(actor) {
  const map = {
    Administrador: 'panel-administrador',
    Secretaria: 'panel-secretaria',
    Encargado: 'panel-encargado',
    Profesor: 'panel-profesor',
    Alumno: 'panel-alumno'
  };
  return map[actor] || 'panel-alumno';
}

export function tituloPorId(id) {
  const item = menuConfig.flatMap(g => g.items).find(i => i.id === id);
  return item?.texto || 'Pantalla';
}
