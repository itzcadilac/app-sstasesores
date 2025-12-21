# Fuente de imágenes promocionales

Coloca aquí la imagen que quieres incluir (por ejemplo `sst-banner.png`).

Para generar los formatos de Play:
```powershell
Push-Location "d:\Apps\app-sstasesores"
node scripts/prepare-promo-image.mjs store/graphics/source/sst-banner.png
Pop-Location
```
Esto producirá:
- `store/graphics/promo_feature_1024x500.png` (gráfico destacado)
- `store/graphics/promo_phone_1080x1920.png` (captura/promocional en portrait)

Notas:
- Play prefiere capturas in‑app para teléfonos; usa la imagen promocional como extra (no principal) o en la ficha web.
- Si necesitas otro tamaño, te adapto el script.