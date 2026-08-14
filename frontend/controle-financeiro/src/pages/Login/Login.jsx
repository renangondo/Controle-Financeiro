import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

import UsuarioService from '../../services/UsuarioService';

import './Login.css';

const usuarioService = new UsuarioService();

const Login = () => {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        email: '',
        senha: ''
    });

    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    };

    const realizarLogin = async (event) => {

        event.preventDefault();

        setErro('');
        setCarregando(true);

        try {

            const resposta = await usuarioService.login(usuario);

            console.log('Login realizado:', resposta.data);

            // Salva o usuário no navegador
            localStorage.setItem(
                'usuario',
                JSON.stringify(resposta.data)
            );

            // Depois vamos utilizar o token aqui
            if (resposta.data.token) {
                localStorage.setItem(
                    'app-token',
                    resposta.data.token
                );
            }

            navigate('/');

        } catch (erroLogin) {

            console.error(erroLogin);

            const mensagem =
                erroLogin?.response?.data?.mensagem ||
                'Email ou senha inválidos.';

            setErro(mensagem);

        } finally {

            setCarregando(false);

        }
    };

    return (

        <div className="pagina-autenticacao">

            <Card
                title="Login"
                className="cartao-autenticacao"
            >

                <form
                    onSubmit={realizarLogin}
                    className="formulario-autenticacao"
                >

                    <span className="p-float-label">

                        <InputText
                            id="login-email"
                            name="email"
                            value={usuario.email}
                            onChange={handleChange}
                            className="w-full"
                        />

                        <label htmlFor="login-email">
                            Email
                        </label>

                    </span>


                    <span className="p-float-label">

                        <Password
                            id="login-password"
                            name="senha"
                            value={usuario.senha}
                            onChange={handleChange}
                            feedback={false}
                            toggleMask
                            className="w-full"
                            inputClassName="w-full"
                        />

                        <label htmlFor="login-password">
                            Senha
                        </label>

                    </span>


                    {erro && (
                        <Message
                            severity="error"
                            text={erro}
                        />
                    )}


                    <Button
                        type="submit"
                        label="Entrar"
                        className="w-full"
                        loading={carregando}
                    />


                    <div className="links-autenticacao">

                        <span>
                            Ainda não possui uma conta?
                        </span>

                        <Link to="/cadastro">
                            Criar cadastro
                        </Link>

                    </div>

                </form>

            </Card>

        </div>

    );
};

export default Login;