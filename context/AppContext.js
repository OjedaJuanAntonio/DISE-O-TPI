'use client';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { demoData } from '../data/mockData';
import { STORAGE_KEY, SESSION_KEY, loadDB, saveDB, loadSession, saveSession, clearSession } from '../utils/storage';
import { panelInicial } from '../utils/permissions';
import { uid, today, productoEstado } from '../utils/helpers';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [db, _setDb] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const stored = loadDB();
    const initialDb = stored || demoData();
    if (!stored) saveDB(initialDb);
    _setDb(initialDb);

    const session = loadSession();
    if (session) {
      setUsuarioActual(session);
      setSeccionActiva(panelInicial(session.actor));
    }
  }, []);

  function guardarDatos(newDb) {
    const checked = verificarMoraDB(newDb);
    _setDb({ ...checked });
    saveDB(checked);
  }

  function updateDb(updater) {
    _setDb(prev => {
      const next = updater(prev);
      const checked = verificarMoraDB(next);
      saveDB(checked);
      return { ...checked };
    });
  }

  function mostrarMensaje(tipo, texto) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ tipo, texto });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  function iniciarSesion(email, password) {
    if (!db) return false;
    const user = db.usuarios.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return false;
    setUsuarioActual(user);
    saveSession(user);
    setSeccionActiva(panelInicial(user.actor));
    mostrarMensaje('success', `Bienvenido/a ${user.nombre}`);
    return true;
  }

  function cerrarSesion() {
    clearSession();
    setUsuarioActual(null);
    setSeccionActiva(null);
    setCarrito([]);
  }

  function navegarA(id) {
    setSeccionActiva(id);
  }

  function alumnoVisible(a) {
    if (!usuarioActual) return false;
    if (usuarioActual.actor === 'Alumno') return a.id === usuarioActual.alumnoId;
    if (usuarioActual.actor === 'Encargado') return a.sede === usuarioActual.sede;
    if (usuarioActual.actor === 'Profesor') return a.sede === usuarioActual.sede;
    return true;
  }

  function alumnosPermitidos() {
    if (!db) return [];
    return db.alumnos.filter(alumnoVisible);
  }

  function productosPermitidos() {
    if (!db) return [];
    if (usuarioActual?.actor === 'Encargado' || usuarioActual?.actor === 'Secretaria')
      return db.productos.filter(p => p.sede === usuarioActual.sede);
    return db.productos;
  }

  function alumnoNombre(id) {
    const a = db?.alumnos.find(x => x.id === id);
    return a ? `${a.nombre} ${a.apellido}` : 'Sin alumno';
  }

  function addAccionToDb(database, tipo, modulo, descripcion, severidad = 'Informativa', estado = 'Ejecutado') {
    const accion = {
      id: uid('s'),
      fecha: new Date().toLocaleString('es-AR'),
      tipo, modulo, descripcion, estado, severidad
    };
    return { ...database, accionesSistema: [accion, ...(database.accionesSistema || [])] };
  }

  return (
    <AppContext.Provider value={{
      db, guardarDatos, updateDb,
      usuarioActual,
      carrito, setCarrito,
      seccionActiva, navegarA,
      toast, mostrarMensaje,
      iniciarSesion, cerrarSesion,
      alumnoVisible, alumnosPermitidos, productosPermitidos,
      alumnoNombre,
      addAccionToDb
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

function verificarMoraDB(database) {
  if (!database?.alumnos) return database;
  const newAlumnos = database.alumnos.map(a => {
    if (a.estado === 'Baja') return a;
    if (a.deuda > 0 && a.diasMora > 20 && a.estado !== 'Bloqueado') {
      return { ...a, estado: 'Bloqueado' };
    }
    if (a.deuda > 0 && a.diasMora > 15 && a.estado !== 'Deudor' && a.estado !== 'Bloqueado') {
      return { ...a, estado: 'Deudor' };
    }
    return a;
  });
  return { ...database, alumnos: newAlumnos };
}
