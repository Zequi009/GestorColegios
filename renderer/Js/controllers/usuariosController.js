let usuariosCargados = [];
let modoFormularioUsuario = "crear";

/**
 * Abre el panel lateral del formulario de usuarios y muestra su fondo superpuesto.
 */

function abrirPanelUsuario() {
    const panel = document.querySelector('#panelUsuario');
    const overlay = document.querySelector('#panelUsuarioOverlay');

    panel.classList.add("open");
    overlay.classList.add("open");
};

/**
 * Cierra el panel lateral del formulario de usuarios y oculta el fondo superpuesto.
 */

function cerrarPanelUsuario() {
    const panel = document.querySelector('#panelUsuario');
    const overlay = document.querySelector('#panelUsuarioOverlay');

    panel.classList.remove("open");
    overlay.classList.remove("open");
}

/**
 * Obtiene los colegios disponibles y los carga como opciones en el selector del formulario.
 */
async function cargarColegiosSelect() {
    const selectColegio = document.querySelector('#usuarioColegio');
    const colegios = await window.dijini.obtenerColegios();

    selectColegio.innerHTML = `<option value =""> sin colegio</option>`;

    colegios.forEach((colegio) => {
        const opcion = document.createElement("option")
        opcion.value = colegio.CUE_ID;
        opcion.textContent = colegio.Nombre;

        selectColegio.appendChild(opcion);
    });
};

/**
 * Prepara el formulario para crear un usuario nuevo, limpia sus campos,
 * carga los colegios disponibles y abre el panel lateral.
 */

async function nuevoUsuario() {

    modoFormularioUsuario = "crear";

    document.querySelector("#panelUsuarioTitulo").textContent = "Nuevo Usuario."
    document.querySelector("#panelUsuarioTexto").textContent = "Completa los datos del Nuevo Usuario.";

    document.querySelector("#formUsuario").reset();
    document.querySelector("#usuarioDni").readOnly = false;
    document.querySelector("#usuarioDniAyuda").textContent = "El DNI no se podra modificar una vez que el usuario sea creado."

    await cargarColegiosSelect();

    abrirPanelUsuario()
}

/* Busca un usuario por su DNI, carga sus datos en el formulario
   y abre el panel lateral en modo edición. */

async function editarUsuario(dni) {
    await cargarColegiosSelect();
    modoFormularioUsuario = "editar";

    const usuario = usuariosCargados.find(usuarioCargado => {
        return String(usuarioCargado.DNI_ID) === String(dni);
    });

    if (!usuario) {
        mostrarNotificacion("No se encontró el usuario", "error");

        return;
    };

    document.querySelector("#panelUsuarioTitulo").textContent = "Editar Usuario";
    document.querySelector("#panelUsuarioTexto").textContent = "Modifica los datos del usuario."

    document.querySelector("#usuarioDni").value = usuario.DNI_ID;
    document.querySelector("#usuarioDni").readOnly = "true";
    document.querySelector("#usuarioNombre").value = usuario.Nombre;
    document.querySelector("#usuarioApellido").value = usuario.Apellido;
    document.querySelector("#usuarioCorreo").value = usuario.CorreoAlternativo ?? "";
    document.querySelector("#usuarioTipo").value = usuario.TipoUsuario ?? "";
    document.querySelector("#usuarioColegio").value = usuario.CUE_ID ?? "";

    abrirPanelUsuario();
}

/* ===== ELIMINA AL USUARIO =====*/ 

async function eliminarUsuario(dni) {
    const usuario = usuariosCargados.find(usuarioCargado => {
        return String(usuarioCargado.DNI_ID) === String(dni);
    });
    if (!usuario) {
        mostrarNotificacion("No se encontro el usuario", "error")

        return;
    }

    const dependencias = await window.dijini.obtenerDependenciasUsuarios(dni);
    let mensajeConfirmacion;

    if (dependencias.CorreosAsociados > 0) {
        mensajeConfirmacion =
            "Este usuario tiene un correo Workspace asociado. " +
            "Al eliminar el usuario, también se eliminará ese registro." +
            "¿Desea continuar?";
    }
    else {
        mensajeConfirmacion ="¿Está seguro de que desea eliminar este usuario?";
    }

    const confirmado = await mostrarConfirmacion("Eliminar usuario",mensajeConfirmacion);

    if (!confirmado) {
        return;
    }

    try{
        const resultado = await window.dijini.eliminarUsuario(dni);

        if(resultado === 1){
            usuariosCargados = await window.dijini.obtenerUsuarios();
            renderizarUsuarios(usuariosCargados);

            mostrarNotificacion("El usuario se elimino correctamente","exito");
        }
        else{
            mostrarNotificacion("No se pudo eliminar el usuario", "error")
        };
    }
    catch(error){
        console.error("Error al eliminar el usuario:")
        console.error(error);

        mostrarNotificacion("No se pudo eliminar el usuario:", "error");
    };


}

