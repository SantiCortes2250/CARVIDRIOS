import sqlite3 from "sqlite3";
import path from "path";
import { app } from "electron";

sqlite3.verbose();

const dbPath = path.join(app.getPath("userData"), "app.db");
export const db = new sqlite3.Database(dbPath);


// Crear tablas si no existen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS autos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      marca TEXT NOT NULL,
      modelo TEXT,
      imagen TEXT
    )
  `);

  db.run(`
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
    )
  `);
});

export interface Auto {
  id?: number;
  nombre: string;
  marca: string;
  modelo?: string;
  imagen?: string;
}

export interface Vidrio {
  id?: number;
  auto_id: number;
  estanteria?: string;
  stock?: number;
  codigo?: string;
  descripcion?: string;
  precio?: number;
  mano?: number;
}
