let colegiosCargados = [];
let modoFormularioColegio = "editar"


/*======== 
FUNCIONES ABRIR Y CERRAR PANEL 
========*/

function abrirPanelColegio() {
    const panel = document.querySelector("#panelColegio");
    const overlay = document.querySelector("#panelColegioOverlay");

    panel.classList.add("open");
    overlay.classList.add("open")
}
function cerrarPanelColegio() {
    const panel = document.querySelector("#panelColegio");
    const overlay = document.querySelector("#panelColegioOverlay");

    panel.classList.remove("open");
    overlay.classList.remove("open");
}

function configurarPanelColegio() {
    const btnCerrar = document.querySelector("#btnCerrarPanelColegio");
    const btnCancelar = document.querySelector("#btnCancelarPanelColegio");
    const btnAgregar = document.querySelector("#btnAgregarColegio");
    const overlay = document.querySelector("#panelColegioOverlay");



    btnCerrar.addEventListener("click", cerrarPanelColegio);
    btnCancelar.addEventListener("click", cerrarPanelColegio);
    btnAgregar.addEventListener("click", nuevoColegio);
    overlay.addEventListener("click", cerrarPanelColegio);
}


/*======== 
FUNCION EDITAR COLEGIOS
========*/
function editarColegio(cue) {
    modoFormularioColegio = "editar";

    /*===== CAMBIA EL NOMBRE y el texto =====*/
    document.querySelector("#panelColegioTitulo").textContent = "Editar colegio";
    document.querySelector("#panelColegioTexto").textContent = "Modificá los datos del establecimiento.";

    const colegio = colegiosCargados.find((colegio) => {
        return String(colegio.CUE_ID) === String(cue);
    });

    if (!colegio) {
        console.error(`No se encontró el colegio con CUE ${cue}`);
        return;
    }

    // document.querySelector("#colegioCue").value =
    //     colegio.CUE_ID ?? "";

    const inputCue = document.querySelector("#colegioCue");
    inputCue.value = colegio.CUE_ID ?? "";
    inputCue.readOnly = true;

    document.querySelector("#colegioCueAyuda").textContent = "";

    document.querySelector("#colegioNombre").value = colegio.Nombre ?? "";

    document.querySelector("#colegioLocalidad").value = colegio.Localidad ?? "";

    document.querySelector("#colegioDepartamento").value = colegio.Departamento ?? "";

    document.querySelector("#colegioTelefono").value = colegio.telefono ?? "";

    document.querySelector("#colegioCorreo").value = colegio.CorreoAlternativo ?? "";

    document.querySelector("#colegioNumeroComputadoras").value = colegio.NumeroComputadoras ?? "";

    abrirPanelColegio();
}

/*======== 
FUNCION AGREGAR UN COLEGIO 
======== */
function nuevoColegio() {
    modoFormularioColegio = "crear";

    document.querySelector("#panelColegioTitulo").textContent = "Agregar colegio";
    document.querySelector("#panelColegioTexto").textContent = "Agrega los datos de un nuevo establecimiento.";

    // document.querySelector("#colegioCue").value = "";
    const inputCue = document.querySelector("#colegioCue");

    inputCue.value = "";
    inputCue.readOnly = false;

    document.querySelector("#colegioCueAyuda").textContent = "El CUE no podrá modificarse una vez creado el colegio."

    document.querySelector("#colegioNombre").value = "";
    document.querySelector("#colegioLocalidad").value = "";
    document.querySelector("#colegioDepartamento").value = "";
    document.querySelector("#colegioTelefono").value = "";
    document.querySelector("#colegioCorreo").value = "";
    document.querySelector("#colegioNumeroComputadoras").value = "";

    abrirPanelColegio();
}

