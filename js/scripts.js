const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// Alternar entre os formulários
registerBtn.addEventListener('click', () => {
  container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
});

// =====================
// CADASTRO DE USUÁRIO
// =====================
const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const usuario = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value,
    data_nascimento: document.getElementById('data_nascimento').value,
    palavra_chave: document.getElementById('palavra_chave').value,
    foto_perfil: document.getElementById('foto_perfil').value
  };

  try {
    const response = await fetch('http://localhost:8080/v1/planify/usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });

    const result = await response.json();

    if (response.ok) {
      alert('✅ Usuário cadastrado com sucesso!');
      registerForm.reset();
      container.classList.remove('active'); // Volta para login
    } else {
      alert('❌ Erro ao cadastrar: ' + (result.message || JSON.stringify(result)));
    }
  } catch (error) {
    alert('❌ Erro na requisição: ' + error.message);
  }
});

// ===============
// LOGIN DE USUÁRIO
// ===============
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;

  try {
    const response = await fetch('http://localhost:8080/v1/planify/usuario');
    const result = await response.json();

    if (response.ok) {
      const usuarios = result.usuario; // <- nome correto da propriedade

      if (!Array.isArray(usuarios)) {
        throw new Error('Resposta inválida da API: campo "usuario" não é um array.');
      }

      const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

      if (usuarioEncontrado) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
        window.location.href = 'home.html';
      } else {
        alert('❌ Email ou senha incorretos.');
      }
    } else {
      alert('❌ Erro ao buscar usuários: ' + (result.message || JSON.stringify(result)));
    }
  } catch (error) {
    alert('❌ Erro na requisição: ' + error.message);
  }
});
