const input = document.getElementById('foto');
const btnCadastrar = document.querySelector('.btn');
const selectCategoria = document.getElementById('categoria');
const fotoUrlInput = document.getElementById('foto_url');
const preview = document.getElementById('preview');
const selectEstado = document.getElementById('estado');

function enviarImagem() {
  const url = document.getElementById('foto_url').value;
  if (url) {
    localStorage.setItem('imagemEvento', url);
    window.location.href = 'home.html';
  }
}

// Carrega categorias da API
async function carregarCategorias() {
  try {
    const resposta = await fetch('http://localhost:8080/v1/planify/categoria');
    const dados = await resposta.json(); // dados declarado e inicializado aqui
    console.log("Categorias recebidas:", dados);

    selectCategoria.innerHTML = '<option disabled selected>Selecione uma categoria</option>';

    const categorias = dados.categoria || dados; // aqui usamos dados já inicializado

    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id_categoria;
      option.textContent = cat.categoria;
      selectCategoria.appendChild(option);
    });

  } catch (erro) {
    console.error('Erro ao carregar categorias:', erro);
    selectCategoria.innerHTML = '<option disabled selected>Erro ao carregar categorias</option>';
  }
}
carregarCategorias();

// Carregar Estados
async function carregarEstado() {
  try {
    const resposta = await fetch('http://localhost:8080/v1/planify/estado');
    const dados = await resposta.json(); // dados declarado e inicializado aqui
    console.log("Estados recebidos:", dados);

    selectEstado.innerHTML = '<option disabled selected>Selecione um Estado</option>';

    const estados = dados.estado || dados; // aqui usamos dados já inicializado

    estados.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id_estado;
      option.textContent = cat.estado;
      selectEstado.appendChild(option);
    });

  } catch (erro) {
    console.error('Erro ao carregar Estados:', erro);
    selectEstado.innerHTML = '<option disabled selected>Erro ao carregar Estados</option>';
  }
}
carregarEstado(); 

// Cadastra evento
btnCadastrar.addEventListener('click', async () => {
  const titulo = document.getElementById('titulo').value
  const descricao = document.getElementById('descricao').value
  const data_evento = document.getElementById('data').value
  const horario = document.getElementById('hora').value
  const local = document.getElementById('local').value
  const imagem = document.getElementById('foto_perfil').value
  const limite = parseInt(document.getElementById('limite').value)
  const valor_ingresso = parseFloat(document.getElementById('valor').value)
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
const id_usuario = usuarioLogado?.id_usuario;

if (!id_usuario) {
  alert("Erro: você precisa estar logado para criar um evento.");
  window.location.href = "login.html"
  return;
}

  const id_categoria = parseInt(selectCategoria.value)

  if (!id_categoria) {
    alert('Selecione uma categoria válida.')
    return;
  }

  const id_estado = parseInt(selectEstado.value)

if (!id_estado) {
  alert('Selecione um estado válido.')
  return;
}

const dados = {
  titulo,
  descricao,
  data_evento: data_evento,
  horario: horario + ':00', 
  local,
  imagem, 
  limite_participante: limite,
  valor_ingresso,
  id_usuario,
  id_estado,
  categoria: id_categoria ? [{ id_categoria }] : undefined

}
console.log(dados)
  try {
    const resposta = await fetch('http://localhost:8080/v1/planify/evento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) throw new Error('Erro ao cadastrar evento.');
    alert('Evento criado com sucesso!')
    window.location.href = 'home.html'
  } catch (erro) {
    console.error(erro);
    alert('Erro ao criar evento. Verifique os dados e tente novamente.');
  }
});





