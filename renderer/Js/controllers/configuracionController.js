function configurarNavegacionConfiguracion() {
    const btnAbrirHistorial = document.querySelector("#btnAbrirHistorial");
    const btnAbrirBaseDatos = document.querySelector("#btnAbrirBaseDatos");

    btnAbrirHistorial.addEventListener("click", () => {
        cargarVista("historial");
    });

    btnAbrirBaseDatos.addEventListener("click", () => {
        cargarVista("baseDeDatos");
    });
}

function inicializarConfiguracion() {
    configurarNavegacionConfiguracion();
}

window.inicializarConfiguracion = inicializarConfiguracion;