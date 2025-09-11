// api/rate.js
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
  const { Client } = require('pg');
  
  module.exports = async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido.' });
    }
  
    const { rating, review } = req.body;
  
    if (!rating) {
      return res.status(400).json({ error: 'A nota é obrigatória.' });
    }
  
    const connectionString = process.env.DATABASE_URL; // conforme estiver na variável de ambiente
    if (!connectionString) {
      return res.status(500).json({ error: 'Configuração de banco de dados ausente.' });
    }
  
    const client = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  
    try {
      await client.connect();
      const query = 'INSERT INTO ratings(rating, review) VALUES($1, $2) RETURNING *';
      const values = [rating, review || null];
      const result = await client.query(query, values);
  
      res.status(200).json({
        message: 'Avaliação enviada com sucesso!',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Erro ao inserir no banco de dados:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    } finally {
      await client.end();
    }
  };