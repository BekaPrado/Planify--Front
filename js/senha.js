let emailGlobal = null
let usuarioId = null

// Etapa 1: Enviar código
async function enviarCodigo() {
  const email = document.getElementById('email-recuperacao').value
  emailGlobal = email

  try {
    const response = await fetch('http://localhost:8080/v1/planify/recuperar-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const result = await response.json()
    alert(result.message);

    if (response.ok) {
      document.getElementById('etapa-email').classList.add('hidden');
      document.getElementById('etapa-codigo').classList.remove('hidden');
    }
  } catch (error) {
    alert('❌ Erro ao enviar código: ' + error.message)
  }
}

// Etapa 2: Validar código
async function validarCodigo() {
  const codigo = document.getElementById('codigo-validacao').value
  const msg = document.getElementById('mensagem-erro')

  if (!codigo) {
    msg.textContent = "❌ Digite o código recebido por e-mail."
    return
  }

  try {
    const response = await fetch('http://localhost:8080/v1/planify/validar-codigo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailGlobal, codigo })
    });

    const result = await response.json();
    console.log('Resposta da API de validação:', result) // <-- Debug

    msg.textContent = result.message

    if (response.ok && result.id_usuario) {
      usuarioId = result.id_usuario;
      document.getElementById('etapa-codigo').classList.add('hidden')
      document.getElementById('etapa-senha').classList.remove('hidden')
    } else {
      msg.textContent = "❌ Código inválido ou expirado."
    }
  } catch (error) {
    msg.textContent = "❌ Erro na validação do código: " + error.message
  }
}

// Etapa 3: Redefinir senha
async function redefinirSenha() {
  const nova = document.getElementById('nova-senha').value
  const confirmar = document.getElementById('confirmar-senha').value

  if (!usuarioId) {
    return alert('❌ Não foi possível identificar o usuário. Valide o código novamente.')
  }

  if (nova !== confirmar) {
    return alert('❌ As senhas não coincidem.')
  }

  if (nova.length > 20) {
    return alert('❌ A senha deve ter até 20 caracteres.')
  }

  try {
    const response = await fetch(`http://localhost:8080/v1/planify/usuario/senha/${usuarioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha: nova })
    });

    const result = await response.json();
    console.log('Resposta da redefinição:', result); // <-- Debug

    alert(result.message || 'Senha redefinida com sucesso.')

    if (response.ok) {
      window.location.href = 'index.html';
    }
  } catch (error) {
    alert('❌ Erro ao redefinir senha: ' + error.message)
  }
}
