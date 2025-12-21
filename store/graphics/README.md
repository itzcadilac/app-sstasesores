# Gráficos de Play Store

Este directorio contendrá los recursos gráficos para la ficha de la Play Store.

Archivos generados por el script:
- icon_512.png — Ícono de alta resolución (512×512).
- feature_graphic_1024x500.png — Gráfico destacado (1024×500).

Cómo generar:
```powershell
Push-Location "d:\Apps\app-sstasesores"
npm i -D sharp
node scripts/prepare-store-assets.mjs
Pop-Location
```

Capturas de pantalla (tomarlas manualmente):
- 5 a 8 imágenes de la app en Android (1080×1920 o superior):
  - Inicio/login
  - Consulta de capacitaciones
  - Detalle y certificado
  - Solicitud de capacitación
  - Perfil
