# FacturaProcessor - Sistema Multi-Tenant de Procesamiento de Facturas

Sistema inteligente para procesar facturas automáticamente usando IA. Diseñado para Click Fast, Madeoff y futuros clientes.

## Características

- ✅ Login por cliente (Click Fast, Madeoff, etc.)
- ✅ Carga de PDFs de facturas
- ✅ Procesamiento automático con IA (Claude API)
- ✅ Tabla editable de datos extraídos
- ✅ Guardado automático en Google Sheets
- ✅ Descarga de Excel
- ✅ Histórico de facturas

## Requisitos

- Node.js 16+ 
- npm o yarn
- Cuenta en Vercel
- Google Workspace con Google Apps Script deployado

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tomasmarty0-cyber/facturaprocessor.git
cd facturaprocessor
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env.local`:

```
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbx8UOTQViDzmigyJRfTPzwrtVVs1sc_ihGcA0KwEmYZRCoICES_9DNPXivEPweYMHF7Qw/exec
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Deploy a Vercel

### Opción 1: Desde GitHub (recomendado)

1. Push a GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Ir a [vercel.com](https://vercel.com)
3. Conectar tu repositorio de GitHub
4. Vercel deploya automáticamente

### Opción 2: Deploy directo desde Vercel CLI

```bash
npm i -g vercel
vercel
```

## Credenciales por defecto

| Cliente | Usuario | Password |
|---------|---------|----------|
| Click Fast | CLICK-FAST | clickfast2026 |
| Madeoff | MADEOFF | madeoff2026 |

**⚠️ IMPORTANTE:** Cambiar las contraseñas en `pages/index.js` antes de poner en producción.

## Estructura del proyecto

```
facturaprocessor/
├── pages/
│   ├── _app.js           # Configuración global
│   ├── index.js          # Página de login
│   ├── dashboard.js      # Dashboard principal
│   └── procesar.js       # Procesamiento de facturas
├── styles/
│   ├── globals.css       # Estilos globales
│   ├── login.module.css  # Estilos login
│   ├── dashboard.module.css  # Estilos dashboard
│   └── procesar.module.css   # Estilos procesar
├── package.json
├── next.config.js
└── README.md
```

## Google Apps Script

El backend que procesa los PDFs está deployado en Google Apps Script. 

URL: `https://script.google.com/macros/s/AKfycbx8UOTQViDzmigyJRfTPzwrtVVs1sc_ihGcA0KwEmYZRCoICES_9DNPXivEPweYMHF7Qw/exec`

Funcionalidades:
- Lee PDFs en base64
- Extrae datos con Claude API
- Guarda en Google Sheets del cliente

## Google Sheets

- **Click Fast:** `Facturas - Click Fast`
- **Madeoff:** `Facturas - Madeoff`

Columnas:
- Fecha de Carga
- Proveedor
- CUIT
- Número Factura
- Fecha Factura
- Tipo Comprobante
- Código Item
- Descripción Item
- Cantidad
- Precio Unitario
- Subtotal
- Bonificación %
- Monto Bonificación
- Subtotal Neto
- IVA %
- Monto IVA
- Otros Impuestos
- Total
- Estado
- Notas

## Agregar nuevos clientes

1. Agregar credencial en `pages/index.js`:
```javascript
const credenciales = {
  'CLICK-FAST': 'clickfast2026',
  'MADEOFF': 'madeoff2026',
  'NUEVO-CLIENTE': 'password123'  // Agregar aquí
}
```

2. Crear Google Sheet con nombre del cliente

3. Agregar URL del Sheet en Google Apps Script:
```javascript
const SHEETS_IDS = {
  "CLICK-FAST": "...",
  "MADEOFF": "...",
  "NUEVO-CLIENTE": "NEW_SHEET_ID"  // Agregar aquí
}
```

## Troubleshooting

### "Error al procesar la factura"
- Verificar que el PDF no está corrupto
- Revisar que la API key de Anthropic es válida
- Verificar permisos del Google Apps Script

### "Credenciales inválidas"
- Revisar contraseña
- Verificar que el cliente existe en `pages/index.js`

### No aparecen datos en Sheet
- Verificar que el Apps Script está deployado
- Revisar que el Sheet ID es correcto
- Revisar permisos del Sheet

## Próximas mejoras

- [ ] Dashboard con estadísticas
- [ ] Multi-item por factura
- [ ] Historial editable
- [ ] Reportes por período
- [ ] Integración con Mercado Libre
- [ ] API pública para otros clientes

## Licencia

EcomDataHub © 2026
