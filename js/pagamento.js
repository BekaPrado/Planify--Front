const evento = JSON.parse(localStorage.getItem('eventoSelecionado'));

if (evento) {
  document.querySelector('.top-section h1').textContent = evento.titulo;
  document.getElementById('hora').textContent = new Date(evento.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('data').textContent = new Date(evento.data_evento).toLocaleDateString('pt-BR');
  document.getElementById('local').textContent = evento.local;
  document.querySelector('.banner-img').src = evento.imagem;
  document.querySelector('.banner-img').alt = `Banner do evento ${evento.titulo}`;
  
  const valor = parseFloat(evento.valor_ingresso).toFixed(2);
  document.getElementById('valor').textContent = valor;
} else {
  document.querySelector('.card').innerHTML = '<p>Nenhum evento selecionado para pagamento.</p>';
}