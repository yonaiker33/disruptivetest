Comando de instalacion: npm install

---------------------------------------------------------------------------------------------------------

API Documentación

Usuarios

Registro de Usuarios
URL: /api/users/register
Método: POST
Descripción: Permite a los usuarios registrarse en el sistema.
Cuerpo de la solicitud:
username (String): Nombre de usuario único.
email (String): Dirección de correo electrónico del usuario.
password (String): Contraseña del usuario.
Otros campos de usuario según sea necesario.
Respuestas:
Código 201: Registro exitoso. Devuelve detalles del usuario registrado.
Código 400: Error en la solicitud. Devuelve detalles del error.

Inicio de Sesión
URL: /api/users/login
Método: POST
Descripción: Permite a los usuarios iniciar sesión en el sistema.
Cuerpo de la solicitud:
email (String): Dirección de correo electrónico registrada.
password (String): Contraseña del usuario.
Respuestas:
Código 200: Inicio de sesión exitoso. Devuelve detalles del usuario y token de autenticación.
Código 400: Credenciales de inicio de sesión no válidas. Devuelve un mensaje de error.

Obtener todos los Usuarios
URL: /api/users
Método: GET
Descripción: Obtiene todos los usuarios registrados en el sistema.
Respuesta: Lista de usuarios.

-------------------------------------------------------------------------------------------------
Categorías

Obtener todas las Categorías
URL: /api/categories
Método: GET
Descripción: Obtiene todas las categorías disponibles en el sistema.
Respuesta: Lista de categorías.

Crear Categoría
URL: /api/categories
Método: POST
Descripción: Crea una nueva categoría.
Cuerpo de la solicitud:
name (String): Nombre de la categoría.
permissions (Array): Permisos asociados a la categoría.
Respuestas:
Código 201: Categoría creada exitosamente. Devuelve detalles de la categoría creada.
Código 400: Error en la solicitud. Devuelve detalles del error.

Actualizar Categoría
URL: /api/categories/:id
Método: PUT
Descripción: Actualiza una categoría existente.
Parámetros de la URL:
id (String): ID único de la categoría a actualizar.
Cuerpo de la solicitud:
name (String): Nuevo nombre de la categoría.
Respuestas:
Código 200: Categoría actualizada exitosamente. Devuelve detalles de la categoría actualizada.
Código 400: Error en la solicitud. Devuelve detalles del error.

Eliminar Categoría
URL: /api/categories/:id
Método: DELETE
Descripción: Elimina una categoría existente.
Parámetros de la URL:
id (String): ID único de la categoría a eliminar.
Respuestas:
Código 200: Categoría eliminada exitosamente.
Código 400: Error en la solicitud. Devuelve detalles del error.

------------------------------------------------------------------------------------------------------------------

Temáticas

Obtener todas las Temáticas
URL: /api/themes
Método: GET
Descripción: Obtiene todas las temáticas disponibles en el sistema.
Respuesta: Lista de temáticas.

Crear Temática
URL: /api/themes
Método: POST
Descripción: Crea una nueva temática.
Cuerpo de la solicitud:
name (String): Nombre de la temática.
permissions (Array): Permisos asociados a la temática.
Respuestas:
Código 201: Temática creada exitosamente. Devuelve detalles de la temática creada.
Código 400: Error en la solicitud. Devuelve detalles del error.

Actualizar Temática
URL: /api/themes/:id
Método: PUT
Descripción: Actualiza una temática existente.
Parámetros de la URL:
id (String): ID único de la temática a actualizar.
Cuerpo de la solicitud:
name (String): Nuevo nombre de la temática.
permissions (Array): Nuevos permisos asociados a la temática.
Respuestas:
Código 200: Temática actualizada exitosamente. Devuelve detalles de la temática actualizada.
Código 400: Error en la solicitud. Devuelve detalles del error.

Eliminar Temática
URL: /api/themes/:id
Método: DELETE
Descripción: Elimina una temática existente.
Parámetros de la URL:
id (String): ID único de la temática a eliminar.
Respuestas:
Código 200: Temática eliminada exitosamente.
Código 400: Error en la solicitud. Devuelve detalles del error.

-----------------------------------------------------------------------------------------------------------------------

Contenidos

Obtener todos los Contenidos
URL: /api/contents
Método: GET
Descripción: Obtiene todos los contenidos disponibles en el sistema.
Respuesta: Lista de contenidos agrupados por temática.

Obtener Contenidos por Temática
URL: /api/contents/themes
Método: GET
Descripción: Obtiene los contenidos según la temática especificada.
Parámetros de la solicitud:
q (String, opcional): Consulta para filtrar los contenidos por temática.
Respuesta: Lista de contenidos agrupados por temática.

Obtener Contenidos por Rol
URL: /api/contents/library
Método: GET
Descripción: Obtiene los contenidos según el rol del usuario.
Parámetros de la solicitud:
q (String, opcional): Consulta para filtrar los contenidos por rol (e.g., "prospect").
Respuesta: Lista de contenidos agrupados por temática según el rol del usuario.

Crear Contenido
URL: /api/contents
Método: POST
Descripción: Crea un nuevo contenido.
Cuerpo de la solicitud:
type (String): Tipo de contenido.
title (String): Título del contenido.
description (String): Descripción del contenido.
url (String): URL del contenido (opcional).
theme (String): Temática asociada al contenido.
username (String): Nombre de usuario asociado al contenido.
file (File, opcional): Archivo adjunto (en caso de ser necesario).
Respuestas:
Código 200: Contenido creado exitosamente. Devuelve detalles del contenido creado.
Código 400: Error en la solicitud. Devuelve detalles del error.

Actualizar Contenido
URL: /api/contents/:id
Método: PUT
Descripción: Actualiza un contenido existente.
Parámetros de la URL:
id (String): ID único del contenido a actualizar.
Cuerpo de la solicitud:
Detalles del contenido a actualizar.
Respuestas:
Código 200: Contenido actualizado exitosamente. Devuelve detalles del contenido actualizado.
Código 400: Error en la solicitud. Devuelve detalles del error.

Eliminar Contenido
URL: /api/contents/:id
Método: DELETE
Descripción: Elimina un contenido existente.
Parámetros de la URL:
id (String): ID único del contenido a eliminar.
Respuestas:
Código 200: Contenido eliminado exitosamente.
Código 400: Error en la solicitud. Devuelve detalles del error.