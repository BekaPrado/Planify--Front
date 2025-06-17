const evento = JSON.parse(localStorage.getItem('eventoSelecionado'));

if (evento) {
  document.querySelector('.card-header h1').textContent = evento.titulo;
  document.querySelector('.card-header p:nth-of-type(1)').innerHTML = `<strong>Hora:</strong> ${new Date(evento.horario).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`;
  document.querySelector('.card-header p:nth-of-type(2)').innerHTML = `<strong>Data:</strong> ${new Date(evento.data_evento).toLocaleDateString('pt-BR')}`;
  document.querySelector('.card-header p:nth-of-type(3)').innerHTML = `<strong>Local:</strong> ${evento.local}`;
  document.querySelector('.header-img').src = evento.imagem;
  document.querySelector('.header-img').alt = `Imagem do evento ${evento.titulo}`;

  const descricao = evento.descricao || "Descrição não disponível.";
  document.querySelector('.card-body p').textContent = descricao;
} else {
  document.querySelector('.card').innerHTML = '<p>Nenhum evento selecionado.</p>';
}

document.getElementById("botao-comprar").addEventListener("click", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const evento = JSON.parse(localStorage.getItem("eventoSelecionado"));
  const quantidade = parseInt(document.getElementById("quantidade").value);

  if (!usuario || !evento) {
    alert("Erro: usuário ou evento não encontrado.");
    return;
  }

  if (isNaN(quantidade) || quantidade < 1) {
    alert("Por favor, selecione uma quantidade válida de ingressos.");
    return;
  }

  const payload = {
    id_usuario: usuario.id_usuario,
    id_evento: evento.id_evento,
  };

  try {
    const resposta = await fetch("http://localhost:8080/v1/planify/participar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (resposta.ok) {
      // Buscar dados atualizados do usuário
      const respostaUsuario = await fetch(`http://localhost:8080/v1/planify/usuario/${usuario.id_usuario}`);
      if (!respostaUsuario.ok) throw new Error('Erro ao buscar dados atualizados do usuário.');
      
      const dadosAtualizados = await respostaUsuario.json();
      const usuarioAtualizado = dadosAtualizados.usuario?.[0];

      if (usuarioAtualizado) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
      }

      alert("Ingresso(s) comprado(s) com sucesso!");
      // Redireciona para home.html conforme você pediu
      window.location.href = "home.html";
    } else {
      const erro = await resposta.json();
      alert(`Erro ao comprar ingresso: ${erro.message || resposta.statusText}`);
    }
  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
    console.error(erro);
  }
});
