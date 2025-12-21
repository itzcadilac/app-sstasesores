# Checklist de Publicación en Google Play

## Artefacto
- AAB firmado: android/app/build/outputs/bundle/release/app-release.aab
- VersionName: 1.0.0
- VersionCode: 1

## Ficha de Play Store
- Título (es-ES): TrainingSoft
- Descripción corta: Consulta capacitaciones, solicita cursos y gestiona tu perfil SST.
- Descripción larga: ver store/metadata/es-ES/full_description.txt
- Categoría: Educación (Apps)
- Público objetivo: Adultos y profesionales (18+)
- Contiene anuncios: No
- Compras en la app: No

## Contacto
 Correo de soporte: soporte@sstasesores.pe
 Sitio web: https://sstasesores.pe
 Política de privacidad (URL pública): https://software.sstasesores.pe/politica-privacidad

## Política de Privacidad
- Borrador en PRIVACIDAD.md (subir a web y publicar URL)

## Seguridad de Datos (Data Safety)
- Borrador en PLAY_CONSOLE_DATA_SAFETY.md
- Cifrado en tránsito: Sí (HTTPS)
- Eliminación de datos a solicitud: Sí (contacto soporte)

## Clasificación de contenido
- Completar cuestionario IARC (no contiene violencia explícita ni contenido sexual)

## Capturas de pantalla (móviles)
- Mínimo 5: Inicio/login, Consulta de capacitaciones, Detalle y certificado, Solicitud de capacitación, Perfil
- Resolución sugerida: 1080×1920 o superior

## Pasos
1. Subir AAB a Play Console (Producción > Crear versión).
2. Completar Ficha de Tienda (español) con los textos.
3. Completar Data Safety con el mapeo propuesto.
4. Adjuntar política de privacidad (URL pública).
5. Completar contacto y cuestionario de clasificación.
6. Revisar países de distribución y dispositivos.
7. Enviar a revisión.

## Comandos útiles (Windows)
```powershell
Push-Location "d:\Apps\app-sstasesores\android"; .\gradlew.bat bundleRelease --warning-mode=all; Pop-Location
```

Si necesitas firma con keystore propio, editar android/gradle.properties con:
```
MYAPP_UPLOAD_STORE_FILE=RUTA\mi-keystore.jks
MYAPP_UPLOAD_KEY_ALIAS=alias
MYAPP_UPLOAD_STORE_PASSWORD=***
MYAPP_UPLOAD_KEY_PASSWORD=***
```