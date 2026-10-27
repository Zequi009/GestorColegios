function mostrarNotificacion(mensaje, tipo = "exito") {
    const notificacion = document.createElement("div");

    notificacion.classList.add("toast");
    notificacion.classList.add(`toast-${tipo}`);

    notificacion.textContent = mensaje;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.classList.add("toast-visible");
    }, 10);

    setTimeout(() => {
        notificacion.classList.remove("toast-visible");

        setTimeout(() => {
            notificacion.remove();
        }, 300);

    }, 3000);
}