async function inicializarDashboard() {
    const totalColegios = document.querySelector("#totalColegios");
    const totalUsuarios = document.querySelector("#totalUsuarios");
    const totalDocentes = document.querySelector("#totalDocentes");
    const totalEstudiantes = document.querySelector("#totalEstudiantes");
    const graficoUsuarios = document.querySelector("#graficoUsuarios");

    const graficoWorkspace = document.querySelector("#graficoWorkspace");
    const porcentajeWorkspace = document.querySelector("#porcentajeWorkspace");
    const totalConWorkspace = document.querySelector("#totalConWorkspace");
    const totalPendienteWorkspace = document.querySelector("#totalPendienteWorkspace");
    const totalBajaWorkspace = document.querySelector("#totalBajaWorkspace");

    const tablaActividadReciente = document.querySelector("#tablaActividadReciente");
    const btnVerHistorial = document.querySelector("#btnVerHistorial");

    let porcentajeDocentes = 0;
    let porcentajeConWorkspace = 0;
    let porcentajePendienteWorkspace = 0;
    let usuariosPendientesWorkspace = 0;

    try {
        const resumenDashboard = await window.dijini.obtenerResumenDashboard();
        const actividadReciente = await window.dijini.obtenerActividadReciente();

        usuariosPendientesWorkspace = resumenDashboard.TotalUsuarios - resumenDashboard.TotalConWorkspace - resumenDashboard.TotalBajaWorkspace;

        if (actividadReciente.length === 0) {
            tablaActividadReciente.innerHTML = `
          <tr>
            <td colspan="4" class="empty-table">
                No se registraron cambios en los últimos 7 días.
            </td>
          </tr>`;

        }
        else {
            tablaActividadReciente.innerHTML = "";

            actividadReciente.forEach((registro) => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
            <td>${formatearFechaHora(registro.Fecha)}</td>
            <td>${registro.Tabla}</td>
            <td>${registro.Operacion}</td>
            <td>${registro.Descripcion}</td> `;

                tablaActividadReciente.appendChild(fila);
            });
        }


        if (resumenDashboard.TotalUsuarios > 0) {
            porcentajeDocentes = (resumenDashboard.TotalDocentes / resumenDashboard.TotalUsuarios) * 100;
            porcentajeConWorkspace = (resumenDashboard.TotalConWorkspace / resumenDashboard.TotalUsuarios) * 100;
            porcentajePendienteWorkspace =(usuariosPendientesWorkspace / resumenDashboard.TotalUsuarios) * 100;

        }
        graficoUsuarios.style.setProperty("--porcentaje-primary", `${porcentajeDocentes}%`);
        graficoWorkspace.style.setProperty("--porcentaje-primary", `${porcentajeConWorkspace}%`);
        graficoWorkspace.style.setProperty("--porcentaje-secondary",`${porcentajeConWorkspace + porcentajePendienteWorkspace}%`
);

        totalColegios.textContent = resumenDashboard.TotalColegios;
        totalUsuarios.textContent = resumenDashboard.TotalUsuarios;
        totalDocentes.textContent = resumenDashboard.TotalDocentes;
        totalEstudiantes.textContent = resumenDashboard.TotalEstudiantes;
        porcentajeWorkspace.textContent = `${Math.round(porcentajeConWorkspace)}%`;
        totalConWorkspace.textContent = resumenDashboard.TotalConWorkspace;
        totalPendienteWorkspace.textContent = usuariosPendientesWorkspace;
        totalBajaWorkspace.textContent = resumenDashboard.TotalBajaWorkspace;

    }
    catch (error) {
        console.error("Error al cargar el resumen del Dashboard:");
        console.error(error);
    }
    btnVerHistorial.addEventListener("click", () => {
        cargarVista("historial");
    });
}

window.inicializarDashboard = inicializarDashboard;