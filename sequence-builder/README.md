# Sequence Builder — Humanfunnel

App para generar secuencias outbound B2B personalizadas con IA.

## Estructura

```
sequence-builder/
├── api/
│   └── generate.js      # Proxy serverless a la API de Anthropic
├── public/
│   └── index.html       # Frontend completo
├── vercel.json          # Configuración de despliegue
├── package.json
└── README.md
```

## Despliegue en Vercel (5 minutos)

### 1. Instala Vercel CLI
```bash
npm install -g vercel
```

### 2. Sube el proyecto a GitHub
Crea un repo en github.com y sube esta carpeta.

### 3. Conecta con Vercel
- Ve a vercel.com → "Add New Project"
- Importa tu repo de GitHub
- Framework Preset: **Other**
- Click en Deploy

### 4. Añade la API key de Anthropic
- En Vercel → tu proyecto → Settings → Environment Variables
- Añade: `ANTHROPIC_API_KEY` = tu API key (empieza por `sk-ant-...`)
- Redeploy

### 5. Listo
Tu app estará en `https://tu-proyecto.vercel.app`

## Desarrollo local

```bash
npm install
npx vercel dev
```
Necesitas un archivo `.env` con:
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Notas
- La API key nunca se expone al frontend — pasa por el serverless function `/api/generate`
- Las buenas prácticas Apollo están integradas en el prompt por defecto
- Compatible con cualquier ICP — el formulario recoge sector manualmente
