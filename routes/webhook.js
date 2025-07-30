const express = require('express');
const router = express.Router();
const { parseMessage } = require('../services/parser');
const { saveTransaction, getMonthlySummary } = require('../db/database');
const { sendMessage } = require('../services/zapi');

router.post('/', async (req, res) => {
  const { from, message } = req.body;

  if (!from || !message) {
    return res.status(400).send('Requisição inválida');
  }

  let resposta;

  if (message.toLowerCase() === '/resumo') {
    resposta = await getMonthlySummary(from);
  } else {
    const parsed = parseMessage(message);
    if (!parsed) {
      resposta = "❌ Não entendi. Tente algo como 'Gastei 20 no mercado'";
    } else {
      await saveTransaction(from, parsed);
      resposta = `✅ ${parsed.tipo} de R$${parsed.valor} em ${parsed.categoria} registrado!`;
    }
  }

  await sendMessage(from, resposta);
  res.send({ status: "Mensagem processada" });
});

module.exports = router;
