
const formCadastro = document.getElementById('formCadastro');
const mensagem = document.getElementById('mensagem');

formCadastro.addEventListener('submit', async (event) => {

    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {

        const resposta = await fetch('http://localhost:3001/usuarios/registrar', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {

            mensagem.style.color = 'green';
            mensagem.textContent = 'Cadastro realizado com sucesso!';

            formCadastro.reset();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

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
