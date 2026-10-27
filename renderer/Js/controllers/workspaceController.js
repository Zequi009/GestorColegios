
let correosWorkspaceCargados = [];
let modoFormularioWorkspace = "crear"
let correoWorkspaceEditandoId = null;

/*=================
ABRIR Y CERRAR PANEL
==================== */
// Abre el panel de correos Workspace y muestra el fondo superpuesto.
function abrirPanelWorkspace() {
    const panel = document.querySelector("#panelWorkspace");
    const overlay = document.querySelector("#panelWorkspaceOverlay");

    panel.classList.add("open");
    overlay.classList.add("open");
}

// Cierra el panel de correos Workspace y oculta el fondo superpuesto.
function cerrarPanelWorkspace() {
    const panel = document.querySelector("#panelWorkspace");
    const overlay = document.querySelector("#panelWorkspaceOverlay");

    panel.classList.remove("open");
    overlay.classList.remove("open");
}


// Configura los botones y el fondo superpuesto para abrir o cerrar el panel.
function configurarPanelWorkspace() {
    const btnCerrar = document.querySelector("#btnCerrarPanelWorkspace");
    const btnCancelar = document.querySelector("#btnCancelarPanelWorkspace");
    const btnAgregar = document.querySelector("#btnAgregarCorreo");
    const overlay = document.querySelector("#panelWorkspaceOverlay");

    btnCerrar.addEventListener("click", cerrarPanelWorkspace);
    btnCancelar.addEventListener("click", cerrarPanelWorkspace);
    btnAgregar.addEventListener("click", nuevoCorreoWorkspace);
    overlay.addEventListener("click", cerrarPanelWorkspace);
}

// Muestra el selector de usuario o colegio según el tipo de entidad elegido.
function configurarTipoEntidadWorkspace() {
    const selectTipoEntidad = document.querySelector("#workspaceTipoEntidad");
    const campoUsuario = document.querySelector("#campoWorkspaceUsuario");
    const campoColegio = document.querySelector("#campoWorkspaceColegio");

    // Actualiza la visibilidad de los campos cuando cambia el tipo de entidad.
    selectTipoEntidad.addEventListener("change", () => {
        const tipoEntidad = selectTipoEntidad.value;

        if (tipoEntidad !== "") {
            selectTipoEntidad.classList.remove("error");
        }

        if (tipoEntidad === "usuario") {
            campoUsuario.hidden = false;
            campoColegio.hidden = true;
        }
        else if (tipoEntidad === "colegio") {
            campoUsuario.hidden = true;
            campoColegio.hidden = false;
        }
        else {
            campoUsuario.hidden = true;
            campoColegio.hidden = true;
        }
    });
}

// Carga los usuarios disponibles en el selector y conserva la opción inicial.
async function cargarSelectUsuariosDisponibles() {
    const selectUsuario = document.querySelector("#workspaceUsuario");
    const usuarios = await window.dijini.obtenerUsuariosDisponiblesWorkspace();

    selectUsuario.length = 1

    // Agrega una opción con el DNI, el apellido y el nombre de cada usuario.
    usuarios.forEach((usuario) => {
        const opcion = document.createElement("option")

        opcion.value = usuario.DNI_ID
        opcion.textContent = `${usuario.Apellido}, ${usuario.Nombre}`;

        selectUsuario.appendChild(opcion)
    });
};

// Carga los colegios disponibles en el selector y conserva la opción inicial.
async function cargarSelectColegiosDisponibles() {
    const selectColegio = document.querySelector("#workspaceColegio");
    const colegios = await window.dijini.obtenerColegiosDisponiblesWorkspace();

    selectColegio.length = 1

    // Agrega una opción con el CUE y el nombre de cada colegio.
    colegios.forEach((colegio) => {
        const opcion = document.createElement("option");

        opcion.value = colegio.CUE_ID;
        opcion.textContent = colegio.Nombre;

        selectColegio.appendChild(opcion);
    });
}

