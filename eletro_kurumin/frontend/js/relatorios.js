
const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

if (!usuario) {
    window.location.href = 'login.html';
} else {

    document.getElementById('nomeUsuario').textContent = usuario.nome;

    async function carregarRelatorio() {

        try {

            const resposta = await fetch('http://localhost:3001/componentes');
            const componentes = await resposta.json();

            if (!resposta.ok) {
                throw new Error('Erro ao buscar componentes');
            }

            const lista = document.getElementById('listaRelatorio');

            lista.innerHTML = '';

            let totalComponentes = componentes.length;
            let totalItens = 0;
            let valorEstoque = 0;

            componentes.forEach(componente => {

                const preco = Number(componente.preco);
                const quantidade = Number(componente.quantidade_estoque);

                const valorTotal = preco * quantidade;

                totalItens += quantidade;
                valorEstoque += valorTotal;

                lista.innerHTML += `
                    <tr>
                        <td>${componente.nome}</td>
                        <td>${componente.descricao || '-'}</td>
                        <td>
                            ${preco.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}
                        </td>
                        <td>${quantidade}</td>
                        <td>
                            ${valorTotal.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}
                        </td>
                    </tr>
                `;
            });

            if (componentes.length === 0) {
                lista.innerHTML = `
                    <tr>
                        <td colspan="5">Nenhum componente cadastrado.</td>
                    </tr>
                `;
            }

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

            document.getElementById('listaRelatorio').innerHTML = `
                <tr>
                    <td colspan="5">Não foi possível carregar o relatório.</td>
                </tr>
            `;
        }
    }

    document.getElementById('btnSair').addEventListener('click', () => {

        localStorage.removeItem('usuarioLogado');

        window.location.href = 'login.html';

    });

    carregarRelatorio();
}
