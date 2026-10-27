/*======== FUNCION PARA VALIDAR EL CORREO ======== */

function validarCorreo(correo) {
    const regex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    return regex.test(correo);
}

/*======== FUNCION PARA VALIDAR EL CUE ======== */

function validarCUE(cue) {

    const regex = /^[0-9]+$/;

    if (cue === "") {
        return false;
    }

    return regex.test(cue);

};

/*======== FUNCION PARA VALIDAR EL Nombre ======== */

function validarNombre(nombre) {
    return nombre.trim() !== "";
}

/*======== FUNCION PARA VALIDAR EL telefono ======== */

function validarTelefono(telefono) {

    if (telefono === "") {
        return true;
    };

    const regex = /^[0-9]+$/;

    return regex.test(telefono);

}
/*======== FUNCION PARA VALIDAR EL NUMERO DE COMPUTADORAS ======== */


function validarNumeroComputadoras(numeroComputadoras) {
    if (numeroComputadoras === "") {
        return true;
    };

    const regex = /^[0-9]+$/;

    return regex.test(numeroComputadoras);
};

/*======== FUNCION PARA VALIDAR EL DNI ======== */


function validarDNI(dni) {
    if (dni === "") {
        return false;
    }

    const regex = /^[0-9]+$/;
    return regex.test(dni);

}

/*======== FUNCION PARA VALIDAR EL TIPO DE USUARIO ======== */

function validarTipoUsuario(tipoUsuario) {
    if (tipoUsuario === "ESTUDIANTE" || tipoUsuario === "DOCENTE") {
        return true;
    }
    return false;
}
