const cors = require('cors');
const express = require('express');
const conexao = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// ROTA INICIAL
app.get('/', (req, res) => {
    res.send('API Eletro Kurumin funcionando!');
});

// ==============================
// AUTENTICAÇÃO DE USUÁRIOS
// ==============================

// POST - CADASTRAR USUÁRIO
app.post('/usuarios/registrar', (req, res) => {

    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos!'
        });
    }

    const sql = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)';

    conexao.query(sql, [nome, email, senha], (erro, resultado) => {

        if (erro) {
            if (erro.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    mensagem: 'E-mail já cadastrado!'
                });
            }

            return res.status(500).json({
                mensagem: 'Erro ao cadastrar usuário'
            });
        }

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            id_usuario: resultado.insertId
        });
    });
});

// POST - REALIZAR LOGIN
app.post('/usuarios/login', (req, res) => {

    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            mensagem: 'Informe o e-mail e a senha!'
        });
    }

    const sql = 'SELECT * FROM usuario WHERE email = ? AND senha = ?';

    conexao.query(sql, [email, senha], (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                mensagem: 'Erro ao realizar login'
            });
        }

        if (resultados.length === 0) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos!'
            });
        }

        res.json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id_usuario: resultados[0].id_usuario,
                nome: resultados[0].nome,
                email: resultados[0].email
            }
        });
    });
});

// ==============================
// GESTÃO DE COMPONENTES
// ==============================

// GET - LISTAR COMPONENTES
app.get('/componentes', (req, res) => {

    conexao.query('SELECT * FROM componente', (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                mensagem: 'Erro ao buscar componentes'
            });
        }

        res.json(resultados);
    });
});

// POST - CADASTRAR COMPONENTE
app.post('/componentes', (req, res) => {

    const {
        nome,
        descricao,
        preco,
        quantidade_estoque,
        id_categoria,
        id_usuario
    } = req.body;

    conexao.query(
        `INSERT INTO componente
        (nome, descricao, preco, quantidade_estoque, id_categoria, id_usuario)
        VALUES (?, ?, ?, ?, ?, ?)`,

        [nome, descricao, preco, quantidade_estoque, id_categoria, id_usuario],

        (erro, resultados) => {

            if (erro) {
                console.log('ERRO NO POST:', erro);

                return res.status(500).json({
                    mensagem: 'Erro ao cadastrar componente',
                    erro: erro.message
                });
            }

            res.status(201).json({
                mensagem: 'Componente cadastrado com sucesso!',
                id: resultados.insertId
            });
        }
    );
});

// PUT - ATUALIZAR COMPONENTE
app.put('/componentes/:id', (req, res) => {

    const id = req.params.id;

    const {
        nome,
        descricao,
        preco,
        quantidade_estoque,
        id_categoria,
        id_usuario
    } = req.body;

    conexao.query(
        `UPDATE componente
        SET nome = ?, descricao = ?, preco = ?,
        quantidade_estoque = ?, id_categoria = ?, id_usuario = ?
        WHERE id_COMPONENTE = ?`,

        [nome, descricao, preco, quantidade_estoque, id_categoria, id_usuario, id],

        (erro, resultados) => {

            if (erro) {
                return res.status(500).json({
                    mensagem: 'Erro ao atualizar componente'
                });
            }

            if (resultados.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: 'Componente não encontrado'
                });
            }

            res.json({
                mensagem: 'Componente atualizado com sucesso!'
            });
        }
    );
});

// DELETE - EXCLUIR COMPONENTE
app.delete('/componentes/:id', (req, res) => {

    const id = req.params.id;

    conexao.query(
        'DELETE FROM componente WHERE id_COMPONENTE = ?',
        [id],

        (erro, resultados) => {

            if (erro) {
                return res.status(500).json({
                    mensagem: 'Erro ao excluir componente'
                });
            }

            if (resultados.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: 'Componente não encontrado'
                });
            }

            res.json({
                mensagem: 'Componente excluído com sucesso!'
            });
        }
    );
});

// ==============================
// INICIAR SERVIDOR
// ==============================

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
