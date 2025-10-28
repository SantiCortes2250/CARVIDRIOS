# 🪟 CARVIDRIOS

![Electron](https://img.shields.io/badge/Electron-20232A?style=for-the-badge&logo=electron&logoColor=61DAFB)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-563D7C?style=for-the-badge&logo=vite&logoColor=yellow)
![SQLite3](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

> 💡 Aplicación de escritorio para la gestión de **vehículos y vidrios automotrices**, desarrollada con **Electron + React + Vite + better-sqlite3**.

---

## 🧩 Descripción

**CARVIDRIOS** es una app de escritorio moderna y eficiente diseñada para talleres o negocios de vidrios automotrices.  
Permite registrar **vehículos**, asociarles **vidrios** con información detallada (código, descripción, precios, stock, estantería) y administrar fácilmente el inventario desde una interfaz limpia y rápida.

Todo se almacena **localmente en SQLite3**, por lo que no se requiere conexión a internet ni servidor externo.

---

## 🚀 Tecnologías Principales

| Área | Tecnología |
|------|-------------|
| 🧠 Framework | [Electron](https://www.electronjs.org/) |
| ⚡ Frontend | [React + Vite](https://vitejs.dev/) |
| 🎨 UI | [shadcn/ui](https://ui.shadcn.com/) + [TailwindCSS](https://tailwindcss.com/) |
| 💾 Base de datos | [better-sqlite3](https://www.better-sqlite3.org/) |
| 💬 Lenguaje | TypeScript / JSX |
| 🏗️ Empaquetado | [electron-builder](https://www.electron.build/) |

---

## 📁 Estructura del Proyecto

---
```bash
CARVIDRIOS/
│
├── dist-electron/ # Archivos compilados de Electron
├── electron/ # Proceso principal y preload
│ ├── main.ts
│ └── preload.ts
│
├── src/
│ ├── assets/ # Recursos estáticos (imágenes, íconos)
│ ├── components/ # Componentes reutilizables (modales, tablas, etc.)
│ ├── lib/ # Utilidades o funciones auxiliares
│ ├── pages/ # Vistas principales
│ │ ├── Autos.jsx # Gestión de autos y vidrios
│ │ ├── Accesorios.jsx # (Próximamente)
│ │ └── Dashboard.jsx # Panel inicial
│ ├── App.tsx # Componente raíz
│ ├── main.tsx # Punto de entrada React
│ └── index.css # Estilos globales
│
├── public/ # Archivos públicos
├── electron-builder.json5 # Configuración de build
├── package.json
├── tsconfig.json
└── README.md
```
---

## ⚙️ Instalación y Ejecución

### 🧱 1. Clonar el repositorio

```bash
git clone https://github.com/SantiCortes2250/CARVIDRIOS
cd carvidrios
npm install
npm run dev
npm run build



