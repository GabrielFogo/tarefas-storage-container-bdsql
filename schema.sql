-- schema.sql
-- Essa tabela deve ser criada manualmente no MySQL antes de rodar a aplicação

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255), -- Caminho/Chave do arquivo no Bucket/Container
    file_type VARCHAR(50),  -- MIME type para saber se é imagem ou vídeo
    file_name VARCHAR(255), -- Nome original do arquivo para exibição
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
