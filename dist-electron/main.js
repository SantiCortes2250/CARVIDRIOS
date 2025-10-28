import { app as s, ipcMain as i, BrowserWindow as c } from "electron";
import { fileURLToPath as l } from "node:url";
import n from "node:path";
import { createRequire as R } from "node:module";
const m = R(import.meta.url), u = m("better-sqlite3"), d = n.dirname(l(import.meta.url));
process.env.APP_ROOT = n.join(d, "..");
const E = process.env.VITE_DEV_SERVER_URL, g = n.join(process.env.APP_ROOT, "dist-electron"), T = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = E ? n.join(process.env.APP_ROOT, "public") : T;
let a, o;
function p() {
  a = new c({
    icon: n.join(process.env.VITE_PUBLIC, "icon.ico"),
    webPreferences: {
      preload: n.join(d, "preload.mjs")
    }
  }), a.webContents.on("did-finish-load", () => {
    a == null || a.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), E ? a.loadURL(E) : a.loadFile(n.join(T, "index.html"));
}
s.whenReady().then(() => {
  const r = n.join(s.getPath("userData"), "app.db");
  o = new u(r), o.pragma("journal_mode = WAL"), o.exec(`
    CREATE TABLE IF NOT EXISTS autos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      marca TEXT NOT NULL,
      modelo TEXT,
      imagen TEXT
    );
  `), o.exec(`
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
  `), p();
});
i.handle("autos:list", () => o.prepare("SELECT * FROM autos").all());
i.handle("auto:create", (r, e) => ({ id: o.prepare("INSERT INTO autos (nombre, marca, modelo, imagen) VALUES (?, ?, ?, ?)").run(e.nombre, e.marca, e.modelo, e.imagen).lastInsertRowid }));
i.handle("autos:update", (r, e) => ({ changes: o.prepare("UPDATE autos SET nombre=?, marca=?, modelo=?, imagen=? WHERE id=?").run(e.nombre, e.marca, e.modelo, e.imagen, e.id).changes }));
i.handle("autos:delete", (r, e) => ({ changes: o.prepare("DELETE FROM autos WHERE id=?").run(e).changes }));
i.handle("vidrios:listByAuto", (r, e) => o.prepare("SELECT * FROM vidrios WHERE auto_id=?").all(e));
i.handle("vidrios:create", (r, e) => ({ id: o.prepare(`
      INSERT INTO vidrios (auto_id, estanteria, stock, codigo, descripcion, precio, mano)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
  e.auto_id,
  e.estanteria,
  e.stock,
  e.codigo,
  e.descripcion,
  e.precio,
  e.mano
).lastInsertRowid }));
i.handle("vidrios:update", (r, e) => ({ changes: o.prepare(`
      UPDATE vidrios
      SET estanteria=?, stock=?, codigo=?, descripcion=?, precio=?, mano=?
      WHERE id=?
    `).run(
  e.estanteria,
  e.stock,
  e.codigo,
  e.descripcion,
  e.precio,
  e.mano,
  e.id
).changes }));
i.handle("vidrios:delete", (r, e) => ({ changes: o.prepare("DELETE FROM vidrios WHERE id=?").run(e).changes }));
s.on("window-all-closed", () => {
  process.platform !== "darwin" && (s.quit(), a = null);
});
s.on("activate", () => {
  c.getAllWindows().length === 0 && p();
});
export {
  g as MAIN_DIST,
  T as RENDERER_DIST,
  E as VITE_DEV_SERVER_URL
};
