// api/rate.js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { Client } = require('pg');

module.exports = async (req, res) => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return res.status(500).json({ error: 'Configuração de banco de dados ausente.' });
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Se for GET → buscar últimas 5 avaliações
    if (req.method === 'GET') {
      const query = 'SELECT rating, review FROM ratings ORDER BY id DESC LIMIT 5';
      const result = await client.query(query);
      return res.status(200).json(result.rows);
    }

    // Se for POST → inserir nova avaliação
    if (req.method === 'POST') {
      const { rating, review } = req.body;

      if (!rating) {
        return res.status(400).json({ error: 'A nota é obrigatória.' });
      }

      const query = 'INSERT INTO ratings(rating, review) VALUES($1, $2) RETURNING *';
      const values = [rating, review || null];
      const result = await client.query(query, values);

      return res.status(200).json({
        message: 'Avaliação enviada com sucesso!',
        data: result.rows[0]
      });
    }

    // Se não for GET nem POST
    return res.status(405).json({ error: 'Método não permitido.' });

  } catch (error) {
    console.error('Erro no banco de dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  } finally {
    await client.end();
  }
};
