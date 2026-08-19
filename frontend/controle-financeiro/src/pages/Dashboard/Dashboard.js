import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import LancamentoService from '../../services/LancamentoService';
import './Dashboard.css';

const lancamentoService = new LancamentoService();
const hoje = new Date();
const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const Dashboard = () => {
    const navigate = useNavigate();
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');    const [resumo, setResumo] = useState({ totalReceitas: 0, totalDespesas: 0, saldo: 0 });
    const [pendentes, setPendentes] = useState([]);
    const [dadosGrafico, setDadosGrafico] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [respostaResumo, respostaPendentes, respostaHistorico] = await Promise.all([
                    lancamentoService.buscarResumo(usuario.id, hoje.getMonth() + 1, hoje.getFullYear()),
                    lancamentoService.buscarPendentes(usuario.id, hoje.getMonth() + 1, hoje.getFullYear()),
                    lancamentoService.buscarHistorico(usuario.id, 6)
                ]);

                setResumo(respostaResumo.data);
                setPendentes(respostaPendentes.data);

                const historico = respostaHistorico.data;
                setDadosGrafico({
                    labels: historico.map((h) => `${nomesMeses[h.mes - 1]}/${h.ano}`),
                    datasets: [
                        {
                            label: 'Entradas',
                            data: historico.map((h) => h.totalReceitas),
                            backgroundColor: '#16a34a',
                            borderRadius: 6
                        },
                        {
                            label: 'Saídas',
                            data: historico.map((h) => h.totalDespesas),
                            backgroundColor: '#dc2626',
                            borderRadius: 6
                        }
                    ]
                });
            } catch (erro) {
                console.error(erro);
            } finally {
                setCarregando(false);
            }
        };
        carregarDados();
    }, [usuario.id]);

    const formatar = (valor) => `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;

    const opcoesGrafico = {
        plugins: { legend: { labels: { color: '#334155' } } },
        scales: {
            x: { ticks: { color: '#64748b' }, grid: { display: false } },
            y: { ticks: { color: '#64748b' }, grid: { color: '#eef3fb' } }
        }
    };

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

            <section className="grade-dashboard">
                <div className="painel-grafico">
                    <h3>Entradas x Saídas (últimos 6 meses)</h3>
                    {dadosGrafico && <Chart type="bar" data={dadosGrafico} options={opcoesGrafico} />}
                </div>

                <div className="painel-pendentes">
                    <h3>Pendentes deste mês</h3>
                    {pendentes.length === 0 && <p className="texto-vazio">Nenhuma pendência este mês.</p>}
                    <ul className="lista-pendentes">
                        {pendentes.map((l) => (
                            <li key={l.id} onClick={() => navigate(l.tipo === 'DESPESA' ? '/contas-pagar' : '/contas-receber')}>
                                <div>
                                    <span className="descricao-pendente">{l.descricao}</span>
                                    <span className={`etiqueta-tipo ${l.tipo.toLowerCase()}`}>
                                        {l.tipo === 'DESPESA' ? 'A pagar' : 'A receber'}
                                    </span>
                                </div>
                                <strong>{formatar(l.valor)}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="painel-acoes">
                <h3>Ações rápidas</h3>
                <div className="acoes-rapidas">
                    <Button label="Nova conta a pagar" icon="pi pi-plus" onClick={() => navigate('/contas-pagar')} />
                    <Button
                        label="Nova conta a receber"
                        icon="pi pi-plus"
                        severity="success"
                        onClick={() => navigate('/contas-receber')}
                    />
                </div>
            </section>
        </>
    );
};

export default Dashboard;