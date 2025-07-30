const axios = require('axios');
require('dotenv').config();

async function sendMessage(phone, message) {
  const instance = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;

  const cleanPhone = phone.replace(/\D/g, ''); // remove caracteres não numéricos

  try {
    await axios.post(`https://api.z-api.io/instances/${instance}/token/${token}/send-text`, {
      phone: cleanPhone,
      message,
    });
    console.log(`✅ Mensagem enviada para ${cleanPhone}: ${message}`);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
  }
}

module.exports = { sendMessage };
