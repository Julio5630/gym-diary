// backend/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('📡 Conectando ao TiDB Cloud...');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});

// Testar conexão ao iniciar
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado ao TiDB Cloud com sucesso!');
        connection.release();
    } catch (error) {
        console.error('❌ Erro ao conectar ao TiDB Cloud:', error.message);
    }
})();

const query = async (sql, params = []) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Erro na query:', error);
        throw error;
    }
};

module.exports = { pool, query };