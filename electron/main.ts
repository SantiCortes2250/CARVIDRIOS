import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// ⚙️ Carga segura de módulos nativos (evita errores con ESM)
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const Database = require('better-sqlite3') as typeof import('better-sqlite3')

// 🧱 Rutas base
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let db: import('better-sqlite3').Database

// 🪟 Crear ventana
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// 🧩 Inicialización
app.whenReady().then(() => {
  const dbPath = path.join(app.getPath('userData'), 'app.db')

  // 🧠 Inicializa la base de datos (modo síncrono)
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')

  // 🧱 Tablas
  db.exec(`
    CREATE TABLE IF NOT EXISTS autos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      marca TEXT NOT NULL,
      modelo TEXT,
      imagen TEXT
    );
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS vidrios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auto_id INTEGER,
      estanteria TEXT,
      stock INTEGER,
      codigo TEXT,
      descripcion TEXT,
      precio REAL,
      mano REAL,
      FOREIGN KEY(auto_id) REFERENCES autos(id) ON DELETE CASCADE
    );
  `)

  createWindow()
})

// ================== AUTOS ==================
interface Auto {
  id: number
  nombre: string
  marca: string
  modelo: string
  imagen: string
}

ipcMain.handle('autos:list', () => {
  return db.prepare('SELECT * FROM autos').all()
})

ipcMain.handle('auto:create', (_, auto: Auto) => {
  const info = db
    .prepare('INSERT INTO autos (nombre, marca, modelo, imagen) VALUES (?, ?, ?, ?)')
    .run(auto.nombre, auto.marca, auto.modelo, auto.imagen)
  return { id: info.lastInsertRowid }
})

ipcMain.handle('autos:update', (_, auto: Auto) => {
  const info = db
    .prepare('UPDATE autos SET nombre=?, marca=?, modelo=?, imagen=? WHERE id=?')
    .run(auto.nombre, auto.marca, auto.modelo, auto.imagen, auto.id)
  return { changes: info.changes }
})

ipcMain.handle('autos:delete', (_, id: number) => {
  const info = db.prepare('DELETE FROM autos WHERE id=?').run(id)
  return { changes: info.changes }
})

// ================== VIDRIOS ==================
interface Vidrio {
  id?: number
  auto_id: number
  estanteria: string
  stock: number
  codigo: string
  descripcion: string
  precio: number
  mano: number
}

ipcMain.handle('vidrios:listByAuto', (_, auto_id: number) => {
  return db.prepare('SELECT * FROM vidrios WHERE auto_id=?').all(auto_id)
})

ipcMain.handle('vidrios:create', (_, vidrio: Vidrio) => {
  const info = db
    .prepare(`
      INSERT INTO vidrios (auto_id, estanteria, stock, codigo, descripcion, precio, mano)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      vidrio.auto_id,
      vidrio.estanteria,
      vidrio.stock,
      vidrio.codigo,
      vidrio.descripcion,
      vidrio.precio,
      vidrio.mano
    )
  return { id: info.lastInsertRowid }
})

ipcMain.handle('vidrios:update', (_, vidrio: Vidrio) => {
  const info = db
    .prepare(`
      UPDATE vidrios
      SET estanteria=?, stock=?, codigo=?, descripcion=?, precio=?, mano=?
      WHERE id=?
    `)
    .run(
      vidrio.estanteria,
      vidrio.stock,
      vidrio.codigo,
      vidrio.descripcion,
      vidrio.precio,
      vidrio.mano,
      vidrio.id
    )
  return { changes: info.changes }
})

ipcMain.handle('vidrios:delete', (_, id: number) => {
  const info = db.prepare('DELETE FROM vidrios WHERE id=?').run(id)
  return { changes: info.changes }
})

// ================== APP EVENTS ==================
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
