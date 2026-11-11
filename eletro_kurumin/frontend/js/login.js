
const formLogin = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const resposta = await fetch('http://localhost:3001/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagem.style.color = 'green';
            mensagem.textContent = 'Login realizado com sucesso!';

            localStorage.setItem('usuarioLogado', JSON.stringify(dados.usuario));

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        } else {
            mensagem.style.color = 'red';
            mensagem.textContent = dados.mensagem;
        }

    } catch (erro) {
        mensagem.style.color = 'red';
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
        console.log(erro);
    }
});
