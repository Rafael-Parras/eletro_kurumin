
// Recuperar usuário que fez login
const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

// Verificar se existe usuário conectado
if (!usuario) {
    window.location.href = 'login.html';
}

// Mostrar nome do usuário
document.getElementById('nomeUsuario').textContent = usuario.nome;


// BUSCAR COMPONENTES DO BANCO
async function carregarDashboard() {

    try {
        const resposta = await fetch('http://localhost:3001/componentes');

        const componentes = await resposta.json();

        if (!resposta.ok) {
            throw new Error('Erro ao buscar componentes');
        }

        // Quantidade de componentes cadastrados
        const totalComponentes = componentes.length;

        // Quantidade total de itens
        let totalItens = 0;

        // Valor total do estoque
        let valorEstoque = 0;

        componentes.forEach(componente => {

            totalItens += Number(componente.quantidade_estoque);

            valorEstoque +=
                Number(componente.preco) *
                Number(componente.quantidade_estoque);

        });

        // Mostrar os resultados na tela
        document.getElementById('totalComponentes').textContent =
            totalComponentes;

        document.getElementById('totalItens').textContent =
            totalItens;

        document.getElementById('valorEstoque').textContent =
            valorEstoque.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

    } catch (erro) {
        console.log('Erro:', erro);
    }
}


// BOTÃO SAIR
document.getElementById('btnSair').addEventListener('click', () => {

    localStorage.removeItem('usuarioLogado');

    window.location.href = 'login.html';

});


// CARREGAR INFORMAÇÕES
carregarDashboard();
