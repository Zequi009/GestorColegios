const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        "Driver={ODBC Driver 18 for SQL Server};" +
        "Server=localhost\\SQLEXPRESS;" +
        "Database=CERI_LOG;" +
        "Trusted_Connection=Yes;" +
        "Encrypt=Yes;" +
        "TrustServerCertificate=Yes;"
};

let pool = null;

function crearTimeout(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Tiempo de conexión agotado."));
        }, ms);
    });
}


/*===== ESTABLECER CONECCION =====*/
// async function conectar() {
//     const pool = await sql.connect(config);

//     return pool;
// }

async function conectar() {
    if (pool && pool.connected) {
        return pool;
    }

    pool = new sql.ConnectionPool(config);

    try {
        await Promise.race([
            pool.connect(),
            crearTimeout(5000)
        ]);

        return pool;
    }
    catch (error) {
        pool = null;

        throw error;
    }
}

module.exports = {
    conectar
};

