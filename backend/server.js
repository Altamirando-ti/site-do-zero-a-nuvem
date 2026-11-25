const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permite receber dados em formato JSON

// Configuração da Conexão com o PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Função para garantir que a tabela existe no banco ao iniciar 
// async function criarTabela() {
//     const query = `
//         CREATE TABLE IF NOT EXISTS itens (
//             id SERIAL PRIMARY KEY,
//             titulo VARCHAR(100) NOT NULL,
//             descricao TEXT NOT NULL,
//             criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );
//     `;
//     try {
//         await pool.query(query);
//         console.log("✅ Tabela 'itens' verificada/criada com sucesso no PostgreSQL.");
//     } catch (err) {
//         console.error("❌ Erro ao criar tabela no banco:", err);
//     }
// }
// criarTabela(); 
// Funcao comentada para usar a estratégia de saúde (healthcheck) no Docker Compose


// Função para tentar conectar e criar a tabela com tentativas automáticas (Retry)
async function tentarConectarComReententaiva(retries = 5) {
    while (retries) {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS itens (
                    id SERIAL PRIMARY KEY,
                    titulo VARCHAR(100) NOT NULL,
                    descricao TEXT NOT NULL,
                    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;
            await pool.query(query);
            console.log("✅ Tabela 'itens' verificada/criada com sucesso no PostgreSQL.");
            break; // Sucesso, sai do loop
        } catch (err) {
            retries -= 1;
            console.log(`⚠️ Banco ainda não está pronto. Tentativas restantes: ${retries}. Aguardando 3 segundos...`);
            if (retries === 0) {
                console.error("❌ Erro fatal ao conectar com o banco:", err);
                process.exit(1);
            }
            // Espera 3 segundos antes de tentar de novo
            await new Promise(res => setTimeout(res, 3000));
        }
    }
}

// Chama a função ao iniciar
tentarConectarComReententaiva();

// --- ROTAS DA API ---

// 1. Rota GET: Buscar todos os itens salvos no banco
app.get('/api/itens', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM itens ORDER BY id DESC');
        res.json(resultado.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro interno ao buscar itens' });
    }
});

// 2. Rota POST: Salvar um novo item no banco
app.post('/api/itens', async (req, res) => {
    const { titulo, descricao } = req.body;
    
    if (!titulo || !descricao) {
        return res.status(400).json({ erro: 'Título e descrição são obrigatórios' });
    }

    try {
        const query = 'INSERT INTO itens (titulo, descricao) VALUES ($1, $2) RETURNING *';
        const valores = [titulo, descricao];
        const resultado = await pool.query(query, valores);
        
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro interno ao salvar item' });
    }
});

// 3. Rota DELETE: Excluir um item pelo ID
app.delete('/api/itens/:id', async (req, res) => {
    const { id } = req.params;
    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
        return res.status(400).json({ erro: 'ID inválido' });
    }

    try {
        const resultado = await pool.query(
            'DELETE FROM itens WHERE id = $1 RETURNING *',
            [itemId]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({ erro: 'Item não encontrado' });
        }

        res.json({ mensagem: 'Item excluído com sucesso', item: resultado.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro interno ao excluir item' });
    }
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
});