const API_URL = 'http://localhost:8080/v1/planify/evento';
const container = document.getElementById('eventos-container');

document.addEventListener('DOMContentLoaded', loadEventos);

async function loadEventos() {
  try {
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const id_usuario_logado = usuarioLogado?.id_usuario;

    container.innerHTML = '';

    dados.eventos.forEach(e => {
      const usuario = e.usuario[0] || {};
      const categoria = e.categoria.map(cat => cat.categoria).join(", ");

      // Formatação de data
      const data = new Date(e.data_evento).toLocaleDateString('pt-BR');
      const hora = new Date(e.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const valor = parseFloat(e.valor_ingresso).toFixed(2);

      const card = document.createElement('div');
      card.classList.add('card-evento');
      card.innerHTML = `
        <img src="${e.imagem}" alt="${e.titulo}" style="width: 100%; border-radius: 10px; max-height: 180px; object-fit: cover;" />
        <h3>${e.titulo}</h3>
        <p>${e.descricao}</p>
        <p><strong>Data:</strong> ${data} às ${hora}</p>
        <p><strong>Local:</strong> ${e.local}</p>
        <p><strong>Ingresso:</strong> R$ ${valor}</p>
        <p><strong>Categoria:</strong> ${categoria}</p>
        <p><strong>Organizador:</strong> ${usuario.nome || 'Desconhecido'} ${usuario.id_usuario === id_usuario_logado ? "(você)" : ""}</p>
      `;
      container.appendChild(card);
    });

    if (dados.eventos.length === 0) {
      container.innerHTML = '<p>Nenhum evento encontrado.</p>';
    }

  } catch (erro) {
    console.error('Erro ao carregar eventos:', erro);
    container.innerHTML = '<p>Não foi possível carregar os eventos.</p>';
  }
}
