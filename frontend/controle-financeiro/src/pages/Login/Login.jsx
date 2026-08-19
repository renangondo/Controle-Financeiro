import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

import UsuarioService from '../../services/UsuarioService';

import '../Autenticacao.css';

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

            sessionStorage.setItem('usuario', JSON.stringify(resposta.data));

            if (resposta.data.token) {
                sessionStorage.setItem('app-token', resposta.data.token);
            }

            navigate('/');

        } catch (erroLogin) {

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

            <Card title="Login" className="cartao-autenticacao">

                <form onSubmit={realizarLogin} className="formulario-autenticacao">

                    <div className="campo-formulario">
                        <label htmlFor="login-email">Email</label>
                        <InputText
                            id="login-email"
                            name="email"
                            value={usuario.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="campo-formulario">
                        <label htmlFor="login-password">Senha</label>
                        <Password
                            id="login-password"
                            name="senha"
                            value={usuario.senha}
                            onChange={handleChange}
                            feedback={false}
                            toggleMask
                            inputClassName="w-full"
                        />
                    </div>

                    {erro && <Message severity="error" text={erro} />}

                    <Button
                        type="submit"
                        label="Entrar"
                        loading={carregando}
                    />

                    <div className="links-autenticacao">
                        <span>Ainda não possui uma conta? </span>
                        <Link to="/cadastro">Criar cadastro</Link>
                    </div>

                </form>

            </Card>

        </div>

    );
};

export default Login;