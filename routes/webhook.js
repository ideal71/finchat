const express = require('express');
const router = express.Router();
const { parseMessage } = require('../services/parser');
const { saveTransaction, getMonthlySummary } = require('../db/database');
const { sendMessage } = require('../services/zapi');

router.post('/', async (req, res) => {
  try {
    const data = req.body;

    const messageObj = data?.messages?.[0];

    if (!messageObj || !messageObj.from || !messageObj.text?.body) {
      return res.status(400).send('Requisição inválida');
    }

    const from = messageObj.from;
    const message = messageObj.text.body;

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

  } catch (err) {
    console.error("Erro ao processar webhook:", err);
    res.status(500).send("Erro interno");
  }
});

module.exports = router;
