const sql = require("mssql/msnodesqlv8");
const { conectar } = require("./db");

/*===== OBTENER COLEGIOS =====*/

async function obtenerColegios() {
    const pool = await conectar();

    const resultado = await pool.request().query(`
        SELECT * 
        FROM colegios
        `);
    return resultado.recordset;
};



/*===== UPDATE COLEGIOS =====*/

async function actualizarColegio(colegio) {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .input("CUE_ID", colegio.CUE_ID)
        .input("Nombre", colegio.Nombre)
        .input("Localidad", colegio.Localidad)
        .input("Departamento", colegio.Departamento)
        .input("telefono", colegio.telefono)
        .input("CorreoAlternativo", colegio.CorreoAlternativo)
        .input("NumeroComputadoras", colegio.NumeroComputadoras)
        .query(`
            UPDATE colegios
            SET
                Nombre = @Nombre,
                Localidad = @Localidad,
                Departamento = @Departamento,
                telefono = @telefono,
                NumeroComputadoras = @NumeroComputadoras,
                CorreoAlternativo = @CorreoAlternativo
            WHERE CUE_ID = @CUE_ID
        `);

    return resultado.rowsAffected[0];
}


/*======== INSERT DE UN NUEVO COLEGIO ========*/

async function crearColegio(colegio) {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .input("CUE_ID", colegio.CUE_ID)
        .input("Nombre", colegio.Nombre)
        .input("Localidad", colegio.Localidad)
        .input("Departamento", colegio.Departamento)
        .input("telefono", colegio.telefono)
        .input("NumeroComputadoras", colegio.NumeroComputadoras)
        .input("CorreoAlternativo", colegio.CorreoAlternativo)
        .query(`
            INSERT INTO colegios (
                CUE_ID,
                Nombre,
                Localidad,
                Departamento,
                telefono,
                NumeroComputadoras,
                CorreoAlternativo
            )
            VALUES (
                @CUE_ID,
                @Nombre,
                @Localidad,
                @Departamento,
                @telefono,
                @NumeroComputadoras,
                @CorreoAlternativo
            )
        `);

    return resultado.rowsAffected[0];
}

/*==== PREGUNTA SI HAY usuarios o correos ASOCIADOS A ALGUN colegio=====*/
async function obtenerDependenciasColegio(cue) {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .input("CUE_ID", cue)
        .query(`
        SELECT(
            SELECT COUNT(*)
            FROM usuarios 
            WHERE CUE_ID = @CUE_ID

            ) AS UsuariosAsociados,
        (
            SELECT COUNT (*)
            FROM CorreosWorkspace
            WHERE CUE_ID = @CUE_ID

        ) AS CorreosAsociados
    `);

    return resultado.recordset[0];
}

async function eliminarColegio(cue) {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .input("CUE_ID", cue)
        .query(`
        DELETE FROM colegios 
        WHERE CUE_ID = @CUE_ID
    `);

    return resultado.rowsAffected[0];
}

/*======== USUARIOS =======*/

async function obtenerUsuarios() {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .query(`SELECT
        u.DNI_ID,
        u.Nombre,
        u.Apellido,
        u.CorreoAlternativo,
        u.TipoUsuario,
        u.CUE_ID,
        c.Nombre AS Colegio
        FROM usuarios u
        LEFT JOIN colegios c
        ON u.CUE_ID = c.CUE_ID
        ORDER BY u.Apellido ASC, u.Nombre ASC
    `);

    return resultado.recordset
}
async function crearUsuario(usuario) {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .input("DNI_ID", usuario.DNI_ID)
        .input("Nombre", usuario.Nombre)
        .input("Apellido", usuario.Apellido)
        .input("CorreoAlternativo", usuario.CorreoAlternativo)
        .input("CUE_ID", usuario.CUE_ID)
        .input("TipoUsuario", usuario.TipoUsuario)
        .query(`
        INSERT INTO usuarios (DNI_ID,
        Nombre, 
        Apellido, 
        CorreoAlternativo, 
        CUE_ID, 
        TipoUsuario
        )
        VALUES (
        @DNI_ID, 
        @Nombre,
        @Apellido,
        @CorreoAlternativo, 
        @CUE_ID, 
        @TipoUsuario
        )
    `);
    return resultado.rowsAffected[0];

}

async function actualizarUsuario(usuario) {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .input("DNI_ID", usuario.DNI_ID)
        .input("Nombre", usuario.Nombre)
        .input("Apellido", usuario.Apellido)
        .input("CorreoAlternativo", usuario.CorreoAlternativo)
        .input("CUE_ID", usuario.CUE_ID)
        .input("TipoUsuario", usuario.TipoUsuario)
        .query(`
    UPDATE usuarios
    SET
    Nombre = @Nombre,
    Apellido = @Apellido,
    CorreoAlternativo = @CorreoAlternativo,
    CUE_ID = @CUE_ID,
    TipoUsuario = @TipoUsuario
    WHERE DNI_ID = @DNI_ID
    `);
    return resultado.rowsAffected[0]
};