/*======== 
FUNCION BOTON ELIMINAR COLEGIOS
========*/
async function eliminarColegio(cue) {

    /*===== VALIDA QUE EL COLEGIO EXISTE =====*/
    const colegio = colegiosCargados.find(colegio => {
        return String(colegio.CUE_ID) === String(cue);
    });

    if (!colegio) {
        console.error(`No se encontro colegio con CUE ${cue}`);
        return;
    };

    /*==== MUESTRA LA CONFIRMACION =====*/
    const confirmado = await mostrarConfirmacion(
        "Eliminar COlegio",
        `¿Estas seguro de que queres eliminar "${colegio.Nombre}"`
    );

    if (!confirmado) {
        return;
    }

    try {
        const dependencias = await window.dijini.obtenerDependenciasColegio(cue)
        const tieneDependencias = dependencias.UsuariosAsociados > 0 || dependencias.CorreosAsociados > 0

        if (tieneDependencias) {
            mostrarNotificacion(`No se puede eliminar el colegio. Tiene ${dependencias.UsuariosAsociados} usuario(s) y ${dependencias.CorreosAsociados} correo(s) asociado(s).`,
                "advertencia"
            );
            return;
        }

        const resultado = await window.dijini.eliminarColegio(cue)

        if(resultado===1){
            colegiosCargados = colegiosCargados.filter (colegio =>{
                return String(colegio.CUE_ID) !== String(cue);
            });
            renderizarColegios(colegiosCargados);
            mostrarNotificacion("El colegio se eliminó correctamente.", "exito")
        }
        else{
            mostrarNotificacion("No se pudo eliminar el colegio", "error");
        }
    }
    catch (error) {
        console.error("Error al eliminar el colegio:")
        console.error(error);
        mostrarNotificacion("no se pudieron comprobar las relaciones del colegio.", "error");
    }  

};
/*===== 
CONSTRUYE Y DEVUELVE UNA FILA
=====*/

function crearFilaColegio(colegio) {
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${mostrarDato(colegio.CUE_ID)}</td>
        <td>${mostrarDato(colegio.Nombre)}</td>
        <td>${mostrarDato(colegio.Localidad)}</td>
        <td>${mostrarDato(colegio.Departamento)}</td>
        <td>${mostrarDato(colegio.telefono)}</td>
        <td>${mostrarDato(colegio.NumeroComputadoras)}</td>
        <td>${mostrarDato(colegio.CorreoAlternativo)}</td>

        <td class="actions-cell">
            <button
                class="action-button editar"
                data-cue="${colegio.CUE_ID}"
                title="Editar colegio"
                aria-label="Editar colegio"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                </svg>
            </button>

            <button
                class="action-button eliminar"
                data-cue="${colegio.CUE_ID}"
                title="Eliminar colegio"
                aria-label="Eliminar colegio"
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

    /*========
    SECCION QUE EJECUTA LA FUNCION EDITAR / ELIMINAR
    ==========*/

    const btnEditar = fila.querySelector(".editar");
    const btnEliminar = fila.querySelector(".eliminar");

    btnEditar.addEventListener("click", () => {
        editarColegio(btnEditar.dataset.cue)
    });

    btnEliminar.addEventListener("click", () => {
        eliminarColegio(btnEliminar.dataset.cue);
    });

    return fila;
}

/*=========
 FUNCION QUE RECORRE Y AGREGA LAS FILAS
===========*/

function renderizarColegios(colegios) {
    const tbody = document.querySelector("#tablaColegios");

    tbody.innerHTML = "";

    for (const colegio of colegios) {
        const fila = crearFilaColegio(colegio)

        tbody.appendChild(fila);
    }
}

/*========
CONFIGURA LA BUSQUEDA
========== */

function configurarBuscadorColegios() {
    const inputBuscar = document.querySelector("#buscarColegio");

    inputBuscar.addEventListener("input", () => {
        const texto = inputBuscar.value.toLowerCase().trim();

        const colegiosFiltrados = colegiosCargados.filter((colegio) => {
            const cue = String(colegio.CUE_ID ?? "").toLowerCase();
            const nombre = String(colegio.Nombre ?? "").toLowerCase();
            const localidad = String(colegio.Localidad ?? "").toLowerCase();
            const correo = String(colegio.CorreoAlternativo ?? "").toLowerCase();

            return (
                cue.includes(texto) ||
                nombre.includes(texto) ||
                localidad.includes(texto) ||
                correo.includes(texto)
            );
        });

        renderizarColegios(colegiosFiltrados);
    });
}

/*======== 
FUNCION QUE CAPTURA LOS DATOS MODIFICADOS 
========*/

