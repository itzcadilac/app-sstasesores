# Seguridad de Datos (Google Play)

Resumen basado en el código y tipos definidos.

## Datos recopilados
- Información personal: nombre, apellidos, documento (DNI/CE/Pasaporte), empresa, cargo (opcional).
- Información de contacto: email, teléfono (opcional).
- Identificadores de cuenta: RUC (empresa), username (instructor), token de sesión.
- Actividad en la app: solicitudes de capacitación (tipo, modalidad, número de participantes, fechas, observaciones), cursos, estado (completado/en proceso/cancelado), horas, notas.
- Archivos/URLs: certificadoUrl para descarga de certificados.

## Finalidades
- Funcionalidad de la app y prestación del servicio.
- Autenticación y gestión de cuentas.
- Soporte al usuario y comunicación.
- Cumplimiento regulatorio en capacitación SST.

## Compartir datos
- No se comparten con terceros con fines de marketing.
- Se pueden procesar por proveedores de infraestructura/servicios estrictamente necesarios (hosting/API), bajo contrato.

## Prácticas de seguridad
- Cifrado en tránsito: Sí (HTTPS al dominio software.sstasesores.pe).
- Eliminación: El usuario puede solicitar eliminación/rectificación vía soporte.
- Control de acceso: roles (empresa, personal, instructor).

## Datos no recopilados
- Ubicación precisa/aproximada, contactos del dispositivo, salud, financieros, fotos y videos del dispositivo, sensor, y navegación web del usuario.

## Configuración en Play Console (sugerencia)
- Datos recopilados: Información personal, Contacto, Identificadores, Actividad en app.
- Datos compartidos: No (salvo proveedores necesarios, no como “compartir con terceros” de Play).
- Propósitos: Prestación del servicio, autenticación, seguridad, soporte.
- Opcionalidad: teléfono, cargo, observaciones son opcionales.

Revisar y confirmar con el equipo legal/compliance antes de enviar.