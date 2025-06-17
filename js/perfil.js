// Pega o usuário salvo no localStorage
const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuario) {
    // Se não tiver usuário logado, redireciona para a página inicial/login
    window.location.href = 'index.html';
  } else {

    // Preenche os dados na página
    document.getElementById('usuario-nome').textContent = usuario.nome || 'Não informado';
    document.getElementById('usuario-email').textContent = usuario.email || 'Não informado';
    document.getElementById('usuario-dataNascimento').textContent = usuario.data_nascimento
    ? new Date(usuario.data_nascimento).toLocaleDateString('pt-BR')
    : 'Não informado';
    // Por segurança, talvez não exiba a senha em texto, mas se quiser:
    document.getElementById('usuario-senha').textContent = usuario.senha ? '********' : 'Não informado';

    // Atualiza a foto de perfil (se existir)
    if (usuario.foto_perfil) {
      document.getElementById('foto-perfil').src = usuario.foto_perfil;
    }
  }

  // Função para logout, caso queira
  function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
  }
/////////////
const btnPerfil = document.getElementById('header-perfil');
const btnIngresso = document.getElementById('header-ingresso');
const btnEventos = document.getElementById('header-eventos');

const dadosPrincipal = document.getElementById('dados-principal');

btnPerfil.addEventListener('click', () => {
  // Limpa a div
  dadosPrincipal.innerHTML = '';

  // Pega o usuário
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado')) || {};

  // Formata a data
  const dataFormatada = usuario.data_nascimento
    ? new Date(usuario.data_nascimento).toLocaleDateString('pt-BR')
    : 'Não informado';

  // Monta o conteúdo HTML dinamicamente
  const perfilHTML = `
    <div id="dados-perfil">
      <div id="dados">
        <p>Nome:</p>
        <p class="dados-usuario" id="usuario-nome">${usuario.nome || 'Não informado'}</p>
        <p>Email:</p>
        <p class="dados-usuario" id="usuario-email">${usuario.email || 'Não informado'}</p>
        <p>Data Nascimento:</p>
        <p class="dados-usuario" id="usuario-dataNascimento">${dataFormatada}</p>
        <p>Senha:</p>
        <p class="dados-usuario" id="usuario-senha">${usuario.senha ? '********' : 'Não informado'}</p>
      </div>
      <div id="dados-foto">
        <img src="${usuario.foto_perfil || '../img/Test Account.png'}" alt="Foto do perfil" id="foto-perfil">
        <button id="button-edit">Editar Perfil</button>
      </div>
    </div>
  `;

  // Insere o HTML na div principal
  dadosPrincipal.innerHTML = perfilHTML;
});

// Para os outros botões, só limpa e pode inserir outro conteúdo, ou deixa vazio
btnIngresso.addEventListener('click', async () => {
  dadosPrincipal.innerHTML = ''; // Limpa a div
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado')) || {};
  const eventos = usuario.eventos || [];

  // Verifica se o usuário tem eventos
  if (!Array.isArray(eventos) || eventos.length === 0) {
    dadosPrincipal.innerHTML = '<p>Nenhum ingresso encontrado.</p>';
    return;
  }

  // Renderiza os eventos na página
  eventos.forEach(evento => {
    const dataFormatada = new Date(evento.data_evento).toLocaleDateString('pt-BR');
    const horarioFormatado = new Date(evento.horario).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const eventoHTML = `
      <div id="card-evento">
        <h1>${evento.titulo}</h1>
        <img src="${evento.imagem}" alt="Imagem do evento">
        <p class="card-descricao"><strong>Descrição:</strong> ${evento.descricao}</p>
        <p class="card-descricao"><strong>Data:</strong> ${dataFormatada}</p>
        <p class="card-descricao"><strong>Horário:</strong> ${horarioFormatado}</p>
        <p class="card-descricao"><strong>Local:</strong> ${evento.local}</p>
        <button class="delete" data-id="${evento.id_evento}">Sair do Evento</button>
      </div>
    `;

    dadosPrincipal.innerHTML += eventoHTML;
  });

  // Seleciona todos os botões de "Sair do Evento"
  const botoesDelete = document.querySelectorAll('.delete');
  botoesDelete.forEach(botao => {
    botao.addEventListener('click', async (e) => {
      const id_evento = e.target.getAttribute('data-id');
      const id_usuario = String(usuario.id_usuario); // Garante que seja string

      const dados = {
        id_usuario,
        id_evento
      };

      try {
        // Envia requisição DELETE para o backend
        const resposta = await fetch('http://localhost:8080/v1/planify/participar', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });

        if (!resposta.ok) throw new Error('Erro ao sair do evento.');

        // Busca os dados atualizados do usuário no backend
        const respostaUsuario = await fetch(`http://localhost:8080/v1/planify/usuario/${id_usuario}`);
        if (!respostaUsuario.ok) throw new Error('Erro ao buscar dados atualizados do usuário.');

        const dadosAtualizados = await respostaUsuario.json();
        const usuarioAtualizado = dadosAtualizados.usuario?.[0];

        if (usuarioAtualizado) {
          localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
        }

        // Remove o card do evento da página
        const eventoCard = e.target.closest('#card-evento');
        eventoCard.remove();

        // Se não houver mais eventos, exibe mensagem
        if (usuarioAtualizado?.eventos?.length === 0) {
          dadosPrincipal.innerHTML = '<p>Nenhum ingresso encontrado.</p>';
        }

        alert('Você saiu do evento com sucesso!');
      } catch (erro) {
        console.error(erro);
        alert('Erro ao sair do evento. Verifique os dados e tente novamente.');
      }
    });
  });
});