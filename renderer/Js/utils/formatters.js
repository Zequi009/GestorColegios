
/*===== 
SI en SQL el resultado es NULL lo reemplaza 
=====*/
function mostrarDato(valor) {
    return valor ?? "---";
}


/*=========
FUNCION PARA CAPITALIZAR EL TEXTO
 ========*/
function capitalizarTexto(texto) {
    return texto
        .trim()
        .toLowerCase()
        .split(" ")
        .map((palabra) => {
            if (palabra === "") {
                return "";
            }

            return palabra.charAt(0).toUpperCase() + palabra.slice(1);
        })
        .join(" ");
}


/*=========
FUNCION PARA cambiar el formato de La fecha
 ========*/

function formatearFecha(fecha) {
    if (!fecha) {
        return "---";
    }

    const fechaObjeto = new Date(fecha);

    return fechaObjeto.toLocaleDateString("es-AR", {
        timeZone: "UTC"
    });
}

function formatearInputFecha(fecha){
    if (!fecha){
        return "";
    }
    const fechaObjeto = new Date (fecha);
    return fechaObjeto.toISOString().split("T")[0];
}

function formatearFechaHora(fecha) {
    if (!fecha) {
        return "---";
    }

    const fechaObjeto = new Date(fecha);

    return fechaObjeto.toLocaleString("es-AR");
}