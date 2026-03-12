# CAM Dashboard — Instrucciones de instalación

## Requisitos
- Node.js 18 o superior (descargar en https://nodejs.org)
- Cuenta en Vercel (https://vercel.com) para deploy

---

## 1. Instalar y correr localmente

Abre una terminal en la carpeta `cam-dashboard` y ejecuta:

```bash
npm install
npm run dev
```

Luego abre el browser en http://localhost:3000

La contraseña por defecto es: **cam2026**
(Puedes cambiarla en el archivo `.env.local`, propiedad `APP_PASSWORD`)

---

## 2. Agregar iconos de la app

Para que la app se vea bien al instalarla en el celular, coloca dos imágenes en:
- `public/icons/icon-192.png` — 192×192 px
- `public/icons/icon-512.png` — 512×512 px

Puedes usar el logo de Regalos y Piñatas o cualquier imagen cuadrada.

---

## 3. Deploy en Vercel (para acceder desde cualquier dispositivo)

1. Sube el código a GitHub (sin `.env.local`)
2. Ve a https://vercel.com → New Project → importa tu repo
3. En "Environment Variables" agrega:
   - `NOTION_API_KEY` = tu API key de Notion
   - `NOTION_DB_CIERRE_ID` = ID de BD Cierre
   - `NOTION_DB_BANCARIO_ID` = ID de BD Bancario
   - `APP_PASSWORD` = la contraseña que elijas
4. Click en Deploy

---

## 4. Instalar como app en el celular

### Android (Chrome):
1. Abre la URL de tu app en Chrome
2. Menú (⋮) → "Agregar a pantalla de inicio"
3. La app aparecerá como ícono nativo

### iPhone (Safari):
1. Abre la URL en Safari
2. Botón compartir (cuadrado con flecha) → "Agregar a pantalla de inicio"

---

## Estructura de archivos importantes

- `.env.local` → credenciales (NO subir a GitHub)
- `lib/notion.ts` → conexión con Notion API
- `components/CierreForm.tsx` → formulario de cierre tienda
- `components/BancarioForm.tsx` → formulario bancario

---

## Notas sobre los nombres de propiedades en Notion

Si al guardar recibes un error de Notion, verifica que los nombres exactos de las propiedades en tu BD coincidan con los del archivo `lib/notion.ts`.

Por ejemplo, si tu propiedad se llama "Com. BAC" en Notion pero en el código dice "Com BAC", habrá un error. Ajusta `lib/notion.ts` según los nombres exactos de tus propiedades.
