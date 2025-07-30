function parseMessage(message) {
    const texto = message.toLowerCase();
  
    const tipo = texto.includes('gastei') || texto.includes('paguei') ? 'gasto'
              : texto.includes('recebi') || texto.includes('ganhei') ? 'ganho'
              : null;
  
    const valorMatch = texto.match(/(\d+[.,]?\d{0,2})/);
    const valor = valorMatch ? parseFloat(valorMatch[1].replace(',', '.')) : null;
  
    const categoriaMatch = texto.match(/(no|em)\s+([a-z]+)/);
    const categoria = categoriaMatch ? categoriaMatch[2] : 'geral';
  
    if (!tipo || !valor) return null;
  
    return { tipo, valor, categoria };
  }
  
  module.exports = { parseMessage };
  