/* Obtiene, limpia y transforma los valores introducidos en el formulario
   para construir el objeto que se enviará a la base de datos. */


function obtenerDatosFormularioUsuario() {
    const dni = document.querySelector('#usuarioDni').value.trim();
    const nombre = document.querySelector('#usuarioNombre').value.trim();
    const apellido = document.querySelector('#usuarioApellido').value.trim();
    const correo = document.querySelector('#usuarioCorreo').value.trim();
    const tipoUsuario = document.querySelector('#usuarioTipo').value;
    const cue = document.querySelector('#usuarioColegio').value;


    return {
        DNI_ID: dni,
        Nombre: nombre,
        Apellido: apellido,
        CorreoAlternativo: correo === "" ? null : correo.toLowerCase(),
        TipoUsuario: tipoUsuario === "" ? null : tipoUsuario,
        CUE_ID: cue === "" ? null : Number(cue)
    }

}
/* Valida los datos del formulario y, si son correctos,
   solicita la creación del usuario en la base de datos. */

function configurarFormularioUsuario() {
    const formulario = document.querySelector("#formUsuario");

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const usuario = obtenerDatosFormularioUsuario(); // Obtiene los datos del formulario como un objeto.

        const dniExistente = usuariosCargados.some(usuarioCargado => {
            return String(usuarioCargado.DNI_ID) === String(usuario.DNI_ID)
        });

        if (!validarDNI(usuario.DNI_ID)) {
            mostrarNotificacion("El DNI es obligatorio y solo puede contener números.", "advertencia");

            return;
        }

        if (!validarNombre(usuario.Nombre)) {
            mostrarNotificacion("El campo Nombre es obligatorio.", "advertencia");
            return;
        }

        if (!validarNombre(usuario.Apellido)) {
            mostrarNotificacion("El campo Apellido es obligatorio.", "advertencia");
            return
        };

        if (usuario.CorreoAlternativo !== null && !validarCorreo(usuario.CorreoAlternativo)) {
            mostrarNotificacion("Ingrese un correo electrónico Valido", "advertencia");
            return;
        };

        if (!validarTipoUsuario(usuario.TipoUsuario)) {
            mostrarNotificacion("Selecciona un tipo de Usuario Valido", "advertencia");
            return;
        }

        if (usuario.CUE_ID === null) {
            mostrarNotificacion("Debe seleccionar un colegio", "advertencia");
            return
        }

        /*===== CREAR =====*/
        if (modoFormularioUsuario === "crear") {
            if (dniExistente) {
                mostrarNotificacion("Ya existe un usuario registrado con ese DNI", "advertencia");
                return;
            }

            try {
                const resultado = await window.dijini.crearUsuario(usuario);

                if (resultado === 1) {
                    usuariosCargados = await window.dijini.obtenerUsuarios();
                    renderizarUsuarios(usuariosCargados);
                    cerrarPanelUsuario();

                    mostrarNotificacion("El usuario se agregó correctamente", "exito");
                }
                else {
                    mostrarNotificacion("no se pudo agregar el usuario", "error");
                }
            }
            catch (error) {
                console.error("Error al crear el usuario:");
                console.error(error);

                mostrarNotificacion(
                    "Ocurrió un error al agregar el usuario.",
                    "error"
                );
            };
        }
        /*===== EDITAR ===== */

        else if (modoFormularioUsuario === "editar") {
            try {
                const resultado = await window.dijini.actualizarUsuario(usuario);

                if (resultado === 1) {
                    usuariosCargados = await window.dijini.obtenerUsuarios();
                    renderizarUsuarios(usuariosCargados);
                    cerrarPanelUsuario();

                    mostrarNotificacion("El usuario se ha modificado correctamente", "exito");
                }
                else {
                    mostrarNotificacion("No se pudo actualizar el usuario", "error");
                }
            }
            catch (error) {
                console.error("Error al actualizar el usuario:")
                console.error(error);

                mostrarNotificacion("Ocurrió un error al actualizar el usuario.", "error")
            }
        }

    });
}

