const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");
const { obtenerColegios, actualizarColegio, crearColegio, obtenerDependenciasColegio, eliminarColegio,
    obtenerUsuarios, crearUsuario, actualizarUsuario, obtenerDependenciasUsuarios, eliminarUsuario,
    obtenerCorreosWorkspace,obtenerColegiosDisponiblesWorkspace, obtenerUsuariosDisponiblesWorkspace,
    enviarNuevoCorreoWorkspace, actualizarCorreoWorkspace, eliminarCorreoWorkspace,obtenerHistorial,obtenerEstadoBaseDatos,
    obtenerResumenDashboard,obtenerActividadReciente, buscarGlobal
} = require("./database/queries.js");

/* ===== OBTENER COLEGIOS ===== */

ipcMain.handle("obtener-colegios", async () => {
    const colegios = await obtenerColegios();

    return colegios
})

app.whenReady().then(() => {

    const ventana = new BrowserWindow({
        width: 1000,
        height: 700,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    ventana.loadFile("renderer/index.html");
});

/* ===== ACTUALIZAR COLEGIOS ===== */

ipcMain.handle("actualizar-colegio", async (_event, colegio) => {
    const resultado = await actualizarColegio(colegio);

    return resultado;
})

/* ===== CREAR COLEGIOS ===== */

ipcMain.handle("crear-colegio", async (_event, colegio) => {
    const resultado = await crearColegio(colegio);

    return resultado;
});

/* ===== OBTENER DEPENDENCIAS COLEGIO ===== */

ipcMain.handle("obtener-dependencias-colegio", async (_event, cue) => {
    const dependencias = await obtenerDependenciasColegio(cue);

    return dependencias;
})

/* ===== ELIMINAR COLEGIO ===== */

ipcMain.handle("eliminar-colegio", async (_event, cue) => {
    const resultado = await eliminarColegio(cue);

    return resultado;
})


/* ===== OBTENER USUARIOS ===== */
ipcMain.handle("obtener-usuarios", async () => {
    const usuarios = await obtenerUsuarios();

    return usuarios;
})

/* ===== CREAR USUARIOS ===== */


ipcMain.handle("crear-usuario", async (_event, usuario) => {
    const resultado = await crearUsuario(usuario);
    return resultado;
});

/*===== ACTUALIZAR USUARIO ======*/

ipcMain.handle("actualizar-usuario", async (_event, usuario) => {
    const resultado = await actualizarUsuario(usuario);
    return resultado;
});

/*===== OBTENER DEPENDENCIAS DEL USUARIO ======*/

ipcMain.handle("obtener-dependencias-usuario", async (_event, dni) => {
    const resultado = await obtenerDependenciasUsuarios(dni);
    return resultado;
});

/*===== ELIMINAR USUARIO ======*/

ipcMain.handle("eliminar-usuario", async (_event, dni) => {
    const resultado = await eliminarUsuario(dni);
    return resultado
})


/*===== OBTENER CORREOS WORKSPACE ======*/

ipcMain.handle("obtener-correos-workspace",async()=>{
    const correos = await obtenerCorreosWorkspace();
    return correos;
});


/*======== OBTENER USUARIOS DISPONIBLES EN WORKSPACE ========*/
ipcMain.handle("obtener-usuarios-disponibles-workspace",async()=>{
    const usuarios = await obtenerUsuariosDisponiblesWorkspace();
    return usuarios;
});

/*======== OBTENER COLEGiOS DISPONIBLES EN WORKSPACE ========*/

ipcMain.handle("obtener-colegios-disponibles-workspace",async ()=>{
    const colegios = await obtenerColegiosDisponiblesWorkspace();
    return colegios;
});

/*======== Nuevos CorreosWorkspace a enviar ========*/

ipcMain.handle("crear-correo-workspace", async(_event, workspace) =>{
const resultado = await enviarNuevoCorreoWorkspace(workspace);
return resultado;
});

/*======== Actualizar CorreosWOrkspace ========*/

ipcMain.handle("actualizar-correo-workspace",async(_event,workspace)=>{
    const resultado = await actualizarCorreoWorkspace(workspace);
    return resultado;
});

/*======== Actualizar CorreosWOrkspace ========*/
ipcMain.handle("eliminar-correo-workspace", async (_event, correoId) => {
    const resultado = await eliminarCorreoWorkspace(correoId);
    return resultado;
});

/*======== OBTENER HISTORIAL ========*/

ipcMain.handle("obtener-historial", async () => {
    const historial = await obtenerHistorial();

    return historial;
});

/*======== OBTENER ESTADO DE LA BASE DE DATOS ========*/

ipcMain.handle("obtener-estado-base-datos", async () => {
    const estadoBaseDatos = await obtenerEstadoBaseDatos();

    return estadoBaseDatos;
});

/*======== DASHBOARD ========*/
ipcMain.handle("obtener-resumen-dashboard", async () => {
    const resumenDashboard = await obtenerResumenDashboard();

    return resumenDashboard;
});

ipcMain.handle("obtener-actividad-reciente", async () => {
    const actividadReciente = await obtenerActividadReciente();

    return actividadReciente;
});

/*======== BUSQUEDA GLOBAL ========*/

ipcMain.handle("buscar-global", async (_event, texto) => {
    const resultados = await buscarGlobal(texto);

    return resultados;
});