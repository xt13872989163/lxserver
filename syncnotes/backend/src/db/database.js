const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

let db = null;

const initDatabase = async () => {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', '..', 'data', 'syncnotes.db');

  try {
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
  } catch (error) {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      isDeleted INTEGER NOT NULL DEFAULT 0,
      version INTEGER NOT NULL DEFAULT 1
    )
  `);

  saveDatabase();
  return db;
};

const saveDatabase = () => {
  if (!db) return;
  const dataDir = path.join(__dirname, '..', '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(path.join(dataDir, 'syncnotes.db'), buffer);
};

const getDb = () => db;

const run = (sql, params = []) => {
  db.run(sql, params);
  saveDatabase();
};

const get = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
};

const all = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
};

module.exports = {
  initDatabase,
  getDb,
  run,
  get,
  all,
  saveDatabase,
};