async function obtenerDependenciasUsuarios(dni) {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .input("DNI_ID", dni)
        .query(`
        SELECT COUNT(*) AS CorreosAsociados
        FROM CorreosWorkspace WHERE DNI_ID = @DNI_ID
        `);
    return resultado.recordset[0];
}

async function eliminarUsuario(dni) {
    const pool = await conectar();
    const transaccion = new sql.Transaction(pool);

    try {
        await transaccion.begin();

        const requestCorreo = new sql.Request(transaccion);

        await requestCorreo
            .input("DNI_ID", dni)
            .query(`
                DELETE FROM CorreosWorkspace
                WHERE DNI_ID = @DNI_ID
            `);

        const requestUsuario = new sql.Request(transaccion);

        const resultado = await requestUsuario
            .input("DNI_ID", dni)
            .query(`
                DELETE FROM usuarios
                WHERE DNI_ID = @DNI_ID
            `);

        await transaccion.commit();

        return resultado.rowsAffected[0];
    }
    catch (error) {
        await transaccion.rollback();
        throw error;
    }
}

/*======== WORKSPACE ======== */

async function obtenerCorreosWorkspace() {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .query(`
            SELECT
                cw.CorreoID,
                cw.DNI_ID,
                u.Nombre,
                u.Apellido,
                c.Nombre AS Colegio,
                u.TipoUsuario,
                cw.DireccionCorreo,
                cw.FechaAlta,
                cw.FechaBaja,
                cw.CUE_ID
            FROM CorreosWorkspace cw
            LEFT JOIN usuarios u
                ON cw.DNI_ID = u.DNI_ID
            LEFT JOIN colegios c
                ON c.CUE_ID = COALESCE(u.CUE_ID, cw.CUE_ID)
            ORDER BY u.Apellido ASC, u.Nombre ASC
        `);

    return resultado.recordset;
}

async function obtenerUsuariosDisponiblesWorkspace() {
    const pool = await conectar();

    const resultado = await pool.request()
        .query(`
        SELECT 
        u.DNI_ID,
        u.Nombre,
        u.Apellido FROM usuarios u
        WHERE NOT EXISTS( SELECT 1 FROM CorreosWorkspace cw WHERE cw.DNI_ID = u.DNI_ID) ORDER BY u.Apellido ASC, u.Nombre ASC
    `)
    return resultado.recordset
}

async function obtenerColegiosDisponiblesWorkspace() {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .query(`
            SELECT
                c.CUE_ID,
                c.Nombre
            FROM colegios c
            WHERE NOT EXISTS (
                SELECT 1
                FROM CorreosWorkspace cw
                WHERE cw.CUE_ID = c.CUE_ID
            )
            ORDER BY c.Nombre ASC
        `);

    return resultado.recordset;
}

async function enviarNuevoCorreoWorkspace(workspace) {
    const pool = await conectar();

    const resultado = await pool.request()
        .input("DireccionCorreo", workspace.DireccionCorreo)
        .input("FechaAlta", workspace.FechaAlta)
        .input("FechaBaja", workspace.FechaBaja)
        .input("CUE_ID", workspace.CUE_ID)
        .input("DNI_ID", workspace.DNI_ID)
        .query(`
        INSERT INTO CorreosWorkspace(DIreccionCorreo,FechaAlta,FechaBaja,CUE_ID,DNI_ID) VALUES
         (@DireccionCorreo, @FechaAlta, @FechaBaja, @CUE_ID, @DNI_ID)
        `);

    return resultado.rowsAffected[0];
};

async function actualizarCorreoWorkspace(workspace) {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .input("CorreoID", workspace.CorreoID)
        .input("DireccionCorreo", workspace.DireccionCorreo)
        .input("FechaAlta", workspace.FechaAlta)
        .input("FechaBaja", workspace.FechaBaja)
        .query(`UPDATE CorreosWorkspace 
        SET
            DireccionCorreo=@DireccionCorreo,
            FechaAlta =@FechaAlta,
            FechaBaja = @FechaBaja
        wHERE CorreoID = @CorreoID
    `)
    return resultado.rowsAffected[0];
};

async function eliminarCorreoWorkspace(correoId) {
    const pool = await conectar();
    const resultado = await pool
        .request()
        .input("CorreoID", correoId)
        .query(`
            DELETE FROM CorreosWorkspace
            WHERE CorreoID = @CorreoID
        `);
    return resultado.rowsAffected[0];
}
/*======== HISTORIAL BD ======== */

