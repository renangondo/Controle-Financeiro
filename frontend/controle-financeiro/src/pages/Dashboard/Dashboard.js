import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import LancamentoService from '../../services/LancamentoService';
import './Dashboard.css';

const lancamentoService = new LancamentoService();
const hoje = new Date();

const Dashboard = () => {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const [resumo, setResumo] = useState({ totalReceitas: 0, totalDespesas: 0, saldo: 0 });
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarResumo = async () => {
            try {
                const resposta = await lancamentoService.buscarResumo(
                    usuario.id,
                    hoje.getMonth() + 1,
                    hoje.getFullYear()
                );
                setResumo(resposta.data);
            } catch (erro) {
                console.error(erro);
            } finally {
                setCarregando(false);
            }
        };
        carregarResumo();
    }, [usuario.id]);

    const formatar = (valor) => `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

    return (
        <>
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
                    <span className="valor">{carregando ? '...' : formatar(resumo.totalReceitas)}</span>
                </div>
                <div className="card-resumo saida">
                    <span className="rotulo">Saídas do mês</span>
                    <span className="valor">{carregando ? '...' : formatar(resumo.totalDespesas)}</span>
                </div>
                <div className="card-resumo saldo">
                    <span className="rotulo">Saldo</span>
                    <span className="valor">{carregando ? '...' : formatar(resumo.saldo)}</span>
                </div>
            </section>

            <section className="area-vazia">
                <p>Cadastre suas contas do mês para ver os detalhes aqui.</p>
                <Button label="Nova conta a pagar" icon="pi pi-plus" onClick={() => navigate('/contas-pagar')} />
            </section>
        </>
    );
};

export default Dashboard;