function configurarFormularioColegio() {
    const formulario = document.querySelector("#formColegio");

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const cue = document.querySelector("#colegioCue").value.trim();
        const nombre = document.querySelector("#colegioNombre").value.trim();
        const localidad = document.querySelector("#colegioLocalidad").value.trim();
        const departamento = document.querySelector("#colegioDepartamento").value.trim();
        const telefono = document.querySelector("#colegioTelefono").value.trim();
        const correo = document.querySelector("#colegioCorreo").value.trim();
        const numeroComputadoras = document.querySelector("#colegioNumeroComputadoras").value.trim();
        

        /*======== VALIDACION DE CAMPOS ======== */
        // if (!formulario.checkValidity()) {
        //     formulario.reportValidity();
        //     return;
        // }

        if (!validarCUE(cue)) {
            mostrarNotificacion(
                "El CUE es obligatorio y solo puede contener números.",
                "advertencia"
            );
            return;
        }
        if (!validarNombre(nombre)) {
            mostrarNotificacion(
                "El Campo Nombre es obligatorio.",
                "advertencia"
            );
            return
        }

        if (!validarTelefono(telefono)) {
            mostrarNotificacion(
                "El campo Telefono Solo puede contener números",
                "advertencia"
            );;
            return;
        }

        if (!validarNumeroComputadoras(numeroComputadoras)) {
            mostrarNotificacion(
                "El número de computadoras solo puede contener números.",
                "advertencia"
            );
            return;
        }


        if (correo !== "" && !validarCorreo(correo)) {
            mostrarNotificacion(
                "Ingrese un Correo electrónico Valido",
                "advertencia"
            );
            return;
        };

        const colegioEditado = {    // ===> OBJETO ColegioEditado

            CUE_ID: cue,
            Nombre: capitalizarTexto(nombre),
            Localidad: localidad === "" ? null : capitalizarTexto(localidad),
            Departamento: departamento === "" ? null : capitalizarTexto(departamento),
            telefono: telefono === "" ? null : telefono,
            CorreoAlternativo: correo === "" ? null : correo.toLowerCase(),
            NumeroComputadoras: numeroComputadoras === "" ? null : numeroComputadoras
        };

        /*======== ACTUALIZA LA TABLA DESPUES DEL ========*/

        /*=======
          UPDATE
        =========*/

        if (modoFormularioColegio === "editar") {
            try {
                const resultado =
                    await window.dijini.actualizarColegio(colegioEditado);

                if (resultado === 1) {
                    const indice = colegiosCargados.findIndex((colegio) => {
                        return String(colegio.CUE_ID) === String(colegioEditado.CUE_ID);
                    });

                    if (indice !== -1) {
                        colegiosCargados[indice] = colegioEditado;
                    }

                    renderizarColegios(colegiosCargados);
                    cerrarPanelColegio();

                    mostrarNotificacion("Los datos se guardaron Correctamente.", "exito") // alerta de exito
                } else {
                    mostrarNotificacion("No se pudo actualizar el Colegio", "error")
                }

            } catch (error) {
                console.error("Error al actualizar el colegio:");
                console.error(error);

                mostrarNotificacion(
                    "Ocurrió un error al guardar los datos.",
                    "error"
                );
            }
        }

        /*======== 
          INSERT
        ========*/

        if (modoFormularioColegio === "crear") {

            const cueExistente = colegiosCargados.some((colegio) => {
                return String(colegio.CUE_ID) === String(colegioEditado.CUE_ID);
            });

            if (cueExistente) {
                mostrarNotificacion(
                    "Ya existe un colegio registrado con ese CUE.",
                    "advertencia"
                );
                return;
            }

            try {
                const resultado =
                    await window.dijini.crearColegio(colegioEditado);

                if (resultado === 1) {
                    colegiosCargados.push(colegioEditado);

                    renderizarColegios(colegiosCargados);
                    cerrarPanelColegio();

                    mostrarNotificacion(
                        "El colegio se agregó correctamente.",
                        "exito"
                    );

                } else {
                    mostrarNotificacion(
                        "No se pudo agregar el colegio.",
                        "error"
                    );
                }

            } catch (error) {
                console.error("Error al crear el colegio:");
                console.error(error);

                mostrarNotificacion(
                    "Ocurrió un error al agregar el colegio.",
                    "error"
                );
            }
        }

    });
}

/*==========
INICIALIZAR  LA VISTA DE COLEGIOS 
===========*/

async function inicializarColegios() {
    try {
        colegiosCargados = await window.dijini.obtenerColegios();
        let colegiosParaMostrar = colegiosCargados;

        if (resultadoBusquedaSeleccionado?.vista === "colegios") {
            const colegioSeleccionado = colegiosCargados.find(colegio => {
                return String(colegio.CUE_ID) === String(resultadoBusquedaSeleccionado.id);
            });

            resultadoBusquedaSeleccionado = null;
            colegiosParaMostrar = colegioSeleccionado ? [colegioSeleccionado] : [];
        }

        renderizarColegios(colegiosParaMostrar);
        configurarBuscadorColegios();
        configurarPanelColegio();
        configurarFormularioColegio();
    } catch (error) {
        console.error("No se pudieron cargar los colegios");
        console.error(error);
    }
}
