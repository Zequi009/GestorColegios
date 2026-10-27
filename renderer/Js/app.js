function actualizarEstadoBaseDatosSidebar(estado, informacionBaseDatos = null) {
    const estadoBaseDatos = document.querySelector("#estadoBaseDatosSidebar");
    const textoEstadoBaseDatos = document.querySelector("#textoEstadoBaseDatosSidebar");

    estadoBaseDatos.classList.remove(
        "comprobando",
        "conectado",
        "sin-conexion"
    );

    estadoBaseDatos.classList.add(estado);

    if (estado === "comprobando") {
        textoEstadoBaseDatos.textContent = "Comprobando...";
    }

    if (estado === "conectado") {
        textoEstadoBaseDatos.textContent =
            informacionBaseDatos.BaseDatos;
    }

    if (estado === "sin-conexion") {
        textoEstadoBaseDatos.textContent = "Sin conexión";
    }
}


async function comprobarEstadoBaseDatos() {
    actualizarEstadoBaseDatosSidebar("comprobando");

    try {
        const informacionBaseDatos =
            await window.dijini.obtenerEstadoBaseDatos();

        actualizarEstadoBaseDatosSidebar(
            "conectado",
            informacionBaseDatos
        );
    }
    catch (error) {
        console.error("Error al comprobar la conexión con la base de datos:");
        console.error(error);

        actualizarEstadoBaseDatosSidebar("sin-conexion");
    }
}


window.actualizarEstadoBaseDatosSidebar =
    actualizarEstadoBaseDatosSidebar;

comprobarEstadoBaseDatos();