let historialCargado = [];


function renderizarHistorial(historial) {
    const tabla = document.querySelector("#tablaHistorial");

    tabla.innerHTML = "";

    if (historial.length === 0) {
    tabla.innerHTML = `
        <tr>
            <td colspan="4" class="empty-table">
                No se encontraron registros.
            </td>
        </tr>
    `;

    return;
}

    historial.forEach((registro) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
           <td>${formatearFechaHora(registro.Fecha)}</td>
            <td>${registro.Tabla}</td>
            <td>${registro.Operacion}</td>
            <td>${registro.Descripcion}</td>
        `;

        tabla.appendChild(fila);
    });
}

function configurarBusquedaHistorial() {
    const inputBusqueda = document.querySelector("#buscarHistorial");

    inputBusqueda.addEventListener("input", () => {
        const textoBusqueda = inputBusqueda.value.toLowerCase().trim();

        const historialFiltrado = historialCargado.filter((registro) => {
            const fecha = formatearFechaHora(registro.Fecha).toLowerCase();
            const tabla = registro.Tabla.toLowerCase();
            const operacion = registro.Operacion.toLowerCase();
            const descripcion = registro.Descripcion.toLowerCase();

            return (
                fecha.includes(textoBusqueda) ||
                tabla.includes(textoBusqueda) ||
                operacion.includes(textoBusqueda) ||
                descripcion.includes(textoBusqueda)
            );
        });

        renderizarHistorial(historialFiltrado);
    });
}

async function inicializarHistorial() {
    try {
        historialCargado = await window.dijini.obtenerHistorial();

        renderizarHistorial(historialCargado);
        configurarBusquedaHistorial();
    }
    catch (error) {
        console.error("Error al cargar el historial:");
        console.error(error);
    }
}

window.inicializarHistorial = inicializarHistorial;