async function obtenerHistorial() {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .query(`
        SELECT 
            HistorialID,
            Fecha,
            Tabla,
            Operacion,
            Descripcion
        FROM HistorialBD 
        ORDER BY Fecha DESC
    `);

    return resultado.recordset;

}

/*======== ESTADO: CONECTADO/DESCONECTADO ======== */


async function obtenerEstadoBaseDatos() {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .query(`
            SELECT
                DB_NAME() AS BaseDatos,
                SERVERPROPERTY('ProductMajorVersion') AS VersionMotor
        `);

    return resultado.recordset[0];
}

/*======== DASHBOARD ======== */

async function obtenerResumenDashboard() {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .query(`
            SELECT
        (SELECT COUNT(*) FROM colegios) AS TotalColegios,
        (SELECT COUNT(*) FROM usuarios) AS TotalUsuarios,
        (SELECT COUNT(*) FROM usuarios
            WHERE TipoUsuario = 'Docente') AS TotalDocentes,
        (SELECT COUNT(*) FROM usuarios
            WHERE TipoUsuario = 'Estudiante') AS TotalEstudiantes,
        (SELECT COUNT(DISTINCT DNI_ID)
            FROM CorreosWorkspace
            WHERE DNI_ID IS NOT NULL
            AND FechaBaja IS NULL) AS TotalConWorkspace,
        (SELECT COUNT(DISTINCT DNI_ID)
            FROM CorreosWorkspace
            WHERE DNI_ID IS NOT NULL
            AND FechaBaja IS NOT NULL) AS TotalBajaWorkspace
        `);

    return resultado.recordset[0];
}

async function obtenerActividadReciente() {
    const pool = await conectar();

    const resultado = await pool
        .request()
        .query(`
           SELECT TOP 5
                Fecha,
                Tabla,
                Operacion,
                Descripcion
            FROM HistorialBD
            WHERE Fecha >= DATEADD(DAY, -7, GETDATE())
            ORDER BY Fecha DESC, HistorialID DESC
        `);

    return resultado.recordset;
}

async function buscarGlobal(texto) {
    const pool = await conectar();

    const resultado = await pool.request()
        .input("TextoBusqueda", `%${texto}%`)
        .query(`
        SELECT TOP 5
            CUE_ID,
            Nombre,
            Localidad,
            Departamento
        FROM colegios
        WHERE Nombre Like @TextoBusqueda
        OR Localidad LIKE @TextoBusqueda
        OR Departamento LIKE @TextoBusqueda
        OR CAST(CUE_ID AS VARCHAR(20)) LIKE @Textobusqueda
        ORDER BY Nombre ASC

    SELECT TOP 5
        DNI_ID,
        Nombre,
        Apellido,
        CorreoAlternativo,
        TipoUsuario
    FROM usuarios
    WHERE Nombre LIKE @TextoBusqueda
    OR Apellido LIKE @TextoBusqueda
    OR CorreoAlternativo LIKE @TextoBusqueda
    OR CAST(DNI_ID AS VARCHAR(20)) LIKE @TextoBusqueda
    ORDER BY Apellido ASC, Nombre ASC;

    SELECT TOP 5
        cw.CorreoID,
        cw.DireccionCorreo,
        cw.FechaBaja,
        u.DNI_ID,
        u.Nombre,
        u.Apellido
    FROM CorreosWorkspace cw
    LEFT JOIN usuarios u
    ON cw.DNI_ID = u.DNI_ID
    WHERE cw.DireccionCorreo LIKE @TextoBusqueda
    OR u.Nombre LIKE @TextoBusqueda
    OR u.Apellido LIKE @TextoBusqueda
    ORDER BY u.Apellido ASC, u.Nombre ASC;
    `);

    return {
        colegios: resultado.recordsets[0],
        usuarios: resultado.recordsets[1],
        workspace: resultado.recordsets[2]
    };
}

module.exports = {
    obtenerColegios,
    actualizarColegio,
    crearColegio,
    obtenerDependenciasColegio,
    eliminarColegio,
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    obtenerDependenciasUsuarios,
    eliminarUsuario,
    obtenerCorreosWorkspace,
    obtenerColegiosDisponiblesWorkspace,
    obtenerUsuariosDisponiblesWorkspace,
    enviarNuevoCorreoWorkspace,
    actualizarCorreoWorkspace,
    eliminarCorreoWorkspace,
    obtenerHistorial,
    obtenerEstadoBaseDatos,
    obtenerResumenDashboard,
    obtenerActividadReciente,
    buscarGlobal
};