const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
  console.log('⏳ Conectando ao MySQL...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      port: parseInt(process.env.DB_PORT || '3306', 10),
    });

    console.log('✅ Conectado ao banco de dados:', process.env.DB_NAME);
    console.log('⏳ Criando tabela `tasks` (se não existir)...');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          file_path VARCHAR(255),
          file_type VARCHAR(50),
          file_name VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await connection.execute(createTableQuery);

    console.log('✅ Tabela `tasks` verificada/criada com sucesso!');
    await connection.end();
  } catch (error) {
    console.error('❌ Erro crítico ao conectar ou criar tabela:');
    console.error(error.message);
    process.exit(1);
  }
}

initDB();