// Reinicia el formulario, carga los selectores y abre el panel para agregar un correo.
async function nuevoCorreoWorkspace() {
    modoFormularioWorkspace = "crear"
    correoWorkspaceEditandoId = null;
    const formulario = document.querySelector("#formWorkspace");
    const campoUsuario = document.querySelector("#campoWorkspaceUsuario");
    const campoColegio = document.querySelector("#campoWorkspaceColegio");
    const selectTipoEntidad = document.querySelector("#workspaceTipoEntidad");
    const selectUsuario = document.querySelector("#workspaceUsuario");
    const selectColegio = document.querySelector("#workspaceColegio");

    formulario.reset();

    selectTipoEntidad.disabled = false;
    selectUsuario.disabled = false;
    selectColegio.disabled = false;

    document.querySelector("#workspaceTipoEntidad").classList.remove("error");

    await cargarSelectColegiosDisponibles();
    await cargarSelectUsuariosDisponibles();

    campoColegio.hidden = true;
    campoUsuario.hidden = true;

    document.querySelector("#panelWorkspaceTitulo").textContent =
        "Agregar correo Workspace";

    document.querySelector("#panelWorkspaceTexto").textContent =
        "Completá los datos del nuevo correo.";

    abrirPanelWorkspace();
}

// Registra en consola el ID del correo a editar;

async function editarCorreoWorkspace(correoId) {
    modoFormularioWorkspace = "editar"
    const correo = correosWorkspaceCargados.find(correo => {
        return String(correo.CorreoID) === String(correoId);
    });
    if (!correo) {
        mostrarNotificacion("No se encontro el correo Workspace", "error");
        return;
    }
    correoWorkspaceEditandoId = correoId;
    /*========= PRIMER SELECt ========*/
    const tipoEntidad = correo.DNI_ID !== null ? "usuario" : "colegio";
    const selectTipoEntidad = document.querySelector("#workspaceTipoEntidad");
    selectTipoEntidad.value = tipoEntidad;
    selectTipoEntidad.disabled = true;

    document.querySelector("#panelWorkspaceTitulo").textContent = "Editar correo Workspace";
    document.querySelector("#panelWorkspaceTexto").textContent = "Modificar los datos del correo.";
    document.querySelector("#workspaceCorreo").value = correo.DireccionCorreo ?? "";
    document.querySelector("#workspaceFechaAlta").value = formatearInputFecha(correo.FechaAlta);
    document.querySelector("#workspaceFechaBaja").value = formatearInputFecha(correo.FechaBaja);

    /*======== SEGUNDO SELECT ========*/
    const campoUsuario = document.querySelector("#campoWorkspaceUsuario");
    const campoColegio = document.querySelector("#campoWorkspaceColegio");

    const selectUsuario = document.querySelector("#workspaceUsuario");
    const selectColegio = document.querySelector("#workspaceColegio");

    if (tipoEntidad === "usuario") {
        campoUsuario.hidden = false;
        campoColegio.hidden = true;

        selectUsuario.innerHTML = "";
        const opcion = document.createElement("option");
        opcion.value = correo.DNI_ID;
        opcion.textContent = `${correo.Apellido}, ${correo.Nombre}`

        selectUsuario.appendChild(opcion);
        selectUsuario.disabled = true;
    }
    else {
        campoUsuario.hidden = true;
        campoColegio.hidden = false;

        selectColegio.innerHTML = "";
        const opcion = document.createElement("option");

        opcion.value = correo.CUE_ID;
        opcion.textContent = correo.Colegio;

        selectColegio.appendChild(opcion);
        selectColegio.disabled = true;
    }
    abrirPanelWorkspace();

}

// Solicita confirmación y elimina el correo Workspace seleccionado.

async function eliminarCorreoWorkspace(correoId) {
    const confirmado = await mostrarConfirmacion("Eliminar correo Workspace", "¿Estas seguro de que deseas eliminar este correo Workspace?");
    if (!confirmado) {
        return;
    };
    try {
            const resultado = await window.dijini.eliminarCorreoWorkspace(correoId);
            if (resultado === 1) {
                correosWorkspaceCargados = await window.dijini.obtenerCorreosWorkspace();

                renderizarWorkspace(correosWorkspaceCargados);
                mostrarNotificacion("Correo Workspace eliminado correctamente", "exito");
            }
        }
        catch (error) {
            console.error("Error al eliminar el correo workspace");
            console.error(error);

            mostrarNotificacion("No se pudo eliminar el correo workspace", "error")
        }
};


