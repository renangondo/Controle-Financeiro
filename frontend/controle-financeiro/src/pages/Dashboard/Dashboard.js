import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import './Dashboard.css';

const grupos = [
    {
        titulo: 'Visão Geral',
        itens: [
            { chave: 'dashboard', label: 'Dashboard', icone: 'pi pi-home', rota: '/' }
        ]
    },
    {
        titulo: 'Financeiro',
        itens: [
            { chave: 'pagar', label: 'Contas a Pagar', icone: 'pi pi-arrow-circle-down' },
            { chave: 'receber', label: 'Contas a Receber', icone: 'pi pi-arrow-circle-up' },
            { chave: 'categorias', label: 'Categorias', icone: 'pi pi-tags' },
            { chave: 'relatorios', label: 'Relatórios', icone: 'pi pi-chart-bar' }
        ]
    },
    {
        titulo: 'Conta',
        itens: [
            { chave: 'perfil', label: 'Meu Perfil', icone: 'pi pi-user' }
        ]
    }
];

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const [menuAberto, setMenuAberto] = useState(false);

    const sair = () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('app-token');
        navigate('/login');
    };

    const irPara = (rota) => {
        if (rota) navigate(rota);
        setMenuAberto(false);
    };

    return (
        <div className="layout-dashboard">

            {/* Botão hambúrguer (aparece só no mobile) */}
            <button className="botao-menu-mobile" onClick={() => setMenuAberto(!menuAberto)}>
                <i className={menuAberto ? 'pi pi-times' : 'pi pi-bars'} />
            </button>

            {/* Fundo escuro ao abrir o menu no mobile */}
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
                                <button
                                    key={item.chave}
                                    className={`item-menu ${location.pathname === item.rota ? 'ativo' : ''}`}
                                    onClick={() => irPara(item.rota)}
                                >
                                    <i className={item.icone} />
                                    <span>{item.label}</span>
                                </button>
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
                <header className="topo-conteudo">
                    <h2>Olá, {usuario?.nome || 'Usuário'}</h2>
                    <Avatar
                        label={usuario?.nome ? usuario.nome[0].toUpperCase() : 'U'}
                        shape="circle"
                        style={{ backgroundColor: '#2563eb', color: '#fff' }}
                    />
                </header>

                <section className="cards-resumo">
                    <div className="card-resumo entrada">
                        <span className="rotulo">Entradas do mês</span>
                        <span className="valor">R$ 0,00</span>
                    </div>
                    <div className="card-resumo saida">
                        <span className="rotulo">Saídas do mês</span>
                        <span className="valor">R$ 0,00</span>
                    </div>
                    <div className="card-resumo saldo">
                        <span className="rotulo">Saldo</span>
                        <span className="valor">R$ 0,00</span>
                    </div>
                </section>

                <section className="area-vazia">
                    <p>Aqui vamos exibir as contas do mês, gráficos e lançamentos.</p>
                    <Button label="Novo lançamento" icon="pi pi-plus" />
                </section>
            </main>
        </div>
    );
};

export default Dashboard;