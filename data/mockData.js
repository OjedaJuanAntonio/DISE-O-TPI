export const today = () => new Date().toISOString().slice(0, 10);

export function demoData() {
  const sedes = ['Sede 1', 'Sede 2'];
  const planes = [
    { nombre: 'Mensualidad general', precio: 18000 }
  ];
  const alumnos = [
    { id: 'a1', nombre: 'Sofía', apellido: 'Molina', dni: '42111222', telefono: '3794001111', email: 'alumno.gym@gmail.com', direccion: 'San Martín 123', emergencia: 'Carlos Molina 3794441111', sede: 'Sede 1', estado: 'Activo', fechaInscripcion: '2026-04-01', fechaLimitePago: '2026-05-10', deuda: 0, diasMora: 0, observaciones: 'Alumno asociado al usuario de prueba' },
    { id: 'a2', nombre: 'Bruno', apellido: 'Fernández', dni: '39555777', telefono: '3794552222', email: 'bruno@gmail.com', direccion: 'Belgrano 450', emergencia: 'Ana Fernández 3794222222', sede: 'Sede 2', estado: 'Deudor', fechaInscripcion: '2026-03-15', fechaLimitePago: '2026-04-12', deuda: 18000, diasMora: 16, observaciones: 'Mora reciente' },
    { id: 'a3', nombre: 'Camila', apellido: 'Ruiz', dni: '40777888', telefono: '3794333333', email: 'camila@gmail.com', direccion: 'Junín 980', emergencia: 'Luis Ruiz 3794331111', sede: 'Sede 1', estado: 'Bloqueado', fechaInscripcion: '2026-02-10', fechaLimitePago: '2026-04-05', deuda: 20000, diasMora: 24, observaciones: 'Bloqueada por mora' },
    { id: 'a4', nombre: 'Mateo', apellido: 'Silva', dni: '38999111', telefono: '3794666666', email: 'mateo@gmail.com', direccion: 'Córdoba 333', emergencia: 'Rosa Silva 3794661111', sede: 'Sede 1', estado: 'Activo', fechaInscripcion: '2026-04-20', fechaLimitePago: '2026-05-20', deuda: 0, diasMora: 0, observaciones: '' },
    { id: 'a5', nombre: 'Lucía', apellido: 'Gómez', dni: '41888111', telefono: '3794777777', email: 'lucia@gmail.com', direccion: 'Mendoza 555', emergencia: 'Pedro Gómez 3794771111', sede: 'Sede 2', estado: 'Baja', fechaInscripcion: '2026-01-05', fechaLimitePago: '2026-03-10', deuda: 0, diasMora: 0, observaciones: 'Baja solicitada' }
  ];
  return {
    usuarios: [
      { id: 'u1', nombre: 'Ana Torres', email: 'admin.gym@gmail.com', password: 'admin123', actor: 'Administrador', sede: 'Todas' },
      { id: 'u2', nombre: 'Laura Pérez', email: 'secretaria.gym@gmail.com', password: 'secretaria123', actor: 'Secretaria', sede: 'Sede 1' },
      { id: 'u3', nombre: 'Martín Gómez', email: 'encargado.gym@gmail.com', password: 'encargado123', actor: 'Encargado', sede: 'Sede 2' },
      { id: 'u4', nombre: 'Diego Ramírez', email: 'profesor.gym@gmail.com', password: 'profesor123', actor: 'Profesor', sede: 'Sede 1' },
      { id: 'u5', nombre: 'Sofía Molina', email: 'alumno.gym@gmail.com', password: 'alumno123', actor: 'Alumno', sede: 'Sede 1', alumnoId: 'a1' }
    ],
    sedes, planes,
    clases: [
      { id: 'c1', nombre: 'Musculación libre', dia: 'Lunes a viernes', horario: '08:00 - 22:00', profesor: 'Sala general', sede: 'Sede 1', cupos: 30, precio: 5000 },
      { id: 'c2', nombre: 'Funcional', dia: 'Lunes / Miércoles / Viernes', horario: '19:00', profesor: 'Diego Ramírez', sede: 'Sede 1', cupos: 20, precio: 7000 },
      { id: 'c3', nombre: 'Spinning', dia: 'Martes / Jueves', horario: '18:00', profesor: 'Paula Álvarez', sede: 'Sede 2', cupos: 15, precio: 6500 },
      { id: 'c4', nombre: 'Yoga', dia: 'Sábado', horario: '10:00', profesor: 'Marina López', sede: 'Sede 1', cupos: 18, precio: 6000 },
      { id: 'c5', nombre: 'Boxeo', dia: 'Martes / Jueves', horario: '20:00', profesor: 'Diego Ramírez', sede: 'Sede 1', cupos: 16, precio: 8000 },
      { id: 'c6', nombre: 'Cross training', dia: 'Lunes / Miércoles', horario: '07:00', profesor: 'Gustavo Núñez', sede: 'Sede 2', cupos: 14, precio: 7500 }
    ],
    alumnos,
    pagos: [
      { id: 'p1', alumnoId: 'a1', fecha: '2026-05-01', monto: 18000, medio: 'Transferencia', descuento: 0, total: 18000, recibo: 'R-0001', tipo: 'Mensualidad' },
      { id: 'p2', alumnoId: 'a4', fecha: '2026-05-02', monto: 18000, medio: 'QR', descuento: 1440, total: 16560, recibo: 'R-0002', tipo: 'Mensualidad' }
    ],
    inscripcionesClase: [],
    asistencias: [
      { id: 'as1', alumnoId: 'a1', claseId: 'c2', fecha: '2026-05-01', presente: true },
      { id: 'as2', alumnoId: 'a1', claseId: 'c5', fecha: '2026-05-02', presente: false },
      { id: 'as3', alumnoId: 'a4', claseId: 'c1', fecha: '2026-05-02', presente: true }
    ],
    promociones: [
      { id: 'pr1', nombre: 'Sin descuento', tipo: 'Base', valor: 0, estado: 'Activa', descripcion: 'Pago sin promoción' },
      { id: 'pr2', nombre: 'Descuento familiar', tipo: 'Porcentaje', valor: 10, estado: 'Activa', descripcion: '10% para familiares directos' },
      { id: 'pr3', nombre: 'Pago anticipado', tipo: 'Porcentaje', valor: 8, estado: 'Activa', descripcion: '8% abonando antes del vencimiento' },
      { id: 'pr4', nombre: 'Cupón BIENVENIDA', tipo: 'Porcentaje', valor: 15, estado: 'Inactiva', descripcion: 'Cupón para nuevas inscripciones' }
    ],
    productos: [
      { id: 'k1', codigo: 'AG001', nombre: 'Agua mineral', categoria: 'Bebidas', precio: 1200, stock: 4, minimo: 5, sede: 'Sede 1', imagen: '' },
      { id: 'k2', codigo: 'BP002', nombre: 'Barra proteica', categoria: 'Suplementos', precio: 2500, stock: 12, minimo: 6, sede: 'Sede 1', imagen: '' },
      { id: 'k3', codigo: 'BI003', nombre: 'Bebida isotónica', categoria: 'Bebidas', precio: 1800, stock: 0, minimo: 5, sede: 'Sede 2', imagen: '' },
      { id: 'k4', codigo: 'FS004', nombre: 'Frutos secos', categoria: 'Snacks', precio: 3000, stock: 9, minimo: 4, sede: 'Sede 2', imagen: '' },
      { id: 'k5', codigo: 'YP005', nombre: 'Yogur proteico', categoria: 'Snacks', precio: 2200, stock: 3, minimo: 5, sede: 'Sede 1', imagen: '' },
      { id: 'k6', codigo: 'TD006', nombre: 'Toalla descartable', categoria: 'Higiene', precio: 900, stock: 18, minimo: 8, sede: 'Sede 1', imagen: '' }
    ],
    ventas: [
      { id: 'v1', fecha: today(), hora: '10:12', sede: 'Sede 1', items: [{ productoId: 'k2', nombre: 'Barra proteica', cantidad: 2, precio: 2500 }], total: 5000, medio: 'Efectivo', usuario: 'Laura Pérez' }
    ],
    pedidosReposicion: [
      { id: 'r1', productoId: 'k3', producto: 'Bebida isotónica', sede: 'Sede 2', cantidad: 20, fecha: today(), motivo: 'Producto agotado', estado: 'Pendiente' }
    ],
    declaraciones: [
      { id: 'd1', alumnoId: 'a1', estado: 'Completa', enfermedades: 'No', medicacion: 'No', lesiones: 'No', autorizacion: 'Sí', observaciones: 'Sin observaciones', certificado: 'certificado_sofia.pdf' }
    ],
    notificaciones: [
      { id: 'n1', fecha: today(), destinatario: 'Bruno Fernández', motivo: 'Vencimiento', estado: 'Enviada', emisor: 'Sistema', mensaje: 'Tu cuota se encuentra vencida.' }
    ],
    diferenciasInventario: [],
    ingresos: [],
    accionesSistema: [
      { id: 's1', fecha: new Date().toLocaleString('es-AR'), tipo: 'Restricción por mora', modulo: 'Gestión de Alumnos', descripcion: 'El sistema bloqueó a Camila Ruiz por mora superior a 20 días.', estado: 'Ejecutado', severidad: 'Crítica' },
      { id: 's2', fecha: new Date().toLocaleString('es-AR'), tipo: 'Stock bajo', modulo: 'Administración de Kiosco', descripcion: 'El sistema detectó stock bajo en Agua mineral.', estado: 'Ejecutado', severidad: 'Advertencia' }
    ]
  };
}
