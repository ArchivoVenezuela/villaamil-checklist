# Villaamil Checklist

PWA para gestionar las checklists de apertura y cierre del piso de C/ Villaamil, Madrid.

## Stack

- React 19 + TypeScript (strict)
- Vite 6 + TailwindCSS v4
- React Router v7 (HashRouter — compatible con Vercel static)
- vite-plugin-pwa (Workbox)
- LocalStorage para persistencia

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

Push a GitHub y conectar el repo en Vercel. No se necesita ninguna configuración especial — es un sitio estático.

## Datos

Todo se guarda en LocalStorage con el prefijo `villaamil-v2-`. No se envía nada a ningún servidor.
