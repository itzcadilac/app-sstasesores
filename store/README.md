# Publicación en Google Play — TrainingSoft

Este repositorio incluye textos y borradores para la ficha de Play Store y cumplimiento de Data Safety.

## Estructura
- store/metadata/es-ES/title.txt
- store/metadata/es-ES/short_description.txt
- store/metadata/es-ES/full_description.txt
- PRIVACIDAD.md (subir a una URL pública)
- PLAY_CONSOLE_DATA_SAFETY.md
- PLAY_CONSOLE_CHECKLIST.md

## Pasos rápidos
1. Generar AAB:
   ```powershell
   Push-Location "d:\Apps\app-sstasesores\android"; .\gradlew.bat bundleRelease --warning-mode=all; Pop-Location
   ```
2. Subir `android/app/build/outputs/bundle/release/app-release.aab` a Play Console.
3. Completar ficha de tienda usando los archivos en `store/metadata/es-ES/`.
4. Publicar `PRIVACIDAD.md` en `https://software.sstasesores.pe/politica-privacidad` (u otra URL oficial) y pegar el enlace en Play Console.
5. Completar Data Safety guiándose por `PLAY_CONSOLE_DATA_SAFETY.md`.
6. Añadir contacto: correo y sitio.
7. Completar cuestionario de clasificación de contenido.

## Firma del AAB
- Si usas keystore propio, rellena `android/gradle.properties` con:
  ```
  MYAPP_UPLOAD_STORE_FILE=RUTA\mi-keystore.jks
  MYAPP_UPLOAD_KEY_ALIAS=alias
  MYAPP_UPLOAD_STORE_PASSWORD=***
  MYAPP_UPLOAD_KEY_PASSWORD=***
  ```
- Vuelve a ejecutar `bundleRelease`.

## Capturas sugeridas
- Login
- Consulta de capacitaciones
- Detalle y certificado
- Solicitud de capacitación
- Perfil

Cualquier dato marcado como “confirmar/actualizar” debe validarse antes del envío.