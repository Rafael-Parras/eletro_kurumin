
const express = require('express');
const conexao = require('../db');

const router = express.Router();

// CADASTRO
router.post('/registrar', (req, res) => {
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
            mensagem: 'Usuário cadastrado com sucesso!'
        });
    });
});

// LOGIN
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const sql = 'SELECT * FROM usuario WHERE email = ? AND senha = ?';

    conexao.query(sql, [email, senha], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({
                mensagem: 'Erro ao realizar login'
            });
        }

        if (resultado.length === 0) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos!'
            });
        }

        res.json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id_usuario: resultado[0].id_usuario,
                nome: resultado[0].nome,
                email: resultado[0].email
            }
        });
    });
});

module.exports = router;
