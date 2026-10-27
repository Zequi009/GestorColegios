async function comprobarEstadoBaseDatos() {
    const estadoBaseDatos = document.querySelector("#estadoBaseDatos");
    const textoEstadoBaseDatos = document.querySelector("#textoEstadoBaseDatos");
    const nombreBaseDatos = document.querySelector("#nombreBaseDatos");
    const versionMotorBaseDatos = document.querySelector("#versionMotorBaseDatos");
    const btnReintentarBaseDatos = document.querySelector("#btnReintentarBaseDatos");

    estadoBaseDatos.classList.remove("conectado", "sin-conexion");
    estadoBaseDatos.classList.add("comprobando");

    textoEstadoBaseDatos.textContent = "Comprobando conexión...";
    btnReintentarBaseDatos.hidden = true;

    if (typeof window.actualizarEstadoBaseDatosSidebar === "function") {
        window.actualizarEstadoBaseDatosSidebar("comprobando");
    }

    try {
        const informacionBaseDatos = await window.dijini.obtenerEstadoBaseDatos();

        estadoBaseDatos.classList.remove("comprobando");
        estadoBaseDatos.classList.add("conectado");

        textoEstadoBaseDatos.textContent = "Conectado";

        nombreBaseDatos.textContent = informacionBaseDatos.BaseDatos;
        versionMotorBaseDatos.textContent = informacionBaseDatos.VersionMotor;

        if (typeof window.actualizarEstadoBaseDatosSidebar === "function") {
            window.actualizarEstadoBaseDatosSidebar("conectado", informacionBaseDatos);
        }
    }
    catch (error) {
        console.error("Error al comprobar la conexión con la base de datos:");
        console.error(error);

        estadoBaseDatos.classList.remove("comprobando");
        estadoBaseDatos.classList.add("sin-conexion");

        textoEstadoBaseDatos.textContent = "Sin conexión";
        btnReintentarBaseDatos.hidden = false;

        if (typeof window.actualizarEstadoBaseDatosSidebar === "function") {
            window.actualizarEstadoBaseDatosSidebar("sin-conexion");
        }
    }
}

function inicializarBaseDeDatos() {
    const btnReintentarBaseDatos =
        document.querySelector("#btnReintentarBaseDatos");

    btnReintentarBaseDatos.addEventListener("click", () => {
        comprobarEstadoBaseDatos();
    });

    comprobarEstadoBaseDatos();
}

window.inicializarBaseDeDatos = inicializarBaseDeDatos;