'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { puedeAcceder } from '../utils/permissions';

import Login from '../components/Login';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Toast from '../components/Toast';
import AccesoDenegado from '../components/AccesoDenegado';

import PanelAdministrador from '../components/PanelAdministrador';
import PanelSecretaria from '../components/PanelSecretaria';
import PanelEncargado from '../components/PanelEncargado';
import PanelProfesor from '../components/PanelProfesor';
import PanelAlumno from '../components/PanelAlumno';
import GestionAlumnos from '../components/GestionAlumnos';
import ListadoAlumnos from '../components/ListadoAlumnos';
import FormularioAlumno from '../components/FormularioAlumno';
import DetalleAlumno from '../components/DetalleAlumno';
import DeclaracionJurada from '../components/DeclaracionJurada';
import EstadoCuenta from '../components/EstadoCuenta';
import RegistrarPago from '../components/RegistrarPago';
import PagoDigital from '../components/PagoDigital';
import Promociones from '../components/Promociones';
import AsistenciaAlumnos from '../components/AsistenciaAlumnos';
import HistorialAsistencia from '../components/HistorialAsistencia';
import CronogramaPlan from '../components/CronogramaPlan';
import VerificarIngreso from '../components/VerificarIngreso';
import Notificaciones from '../components/Notificaciones';
import InscripcionesSede from '../components/InscripcionesSede';
import AlumnosDeudores from '../components/AlumnosDeudores';
import PanelKiosco from '../components/PanelKiosco';
import InventarioKiosco from '../components/InventarioKiosco';
import RegistrarVenta from '../components/RegistrarVenta';
import StockActual from '../components/StockActual';
import PedidosReposicion from '../components/PedidosReposicion';
import AlertasStock from '../components/AlertasStock';
import VentasDiarias from '../components/VentasDiarias';
import DiferenciasInventario from '../components/DiferenciasInventario';
import AccionesAutomaticas from '../components/AccionesAutomaticas';
import InscripcionClases from '../components/InscripcionClases';
import MiPerfil from '../components/MiPerfil';

export default function Home() {
  const { usuarioActual, seccionActiva, navegarA } = useApp();
  const [alumnoDetalleId, setAlumnoDetalleId] = useState(null);
  const [alumnoEditarId, setAlumnoEditarId] = useState(null);

  if (!usuarioActual) {
    return (
      <>
        <Login />
        <Toast />
      </>
    );
  }

  function verDetalle(id) {
    setAlumnoDetalleId(id);
    setAlumnoEditarId(null);
    navegarA('alumno-detalle');
  }

  function editarAlumno(id) {
    setAlumnoEditarId(id);
    navegarA('alumno-formulario');
  }

  const seccion = seccionActiva || 'panel-alumno';
  const tieneAcceso = puedeAcceder(usuarioActual.actor, seccion);

  function renderPantalla() {
    if (!tieneAcceso) return <AccesoDenegado />;
    switch (seccion) {
      case 'panel-administrador': return <PanelAdministrador />;
      case 'panel-secretaria':   return <PanelSecretaria />;
      case 'panel-encargado':    return <PanelEncargado />;
      case 'panel-profesor':     return <PanelProfesor />;
      case 'panel-alumno':       return <PanelAlumno />;
      case 'alumnos-panel':      return <GestionAlumnos />;
      case 'alumnos-listado':    return <ListadoAlumnos onVerDetalle={verDetalle} onEditar={editarAlumno} />;
      case 'alumno-formulario':  return <FormularioAlumno alumnoId={alumnoEditarId} onGuardado={() => setAlumnoEditarId(null)} />;
      case 'alumno-detalle':     return <DetalleAlumno alumnoId={alumnoDetalleId} onEditar={editarAlumno} />;
      case 'declaracion-jurada': return <DeclaracionJurada />;
      case 'estado-cuenta':      return <EstadoCuenta />;
      case 'registrar-pago':     return <RegistrarPago />;
      case 'pago-digital':       return <PagoDigital />;
      case 'promociones':        return <Promociones />;
      case 'asistencia-alumnos': return <AsistenciaAlumnos />;
      case 'historial-asistencia': return <HistorialAsistencia />;
      case 'cronograma-plan':    return <CronogramaPlan />;
      case 'verificar-ingreso':  return <VerificarIngreso />;
      case 'notificaciones':     return <Notificaciones />;
      case 'inscripciones-sede': return <InscripcionesSede />;
      case 'alumnos-deudores':   return <AlumnosDeudores />;
      case 'kiosco-panel':       return <PanelKiosco />;
      case 'kiosco-inventario':  return <InventarioKiosco />;
      case 'registrar-venta':    return <RegistrarVenta />;
      case 'stock-actual':       return <StockActual />;
      case 'pedidos-reposicion': return <PedidosReposicion />;
      case 'alertas-stock':      return <AlertasStock />;
      case 'ventas-diarias':     return <VentasDiarias />;
      case 'diferencias-inventario': return <DiferenciasInventario />;
      case 'inscripcion-clases':  return <InscripcionClases />;
      case 'acciones-automaticas-sistema': return <AccionesAutomaticas />;
      case 'mi-perfil':          return <MiPerfil />;
      default:                   return <AccesoDenegado />;
    }
  }

  return (
    <>
      <div className="app-layout">
        <Sidebar />
        <div className="main-wrapper">
          <Topbar />
          <main className="main-content">
            <div key={seccion} className="screen-enter">
              {renderPantalla()}
            </div>
          </main>
        </div>
      </div>
      <Toast />
    </>
  );
}