// Recoge los datos del formulario, normaliza el correo y asigna el usuario o colegio.
function obtenerDatosFormularioWorkspace() {
    const tipoEntidad = document.querySelector("#workspaceTipoEntidad").value;
    const usuario = document.querySelector("#workspaceUsuario").value;
    const colegio = document.querySelector("#workspaceColegio").value;
    const correo = document.querySelector("#workspaceCorreo").value.trim();
    const fechaAlta = document.querySelector("#workspaceFechaAlta").value;
    const fechaBaja = document.querySelector("#workspaceFechaBaja").value;

    return {
        CorreoID: correoWorkspaceEditandoId,
        DireccionCorreo: correo === "" ? null : correo.toLowerCase(),
        FechaAlta: fechaAlta === "" ? null : fechaAlta,
        FechaBaja: fechaBaja === "" ? null : fechaBaja,
        DNI_ID: tipoEntidad === "usuario" && usuario !== "" ? Number(usuario) : null,
        CUE_ID: tipoEntidad === "colegio" && colegio !== "" ? Number(colegio) : null
    };
}

function configurarFormularioWorkspace() {
    const formulario = document.querySelector("#formWorkspace");

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const workspace = obtenerDatosFormularioWorkspace();
        const tipoEntidad = document.querySelector("#workspaceTipoEntidad").value;

        if (modoFormularioWorkspace === "crear") {

            if (tipoEntidad === "") {
                mostrarNotificacion("Debe seleccionar si el correo pertence a un usuario o a un colegio", "advertencia");
                return;
            };

            if (tipoEntidad === "usuario" && workspace.DNI_ID === null) {
                mostrarNotificacion("Debes seleccionar un usuario", "advertencia");
                return;
            };

            if (tipoEntidad === "colegio" && workspace.CUE_ID === null) {
                mostrarNotificacion("Debes seleccionar un colegio", "advertencia");
                return;
            };

        }

        if (workspace.DireccionCorreo === null) {
            mostrarNotificacion("Debe ingresar una direccion de correo", "advertencia");
            return;
        }

        if (!validarCorreo(workspace.DireccionCorreo)) {
            mostrarNotificacion("Ingrese una direccion de correo valida", "advertencia")
            return;
        }

        if (workspace.FechaAlta === null) {
            mostrarNotificacion("Debe ingresar una fecha de alta.","advertencia");
            return;
        }

        if (workspace.FechaBaja !== null &&workspace.FechaBaja < workspace.FechaAlta) {
            mostrarNotificacion("La fecha de baja no puede ser anterior a la fecha de alta.", "advertencia");
            return;
        }
        if (modoFormularioWorkspace === "crear") {
            try {
                await window.dijini.crearCorreoWorkspace(workspace);

                correosWorkspaceCargados = await window.dijini.obtenerCorreosWorkspace();
                renderizarWorkspace(correosWorkspaceCargados);
                cerrarPanelWorkspace();

                mostrarNotificacion("Correo Workspace agregado correctamente", "exito");
            }
            catch (error) {
                console.error("Error al crear el correo Workspace")
                console.error(error);

                mostrarNotificacion("No se pudo cargar el correo Workspace", "error");
            };
        }

        if (modoFormularioWorkspace === "editar") {
            try {
                const resultado =
                    await window.dijini.actualizarCorreoWorkspace(workspace);

                if (resultado === 1) {
                    correosWorkspaceCargados =
                        await window.dijini.obtenerCorreosWorkspace();

                    renderizarWorkspace(correosWorkspaceCargados);
                    cerrarPanelWorkspace();

                    mostrarNotificacion("Correo Workspace actualizado correctamente", "exito");
                }
            }
            catch (error) {
                console.error("Error al actualizar el correo Workspace");
                console.error(error);

                mostrarNotificacion("No se pudo actualizar el correo Workspace", "error");
            };
        };


    });
};

