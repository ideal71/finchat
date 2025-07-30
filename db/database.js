const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/financas.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT,
      tipo TEXT,
      valor REAL,
      categoria TEXT,
      data TEXT
    )
  `);
});

function saveTransaction(user, { tipo, valor, categoria }) {
  const data = new Date().toISOString();
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO transacoes (user, tipo, valor, categoria, data) VALUES (?, ?, ?, ?, ?)`,
      [user, tipo, valor, categoria, data],
      function (err) {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
}

function getMonthlySummary(user) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT tipo, SUM(valor) as total FROM transacoes 
       WHERE user = ? AND data >= ?
       GROUP BY tipo`,
      [user, start],
      (err, rows) => {
        if (err) return reject(err);
        const gasto = rows.find(r => r.tipo === 'gasto')?.total || 0;
        const ganho = rows.find(r => r.tipo === 'ganho')?.total || 0;
        const saldo = ganho - gasto;
        resolve(`📊 *Resumo do mês:*\n💰 Ganhos: R$${ganho}\n💸 Gastos: R$${gasto}\n🧾 Saldo: R$${saldo}`);
      }
    );
  });
}

module.exports = { saveTransaction, getMonthlySummary };
