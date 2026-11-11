
const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

if (!usuario) {
    window.location.href = 'login.html';
} else {

    document.getElementById('nomeUsuario').textContent = usuario.nome;

    const form = document.getElementById('formComponente');
    const mensagem = document.getElementById('mensagemComponente');

    let idEmEdicao = null;


    // LISTAR COMPONENTES
    async function carregarComponentes() {

        try {
            const resposta = await fetch('http://localhost:3001/componentes');
            const componentes = await resposta.json();

            if (!resposta.ok) {
                throw new Error('Erro ao buscar componentes');
            }

            const lista = document.getElementById('listaComponentes');

            lista.innerHTML = '';

            if (componentes.length === 0) {
                lista.innerHTML = `
                    <tr>
                        <td colspan="5">Nenhum componente cadastrado.</td>
                    </tr>
                `;
                return;
            }

            componentes.forEach(componente => {

                lista.innerHTML += `
                    <tr>
                        <td>${componente.nome}</td>
                        <td>${Number(componente.preco).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}</td>
                        <td>${componente.quantidade_estoque}</td>
                        <td>${componente.id_categoria}</td>
                        <td>
                            <button class="btn-editar"
                                onclick="editarComponente(${componente.id_COMPONENTE})">
                                Editar
                            </button>

                            <button class="btn-excluir"
                                onclick="excluirComponente(${componente.id_COMPONENTE})">
                                Excluir
                            </button>
                        </td>
                    </tr>
                `;
            });

        } catch (erro) {
            console.log(erro);
            mensagem.textContent = 'Erro ao carregar componentes.';
            mensagem.style.color = 'red';
        }
    }


    // CADASTRAR OU ATUALIZAR
    form.addEventListener('submit', async (event) => {

        event.preventDefault();

        const componente = {
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
            preco: Number(document.getElementById('preco').value),
            quantidade_estoque: Number(document.getElementById('quantidade').value),
            id_categoria: Number(document.getElementById('categoria').value),
            id_usuario: usuario.id_usuario
        };

        const metodo = idEmEdicao ? 'PUT' : 'POST';

        const url = idEmEdicao
            ? `http://localhost:3001/componentes/${idEmEdicao}`
            : 'http://localhost:3001/componentes';

        try {

            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(componente)
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.mensagem || 'Erro ao salvar componente');
            }

            mensagem.style.color = 'green';
            mensagem.textContent = dados.mensagem;

            form.reset();
            idEmEdicao = null;

            document.getElementById('tituloFormulario').textContent =
                'Cadastrar componente';

            document.getElementById('btnCadastrar').textContent =
                'Cadastrar componente';

            document.getElementById('btnCancelar').style.display = 'none';

            carregarComponentes();

        } catch (erro) {
            mensagem.style.color = 'red';
            mensagem.textContent = erro.message;
        }
    });


    // EDITAR COMPONENTE
    window.editarComponente = async function(id) {

        try {
            const resposta = await fetch('http://localhost:3001/componentes');
            const componentes = await resposta.json();

            const componente = componentes.find(item =>
                Number(item.id_COMPONENTE) === Number(id)
            );

            if (!componente) {
                alert('Componente não encontrado.');
                return;
            }

            idEmEdicao = id;

            document.getElementById('nome').value = componente.nome;
            document.getElementById('descricao').value = componente.descricao;
            document.getElementById('preco').value = componente.preco;
            document.getElementById('quantidade').value =
                componente.quantidade_estoque;
            document.getElementById('categoria').value =
                componente.id_categoria;

            document.getElementById('tituloFormulario').textContent =
                'Editar componente';

            document.getElementById('btnCadastrar').textContent =
                'Salvar alterações';

            document.getElementById('btnCancelar').style.display = 'block';

            mensagem.textContent = '';

            window.scrollTo(0, 0);

        } catch (erro) {
            alert('Erro ao carregar componente para edição.');
            console.log(erro);
        }
    };


    // CANCELAR EDIÇÃO
    document.getElementById('btnCancelar').addEventListener('click', () => {

        idEmEdicao = null;
        form.reset();

        document.getElementById('tituloFormulario').textContent =
            'Cadastrar componente';

        document.getElementById('btnCadastrar').textContent =
            'Cadastrar componente';

        document.getElementById('btnCancelar').style.display = 'none';

        mensagem.textContent = '';
    });


    // EXCLUIR COMPONENTE
    window.excluirComponente = async function(id) {

        const confirmar = confirm('Deseja realmente excluir este componente?');

        if (!confirmar) return;

        try {

            const resposta = await fetch(
                `http://localhost:3001/componentes/${id}`,
                {
                    method: 'DELETE'
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.mensagem || 'Erro ao excluir componente');
            }

            mensagem.style.color = 'green';
            mensagem.textContent = dados.mensagem;

            carregarComponentes();

        } catch (erro) {
            mensagem.style.color = 'red';
            mensagem.textContent = erro.message;
        }
    };


    // BOTÃO SAIR
    document.getElementById('btnSair').addEventListener('click', () => {

        localStorage.removeItem('usuarioLogado');

        window.location.href = 'login.html';
    });


    // CARREGAR LISTA AO ABRIR A PÁGINA
    carregarComponentes();

}
