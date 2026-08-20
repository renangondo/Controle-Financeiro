import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Chart } from 'primereact/chart';
import LancamentoService from '../../services/LancamentoService';
import './Relatorios.css';

const lancamentoService = new LancamentoService();
const hoje = new Date();

const meses = [
    { label: 'Janeiro', value: 1 }, { label: 'Fevereiro', value: 2 }, { label: 'Março', value: 3 },
    { label: 'Abril', value: 4 }, { label: 'Maio', value: 5 }, { label: 'Junho', value: 6 },
    { label: 'Julho', value: 7 }, { label: 'Agosto', value: 8 }, { label: 'Setembro', value: 9 },
    { label: 'Outubro', value: 10 }, { label: 'Novembro', value: 11 }, { label: 'Dezembro', value: 12 }
];

const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const paletaCores = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b', '#8b5cf6', '#0ea5e9', '#ec4899', '#64748b'];

const Relatorios = () => {
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');

    const [mes, setMes] = useState(hoje.getMonth() + 1);
    const [ano, setAno] = useState(hoje.getFullYear());
    const [graficoDespesas, setGraficoDespesas] = useState(null);
    const [graficoReceitas, setGraficoReceitas] = useState(null);
    const [graficoHistorico, setGraficoHistorico] = useState(null);

    const montarGraficoPizza = (dados) => ({
        labels: dados.map((d) => d.categoria),
        datasets: [{
            data: dados.map((d) => d.total),
            backgroundColor: paletaCores
        }]
    });

    useEffect(() => {
        const carregar = async () => {
            try {
                const [respDespesas, respReceitas, respHistorico] = await Promise.all([
                    lancamentoService.buscarPorCategoria(usuario.id, 'DESPESA', mes, ano),
                    lancamentoService.buscarPorCategoria(usuario.id, 'RECEITA', mes, ano),
                    lancamentoService.buscarHistorico(usuario.id, 6)
                ]);

                setGraficoDespesas(respDespesas.data.length ? montarGraficoPizza(respDespesas.data) : null);
                setGraficoReceitas(respReceitas.data.length ? montarGraficoPizza(respReceitas.data) : null);

                const historico = respHistorico.data;
                setGraficoHistorico({
                    labels: historico.map((h) => `${nomesMeses[h.mes - 1]}/${h.ano}`),
                    datasets: [
                        { label: 'Entradas', data: historico.map((h) => h.totalReceitas), backgroundColor: '#16a34a', borderRadius: 6 },
                        { label: 'Saídas', data: historico.map((h) => h.totalDespesas), backgroundColor: '#dc2626', borderRadius: 6 }
                    ]
                });
            } catch (e) {
                console.error(e);
            }
        };
        carregar();
    }, [mes, ano, usuario.id]);

    const opcoesPizza = { plugins: { legend: { position: 'bottom', labels: { color: '#334155' } } } };
    const opcoesBarra = {
        plugins: { legend: { labels: { color: '#334155' } } },
        scales: {
            x: { ticks: { color: '#64748b' }, grid: { display: false } },
            y: { ticks: { color: '#64748b' }, grid: { color: '#eef3fb' } }
        }
    };

    return (
        <div className="pagina-relatorios">
            <header className="cabecalho-lancamentos">
                <h2>Relatórios</h2>
                <div className="seletor-periodo">
                    <Dropdown value={mes} options={meses} onChange={(e) => setMes(e.value)} />
                    <InputNumber value={ano} onValueChange={(e) => setAno(e.value)} useGrouping={false} style={{ width: '100px' }} />
                </div>
            </header>

            <section className="grade-relatorios">
                <div className="painel-grafico">
                    <h3>Despesas por categoria</h3>
                    {graficoDespesas
                        ? <Chart type="pie" data={graficoDespesas} options={opcoesPizza} />
                        : <p className="texto-vazio">Sem despesas cadastradas neste mês.</p>}
                </div>

                <div className="painel-grafico">
                    <h3>Receitas por categoria</h3>
                    {graficoReceitas
                        ? <Chart type="pie" data={graficoReceitas} options={opcoesPizza} />
                        : <p className="texto-vazio">Sem receitas cadastradas neste mês.</p>}
                </div>
            </section>

            <section className="painel-grafico painel-historico">
                <h3>Entradas x Saídas (últimos 6 meses)</h3>
                {graficoHistorico && <Chart type="bar" data={graficoHistorico} options={opcoesBarra} />}
            </section>
        </div>
    );
};

export default Relatorios;