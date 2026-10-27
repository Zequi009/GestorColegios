# Changelog

## v0.9.0 - La primera vista cobra vida
- Se crea el controlador de colegios y se separa la lógica de la vista de la lógica principal.
- El router pasa a inicializar cada vista al cargar el HTML.
- Se implementa renderizado dinámico de colegios desde SQL Server.
- Se agrega la visualización de `---` para valores `NULL` y se mejora la legibilidad de la interfaz.
- Se incorpora búsqueda local en tiempo real por CUE, nombre, localidad y correo.
- Se evita consultas repetidas usando `colegiosCargados` en memoria.
- Se añade la columna de correo electrónico y se preparan las acciones Editar y Eliminar por registro.

## v0.10.0 - Edición y validación de colegios
- Se refactoriza el renderizado con `crearFilaColegio()` y `renderizarColegios()`.
- El botón Editar recupera el colegio mediante su CUE y carga los datos en el panel lateral.
- Se incorpora el panel de edición para cambiar los datos del colegio.
- Se captura y normaliza la información del formulario antes de preparar la actualización.
- Se implementa capitalización de textos y normalización del correo electrónico.
- Se crea la base de validaciones para CUE, nombre, teléfono y correo.
- Se centralizan utilidades compartidas en `validators.js` y `formatters.js`.
- La vista queda preparada para la lógica real de UPDATE sobre SQL Server.

## v0.11.0 - UPDATE real y sistema de notificaciones
- Se separa la conexión a SQL Server de las consultas propias de la base de datos.
- Se completa el flujo real de edición de colegios desde la interfaz hasta SQL Server.
- Se incorpora un sistema reutilizable de notificaciones para reemplazar `alert()`.
- La interfaz refleja los cambios tras ejecutar el `UPDATE` sin necesidad de recargar manualmente.

## v0.12.0 - CREATE de colegios y ampliación del formulario
- Se reutiliza el panel lateral tanto para crear como para editar colegios.
- Se incorpora el campo `NumeroComputadoras` al modelo visible del colegio.
- Se mejora el tratamiento de valores `NULL` para la edición y la visualización.
- Se protege el CUE una vez creado el colegio para evitar cambios accidentales.
- Se agrega una validación para impedir CUE duplicados antes de ejecutar el `INSERT`.
- Se implementa la creación real de nuevos colegios en SQL Server.

## v0.13.0 - DELETE de colegios y confirmación de acciones
- Se implementa un modal de confirmación reutilizable para acciones sensibles.
- Se comprueba si existen relaciones asociadas antes de eliminar un colegio.
- Se incorpora la eliminación real de colegios desde la aplicación.
- Se bloquea la eliminación si hay usuarios o correos Workspace vinculados al CUE.
- Se centraliza la lógica de confirmación antes de ejecutar operaciones destructivas.

## v0.14.0 - Inicio de la gestión de Usuarios
- Se inicia el módulo de Usuarios reutilizando la arquitectura de Colegios.
- Se implementa la consulta de usuarios desde SQL Server y la relación con los colegios.
- Se agrega renderizado dinámico y búsqueda local de usuarios.
- Se comienza la preparación de la vista de Usuarios como módulo de gestión.
- Se realiza una renovación visual de la aplicación con una nueva paleta de grises.

## v0.15.0 - CRUD completo de Usuarios
- Se reutiliza el mismo panel para crear y editar usuarios.
- Se implementa la creación de usuarios con validaciones personalizadas.
- Se controla la duplicidad de DNI antes de crear un nuevo usuario.
- Se permite editar usuarios existentes y se protege el DNI durante la modificación.
- Se consulta la existencia de correos Workspace asociados antes de eliminar un usuario.
- Se reutiliza el sistema de confirmación para acciones de eliminación.
- Se implementa la eliminación de usuarios con transacción SQL para asegurar integridad.
- La interfaz vuelve a consultar la base de datos y renderiza el estado actualizado.

## v0.16.0 - CRUD completo de Workspace
- Se implementa la consulta real de correos Workspace con información combinada de usuarios y colegios.
- Se resuelven asociaciones con `COALESCE()` para mostrar correctamente el colegio relacionado.
- Se agrega formateo de fechas y compatibilidad con campos `type="date"`.
- Se reutiliza el formulario para crear y editar correos Workspace.
- Se implementan validaciones de entidad, correo, fechas y regla de negocio de una sola asociación por entidad.
- Se evita que un usuario o colegio tenga más de un correo Workspace asociado desde Dijini.
- Se incorpora la edición y eliminación real de correos Workspace con confirmación.
- Se actualiza la interfaz automáticamente tras cada operación.
- Se agrega búsqueda local sobre registros ya cargados.