// Configura la búsqueda por nombre, apellido, colegio, tipo de usuario o correo.
function configurarBusquedaWorkspace() {
    const inputBuscar = document.querySelector("#buscarCorreo");

    // Filtra los correos y actualiza la tabla cada vez que cambia el texto de búsqueda.
    inputBuscar.addEventListener("input", () => {
        const textoBusqueda = inputBuscar.value.trim().toLowerCase();

        // Comprueba si algún campo del correo contiene el texto buscado, sin distinguir mayúsculas.
        const correosFiltrados = correosWorkspaceCargados.filter((correo) => {
            const nombre = String(correo.Nombre ?? "").toLowerCase();
            const apellido = String(correo.Apellido ?? "").toLowerCase();
            const colegio = String(correo.Colegio ?? "").toLowerCase();
            const tipoUsuario = String(correo.TipoUsuario ?? "").toLowerCase();
            const direccionCorreo = String(correo.DireccionCorreo ?? "").toLowerCase();

            return (
                nombre.includes(textoBusqueda) ||
                apellido.includes(textoBusqueda) ||
                colegio.includes(textoBusqueda) ||
                tipoUsuario.includes(textoBusqueda) ||
                direccionCorreo.includes(textoBusqueda)
            );
        });

        renderizarWorkspace(correosFiltrados);
    });
}
// Genera las filas de la tabla y conecta los botones de edición y eliminación.
function renderizarWorkspace(correos) {
    const tablaWorkspace = document.querySelector("#tablaWorkspace");

    tablaWorkspace.innerHTML = "";


    // Crea y agrega una fila con los datos y las acciones de cada correo.
    correos.forEach((correo) => {
        const fila = document.createElement("tr");
        // console.log(correo.CorreoID)
        fila.innerHTML = `
            <td>${mostrarDato(correo.Nombre)}</td>
            <td>${mostrarDato(correo.Apellido)}</td>
            <td>${mostrarDato(correo.Colegio)}</td>
            <td>${mostrarDato(correo.TipoUsuario)}</td>
            <td>${mostrarDato(correo.DireccionCorreo)}</td>
            <td>${formatearFecha(correo.FechaAlta)}</td>
            <td>${formatearFecha(correo.FechaBaja)}</td>
             <td class="actions-cell">
                <button
                    class="action-button editar"
                    data-correo-id="${correo.CorreoID}"
                    title="Editar correo workspace"
                    aria-label="Editar correo workspace"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                    </svg>
                </button>

                <button
                    class="action-button eliminar"
                    data-correo-id="${correo.CorreoID}"
                    title="Eliminar correo workspace"
                    aria-label="Eliminar correo workspace"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 6h18"></path>
                        <path d="M8 6V4h8v2"></path>
                        <path d="M19 6l-1 14H6L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                    </svg>
                </button>
            </td>
        `;
        const btnEditar = fila.querySelector(".editar");
        const btnEliminar = fila.querySelector(".eliminar")

        // Envía el ID del correo de esta fila a la función de edición.
        btnEditar.addEventListener("click", () => {
            editarCorreoWorkspace(btnEditar.dataset.correoId);
        });

        // Envía el ID del correo de esta fila a la función de eliminación.
        btnEliminar.addEventListener("click", () => {
            eliminarCorreoWorkspace(btnEliminar.dataset.correoId);
        });

        tablaWorkspace.appendChild(fila);
    });
}

// Carga los correos, configura la interfaz y registra los errores de inicialización.
async function inicializarWorkspace() {
    try {
        correosWorkspaceCargados =
            await window.dijini.obtenerCorreosWorkspace();
        let correosParaMostrar = correosWorkspaceCargados;

        if (resultadoBusquedaSeleccionado?.vista === "workspace") {
            const correoSeleccionado = correosWorkspaceCargados.find(correo => {
                return String(correo.CorreoID) === String(resultadoBusquedaSeleccionado.id);
            });

            resultadoBusquedaSeleccionado = null;
            correosParaMostrar = correoSeleccionado ? [correoSeleccionado] : [];
        }

        renderizarWorkspace(correosParaMostrar);
        configurarBusquedaWorkspace();
        configurarPanelWorkspace();
        configurarTipoEntidadWorkspace();
        configurarFormularioWorkspace();
    }
    catch (error) {
        console.error("Error al cargar los correos de Workspace:");
        console.error(error);
    }
}
