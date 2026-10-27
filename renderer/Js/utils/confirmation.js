// const { promises } = require("msnodesqlv8");

function mostrarConfirmacion(titulo, mensaje) {
    const modal = document.querySelector("#modalConfirmacion");
    const overlay = document.querySelector("#modalConfirmacionOverlay");
    const btnAceptar = document.querySelector("#btnAceptarConfirmacion");
    const btnCancelar = document.querySelector("#btnCancelarConfirmacion");


    document.querySelector("#modalConfirmacionTitulo").textContent = titulo;
    document.querySelector("#modalConfirmacionTexto").textContent = mensaje;

    modal.classList.add("open");
    overlay.classList.add("open");

    return new Promise(resolve => {
        btnAceptar.onclick = () => {
            cerrarConfirmacion();
            resolve(true);
        }

        btnCancelar.onclick = () => {
            cerrarConfirmacion();
            resolve(false);
        };

        overlay.onclick = () => {
            cerrarConfirmacion();
            resolve(false);
        };
    });
}

function cerrarConfirmacion() {
    const modal = document.querySelector("#modalConfirmacion");
    const overlay = document.querySelector("#modalConfirmacionOverlay");

    modal.classList.remove("open");
    overlay.classList.remove("open");
}