## v0.17.0 - Historial de cambios
- Se crea la vista de Historial para consultar los cambios registrados en `HistorialBD`.
- Se incorpora la consulta `obtenerHistorial()` para leer `Fecha`, `Tabla`, `Operacion` y `Descripcion`.
- Se mueve la navegación de Historial a la sección de Configuración dentro del flujo conceptual de la aplicación.
- Se ordenan los registros por fecha descendente para priorizar los cambios más recientes.
- Se deja la vista como herramienta de auditoría y consulta, sin operaciones de alta, edición o borrado.

## v0.18.0 - Configuración y estado de la base de datos

- Se agrega una sección de Configuración, accesible desde el botón de engranaje del encabezado.
- Se crea una vista de Configuración con tarjetas para acceder a herramientas administrativas.
- Se integra Historial como una herramienta dentro de Configuración.
- Se incorpora una vista de Base de datos que comprueba el estado de la conexión con SQL Server.
- Se muestran los estados de conexión (comprobando, conectado y sin conexión), junto con el nombre de la base de datos y la versión principal de SQL Server.
- Se reemplaza el indicador estático del sidebar por un estado dinámico que se mantiene sincronizado con la vista de Base de datos.
- Se agrega una opción para volver a comprobar manualmente la conexión cuando no está disponible.
- Se administra y reutiliza el pool de conexiones; si falla la conexión, se restablece para permitir nuevos intentos.
- Se limita a 3 segundos la espera de Dijini para informar que SQL Server no está disponible y actualizar rápidamente la interfaz.
- Se evita mostrar datos detallados o sensibles del servidor.

## v0.19.0 - Dashboard y resumen de actividad

- Se transforma el Dashboard en una vista de resumen general del sistema.
- Se muestran los totales de colegios, usuarios, docentes y estudiantes.
- Se agregan gráficos para visualizar la composición de usuarios y la cobertura de cuentas Workspace.
- Se incorpora una tabla de actividad reciente con los últimos cambios registrados durante los últimos 7 días.
- Se agrega un acceso directo al Historial desde la actividad reciente.
- Se implementan consultas específicas para obtener las estadísticas y la actividad desde SQL Server, integradas mediante IPC siguiendo la arquitectura de Dijini.

## v0.20.0 - Ajustes finales de navegación

- Se incorpora el botón de Configuración al indicador visual de la sección seleccionada.
- Al abrir Configuración, Historial o Base de datos, el botón de Configuración permanece marcado como activo.
- Al volver a una opción del sidebar, se desmarca Configuración y se resalta la vista seleccionada.
- Se agrega un estilo activo para el botón del header, diferenciándolo del efecto momentáneo de `hover`.
- Se centraliza en el router la actualización del estado activo de la navegación, sin acoplar los Controllers al menú principal.
- Se actualizan las rutas de vistas y controladores para que coincidan con las mayúsculas y minúsculas reales de los archivos.
- Se reorganiza el encabezado y se incorpora la identidad visual de Dijini en el sidebar, con ajustes para pantallas estrechas.
- Se desactivan las herramientas de desarrollo de Electron al iniciar la aplicación.
- Se configura la generación de un instalador para Windows (NSIS) con el nombre, identificador e icono de Dijini.
- Se agrega el comando `npm run build` para empaquetar la aplicación y se excluye la carpeta `dist` del control de versiones.
- Se incorpora la imagen de marca de Dijini al README del proyecto.

## v0.20.1 - Corrección de cuentas Workspace dadas de baja

- Se corrige el resumen de Workspace del Dashboard para contabilizar por separado las cuentas activas, pendientes y dadas de baja.
- Las cuentas dadas de baja dejan de contarse como cuentas activas.
- Se agrega al gráfico y a su leyenda la cantidad de cuentas dadas de baja.
- Se ajusta el cálculo de cuentas pendientes para excluir tanto las cuentas activas como las dadas de baja.


## v1.0.0 - Primera versión estable de Dijini

- Se completa la gestión de colegios, usuarios y cuentas CERI (Workspace), con operaciones de alta, consulta, edición y eliminación.
- Se incorpora la búsqueda global de colegios, usuarios y cuentas CERI; al seleccionar un resultado, se abre el módulo correspondiente y se muestra el registro encontrado.
- El Dashboard reúne estadísticas generales, actividad reciente y el estado de las cuentas CERI: activas, pendientes y dadas de baja.
- Configuración centraliza el Historial y las herramientas para consultar y recuperar la conexión con SQL Server.
- Se unifican la navegación y la identidad visual de la aplicación, con un encabezado adaptable a pantallas estrechas.
- Se prepara la generación de un instalador de Windows para distribuir Dijini.

## v1.0.1 - Correccion de error en triggers.sql

- Se corrige el error que hacie que el texto en el historial apareciera todo junto.
- Se agrega un archivo con el UPDATE hecho a triggers.sql