/**
 * Inicializa la vista de usuarios: carga los registros, configura el formulario,
 * activa la búsqueda y registra los eventos de los botones del panel.
 */
async function inicializarUsuarios() {
    try {
        // Obtiene los usuarios registrados y los muestra en la tabla.
        usuariosCargados = await window.dijini.obtenerUsuarios()
        let usuariosParaMostrar = usuariosCargados;

        if (resultadoBusquedaSeleccionado?.vista === "usuarios") {
            const usuarioSeleccionado = usuariosCargados.find(usuarioCargado => {
                return String(usuarioCargado.DNI_ID) === String(resultadoBusquedaSeleccionado.id);
            });

            resultadoBusquedaSeleccionado = null;
            usuariosParaMostrar = usuarioSeleccionado ? [usuarioSeleccionado] : [];
        }

        renderizarUsuarios(usuariosParaMostrar);
        configurarFormularioUsuario();


        // Configura el campo de búsqueda para filtrar la tabla en tiempo real.
        const inputBuscar = document.querySelector("#buscarUsuario");

        inputBuscar.addEventListener("input", () => {  // Filtra y actualiza la tabla según el texto introducido.
            buscarUsuarios(inputBuscar.value);
        })
        // Obtiene las referencias de los controles del panel lateral.
        const btnAgregarUsuario = document.querySelector("#btnAgregarUsuario");
        const btnCerrarPanelUsuario = document.querySelector("#btnCerrarPanelUsuario");
        const btnCancelarPanelUsuario = document.querySelector("#btnCancelarPanelUsuario");
        const panelUsuarioOverlay = document.querySelector("#panelUsuarioOverlay");

        // Asocia cada botón con la acción correspondiente.

        btnAgregarUsuario.addEventListener("click", nuevoUsuario);
        btnCerrarPanelUsuario.addEventListener("click", cerrarPanelUsuario);
        btnCancelarPanelUsuario.addEventListener("click", cerrarPanelUsuario);
        panelUsuarioOverlay.addEventListener("click", cerrarPanelUsuario);
    }
    catch (error) {
        console.error("Error al cargar usuarios:")
        console.error(error);
    }

}

// Filtra los usuarios por DNI, nombre, apellido, correo, tipo o colegio.

function buscarUsuarios(texto) {
    const busqueda = texto.toLowerCase().trim();

    const usuariosFiltrados = usuariosCargados.filter((usuario) => {
        return (
            String(usuario.DNI_ID).includes(busqueda) ||
            mostrarDato(usuario.Nombre).toLowerCase().includes(busqueda) ||
            mostrarDato(usuario.Apellido).toLowerCase().includes(busqueda) ||
            mostrarDato(usuario.CorreoAlternativo).toLowerCase().includes(busqueda) ||
            mostrarDato(usuario.TipoUsuario).toLowerCase().includes(busqueda) ||
            mostrarDato(usuario.Colegio).toLowerCase().includes(busqueda)
        );
    });

    renderizarUsuarios(usuariosFiltrados);
}


// Limpia la tabla y genera una fila por cada usuario recibido.
function renderizarUsuarios(usuarios) {
    const tablaUsuarios = document.querySelector("#tablaUsuarios");

    tablaUsuarios.innerHTML = "";

    usuarios.forEach((usuario) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${mostrarDato(usuario.DNI_ID)}</td>
            <td>${mostrarDato(usuario.Nombre)}</td>
            <td>${mostrarDato(usuario.Apellido)}</td>
            <td>${mostrarDato(usuario.CorreoAlternativo)}</td>
            <td>${mostrarDato(usuario.TipoUsuario)}</td>
            <td>${mostrarDato(usuario.Colegio)}</td>
            <td class="actions-cell">
                <button
                    class="action-button editar"
                    data-dni="${usuario.DNI_ID}"
                    title="Editar usuario"
                    aria-label="Editar usuario"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                    </svg>
                </button>

                <button
                    class="action-button eliminar"
                    data-dni="${usuario.DNI_ID}"
                    title="Eliminar usuario"
                    aria-label="Eliminar usuario"
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
        const btnEliminar = fila.querySelector(".eliminar");

        btnEditar.addEventListener("click", () => {
            editarUsuario(btnEditar.dataset.dni);
        });
        btnEliminar.addEventListener("click", () => {
            eliminarUsuario(btnEliminar.dataset.dni);
        })

        tablaUsuarios.appendChild(fila);
    });
}
