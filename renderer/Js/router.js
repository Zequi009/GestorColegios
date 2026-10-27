const mainContent = document.getElementById("mainContent");

async function cargarVista(nombreVista) {
    const respuesta = await fetch(`Views/${nombreVista}.html`);
    const html = await respuesta.text();

    mainContent.innerHTML = html;

    InicializarVista(nombreVista)
}

function InicializarVista(nombreVista) {
    switch (nombreVista) {
        case "colegios":
            // Si la función ya existe en el ámbito global, ejecutarla.
            if (typeof window.inicializarColegios === "function") {
                inicializarColegios();
            } else {
                // Si no existe, cargar dinámicamente el script del controlador y ejecutarlo al cargar.
                const script = document.createElement("script");
                script.src = "Js/controllers/ColegiosController.js";
                script.onload = () => {
                    if (typeof window.inicializarColegios === "function") {
                        inicializarColegios();
                    } else {
                        console.error("El controlador de colegios se cargó pero inicializarColegios sigue sin estar definido.");
                    }
                };
                script.onerror = () => {
                    console.error("No se pudo cargar el script del controlador de colegios: ", script.src);
                };
                document.body.appendChild(script);
            }
            break;

        case "usuarios":
            if (typeof window.inicializarUsuarios === "function") {
                inicializarUsuarios();
            } else {
                const script = document.createElement("script");
                script.src = "Js/controllers/usuariosController.js";

                script.onload = () => {
                    if (typeof window.inicializarUsuarios === "function") {
                        inicializarUsuarios()
                    } else {
                        console.error("El controlador de usuarios se cargó pero inicializarUsuarios sigue sin estar definido.")
                    }
                }

                script.onerror = () => {
                    console.error("No pudo cargar el script del controlador de usuarios:", script.src)
                }
                document.body.appendChild(script);
            }
            break;
        case "workspace":
            if (typeof window.inicializarWorkspace === "function") {
                inicializarWorkspace();
            } else {
                const script = document.createElement("script");
                script.src = "Js/controllers/workspaceController.js";

                script.onload = () => {
                    if (typeof window.inicializarWorkspace === "function") {
                        inicializarWorkspace();
                    } else {
                        console.error(
                            "El controlador de Workspace se cargó pero inicializarWorkspace sigue sin estar definido."
                        );
                    }
                };

                script.onerror = () => {
                    console.error(
                        "No se pudo cargar el script del controlador de Workspace:",
                        script.src
                    );
                };

                document.body.appendChild(script);
            }
            break;
        case "historial":
            if (typeof window.inicializarHistorial === "function") {
                inicializarHistorial();
            } else {
                const script = document.createElement("script");
                script.src = "Js/controllers/historialController.js";

                script.onload = () => {
                    if (typeof window.inicializarHistorial === "function") {
                        inicializarHistorial();
                    } else {
                        console.error(
                            "El controlador de Historial se cargó pero inicializarHistorial sigue sin estar definido."
                        );
                    }
                };

                script.onerror = () => {
                    console.error(
                        "No se pudo cargar el script del controlador de Historial:",
                        script.src
                    );
                };

                document.body.appendChild(script);
            }
            break;

        case "configuracion":
            if (typeof window.inicializarConfiguracion === "function") {
                inicializarConfiguracion();
            } else {
                const script = document.createElement("script");
                script.src = "Js/controllers/configuracionController.js";

                script.onload = () => {
                    if (typeof window.inicializarConfiguracion === "function") {
                        inicializarConfiguracion();
                    } else {
                        console.error(
                            "El controlador de Configuración se cargó pero inicializarConfiguracion sigue sin estar definido."
                        );
                    }
                };

                script.onerror = () => {
                    console.error(
                        "No se pudo cargar el script del controlador de Configuración:",
                        script.src
                    );
                };

                document.body.appendChild(script);
            }
            break;

        case "baseDeDatos":
            if (typeof window.inicializarBaseDeDatos === "function") {
                inicializarBaseDeDatos();
            } else {
                const script = document.createElement("script");
                script.src = "Js/controllers/baseDeDatosController.js";

                script.onload = () => {
                    if (typeof window.inicializarBaseDeDatos === "function") {
                        inicializarBaseDeDatos();
                    } else {
                        console.error(
                            "El controlador de Base de Datos se cargó pero inicializarBaseDeDatos sigue sin estar definido."
                        );
                    }
                };

                script.onerror = () => {
                    console.error(
                        "No se pudo cargar el script del controlador de Base de Datos:",
                        script.src
                    );
                };

                document.body.appendChild(script);
            }
            break;
        case "dashboard":
            if (typeof window.inicializarDashboard === "function") {
                inicializarDashboard();
            } else {
                const script = document.createElement("script");
                script.src = "Js/controllers/dashboardController.js";

                script.onload = () => {
                    if (typeof window.inicializarDashboard === "function") {
                        inicializarDashboard();
                    } else {
                        console.error(
                            "El controlador del Dashboard se cargó pero inicializarDashboard sigue sin estar definido."
                        );
                    }
                };

                script.onerror = () => {
                    console.error(
                        "No se pudo cargar el script del controlador del Dashboard:",
                        script.src
                    );
                };

                document.body.appendChild(script);
            }
            break;
    }
}




function marcarBotonActivo(botonActivo) {
    const botonesMenu = document.querySelectorAll(".sidebar-link");
    const btnConfiguracion = document.querySelector("#btnConfiguracion");

    botonesMenu.forEach((boton) => {
        boton.classList.remove("active");
    });

    btnConfiguracion.classList.remove("active");
    botonActivo.classList.add("active");
}

function iniciarRouter() {
    const botonesMenu = document.querySelectorAll(".sidebar-link");
    const btnConfiguracion = document.querySelector("#btnConfiguracion");

    botonesMenu.forEach((boton) => {
        boton.addEventListener("click", () => {
            const vista = boton.dataset.view;
            cargarVista(vista);
            marcarBotonActivo(boton);
        });
    });
    btnConfiguracion.addEventListener("click", () => {
        cargarVista("configuracion");
         marcarBotonActivo(btnConfiguracion);
    });

    cargarVista("dashboard");
}

iniciarRouter();