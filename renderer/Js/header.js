const busquedaGlobal = document.querySelector("#busquedaGlobal");
const resultadosBusquedaGlobal = document.querySelector("#resultadosBusquedaGlobal");
let resultadoBusquedaSeleccionado = null;


function mostrarResultadosBusqueda(resultados) {
    let contenido = "";

    /*======== COLEGIOS ========*/

    if (resultados.colegios.length > 0) {
        contenido += `
            <div class="global-search-section">
                <strong>COLEGIOS</strong>
            </div>
        `;

        resultados.colegios.forEach(colegio => {
            contenido += `
                <div
                    class="global-search-result"
                    data-vista="colegios"
                    data-id="${colegio.CUE_ID}"
                >
                    <span>${colegio.Nombre}</span>
                    <small>CUE: ${colegio.CUE_ID}</small>
                </div>
            `;
        });
    }


    /*======== USUARIOS ========*/

    if (resultados.usuarios.length > 0) {
        contenido += `
            <div class="global-search-section">
                <strong>USUARIOS</strong>
            </div>
        `;

        resultados.usuarios.forEach(usuario => {
            contenido += `
                <div
                    class="global-search-result"
                    data-vista="usuarios"
                    data-id="${usuario.DNI_ID}"
                >
                    <span>${usuario.Apellido}, ${usuario.Nombre}</span>
                    <small>${usuario.TipoUsuario}</small>
                </div>
            `;
        });
    }


    /*======== WORKSPACE ========*/

    if (resultados.workspace.length > 0) {
        contenido += `
            <div class="global-search-section">
                <strong>CORREOS CERI</strong>
            </div>
        `;

        resultados.workspace.forEach(workspace => {
            contenido += `
                <div
                    class="global-search-result"
                    data-vista="workspace"
                    data-id="${workspace.CorreoID}"
                >
                    <span>${workspace.DireccionCorreo}</span>
                    <small>${workspace.Apellido || ""} ${workspace.Nombre || ""}</small>
                </div>
            `;
        });
    }


    /*======== SIN RESULTADOS ========*/

    if (contenido === "") {
        contenido = `
            <div class="global-search-empty">
                No se encontraron resultados
            </div>
        `;
    }


    resultadosBusquedaGlobal.innerHTML = contenido;
    resultadosBusquedaGlobal.style.display = "block";
}


/*======== BUSQUEDA GLOBAL ========*/

busquedaGlobal.addEventListener("input", async () => {
    const textoBusqueda = busquedaGlobal.value.trim();

    if (textoBusqueda.length >= 2) {
        const resultados = await window.dijini.buscarGlobal(textoBusqueda);

        mostrarResultadosBusqueda(resultados);
    }
    else {
        resultadosBusquedaGlobal.style.display = "none";
    }
});


/*======== NAVEGACION DESDE BUSQUEDA GLOBAL ========*/

resultadosBusquedaGlobal.addEventListener("click", async (event) => {
    const resultadoSeleccionado =
        event.target.closest(".global-search-result");

    if (!resultadoSeleccionado) {
        return;
    }

    const vista = resultadoSeleccionado.dataset.vista;
    const id = resultadoSeleccionado.dataset.id;
    
    resultadoBusquedaSeleccionado = {
        vista: vista,
        id: id
    };

    await cargarVista(vista);

    resultadosBusquedaGlobal.style.display = "none";
    busquedaGlobal.value = "";
});


/*======== CERRAR BUSQUEDA GLOBAL ========*/

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        resultadosBusquedaGlobal.style.display = "none";
        busquedaGlobal.value = "";
    }
});


document.addEventListener("click", (event) => {
    const busqueda = event.target.closest(".global-search");

    if (!busqueda) {
        resultadosBusquedaGlobal.style.display = "none";
        busquedaGlobal.value = "";
    }
});