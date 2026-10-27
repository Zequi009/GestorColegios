const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("dijini", {
    // saludar: (nombre) => ipcRenderer.invoke("saludar", nombre),
    obtenerColegios: () => ipcRenderer.invoke("obtener-colegios"),
    actualizarColegio: (colegio) => { return ipcRenderer.invoke("actualizar-colegio", colegio); },
    crearColegio: colegio => { return ipcRenderer.invoke("crear-colegio", colegio); },
    obtenerDependenciasColegio: cue => { return ipcRenderer.invoke("obtener-dependencias-colegio", cue) },
    eliminarColegio: cue => { return ipcRenderer.invoke(("eliminar-colegio"), cue) },

    /*======== SECCION USUARIOS ========*/
    obtenerUsuarios: () => ipcRenderer.invoke("obtener-usuarios"),
    crearUsuario: usuario => ipcRenderer.invoke("crear-usuario", usuario),
    actualizarUsuario: usuario => ipcRenderer.invoke("actualizar-usuario", usuario),
    obtenerDependenciasUsuarios: dni => ipcRenderer.invoke("obtener-dependencias-usuario", dni),
    eliminarUsuario: dni => ipcRenderer.invoke("eliminar-usuario", dni),

    /*======== SECCION WoRKSPACE ========*/
    obtenerCorreosWorkspace: () => ipcRenderer.invoke("obtener-correos-workspace"),
    obtenerUsuariosDisponiblesWorkspace: () => ipcRenderer.invoke("obtener-usuarios-disponibles-workspace"),
    obtenerColegiosDisponiblesWorkspace: () => ipcRenderer.invoke("obtener-colegios-disponibles-workspace"),
    crearCorreoWorkspace: workspace => ipcRenderer.invoke("crear-correo-workspace", workspace),
    actualizarCorreoWorkspace: workspace => ipcRenderer.invoke("actualizar-correo-workspace", workspace),
    eliminarCorreoWorkspace: correoId => ipcRenderer.invoke("eliminar-correo-workspace", correoId),

    /*======== SECCION HISTORIAL BD ========*/
    obtenerHistorial: () => ipcRenderer.invoke("obtener-historial"),

    /*======== SECCION ESTADO BD ========*/
    obtenerEstadoBaseDatos: () => ipcRenderer.invoke("obtener-estado-base-datos"),

    /*======== SECCION DASHBOARD ========*/
    obtenerResumenDashboard: () => ipcRenderer.invoke("obtener-resumen-dashboard"),
    obtenerActividadReciente: () => ipcRenderer.invoke("obtener-actividad-reciente"),

    /*======== SECCION BUSQUEDA GLOBAL ========*/
    buscarGlobal: texto => ipcRenderer.invoke("buscar-global", texto)
});


