import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Layout.css';

const grupos = [
    {
        titulo: 'Visão Geral',
        itens: [
            { label: 'Dashboard', icone: 'pi pi-home', rota: '/' }
        ]
    },
    {
        titulo: 'Financeiro',
        itens: [
            { label: 'Contas a Pagar', icone: 'pi pi-arrow-circle-down', rota: '/contas-pagar' },
            { label: 'Contas a Receber', icone: 'pi pi-arrow-circle-up', rota: '/contas-receber' },
            { label: 'Categorias', icone: 'pi pi-tags', rota: '/categorias' },
            { label: 'Relatórios', icone: 'pi pi-chart-bar', rota: '/relatorios' }
        ]
    },
    {
        titulo: 'Conta',
        itens: [
            { label: 'Meu Perfil', icone: 'pi pi-user', rota: '/perfil' }
        ]
    }
];

const Layout = () => {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);

    const sair = () => {
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('app-token');
        navigate('/login');
    };

    return (
        <div className="layout-dashboard">
            <button className="botao-menu-mobile" onClick={() => setMenuAberto(!menuAberto)}>
                <i className={menuAberto ? 'pi pi-times' : 'pi pi-bars'} />
            </button>

            {menuAberto && <div className="sobreposicao" onClick={() => setMenuAberto(false)} />}

            <aside className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}>
                <div className="topo-menu">
                    <span className="logo-app">💰 Controle Financeiro</span>
                </div>

                <nav className="navegacao">
                    {grupos.map((grupo) => (
                        <div className="grupo-menu" key={grupo.titulo}>
                            <span className="titulo-grupo">{grupo.titulo}</span>
                            {grupo.itens.map((item) => (
                                <NavLink
                                    key={item.rota}
                                    to={item.rota}
                                    end={item.rota === '/'}
                                    className={({ isActive }) => `item-menu ${isActive ? 'ativo' : ''}`}
                                    onClick={() => setMenuAberto(false)}
                                >
                                    <i className={item.icone} />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <button className="item-menu sair" onClick={sair}>
                    <i className="pi pi-sign-out" />
                    <span>Sair</span>
                </button>
            </aside>

            <main className="conteudo-dashboard">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;