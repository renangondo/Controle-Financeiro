import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import LancamentoService from '../../services/LancamentoService';
import './Lancamentos.css';

const lancamentoService = new LancamentoService();
const hoje = new Date();

const meses = [
    { label: 'Janeiro', value: 1 }, { label: 'Fevereiro', value: 2 }, { label: 'Março', value: 3 },
    { label: 'Abril', value: 4 }, { label: 'Maio', value: 5 }, { label: 'Junho', value: 6 },
    { label: 'Julho', value: 7 }, { label: 'Agosto', value: 8 }, { label: 'Setembro', value: 9 },
    { label: 'Outubro', value: 10 }, { label: 'Novembro', value: 11 }, { label: 'Dezembro', value: 12 }
];

const lancamentoVazio = { descricao: '', valor: null, pago: false, parcelaAtual: null, totalParcelas: null };

const ContasPagar = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    const [mes, setMes] = useState(hoje.getMonth() + 1);
    const [ano, setAno] = useState(hoje.getFullYear());
    const [lancamentos, setLancamentos] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const [novoLancamento, setNovoLancamento] = useState(lancamentoVazio);

    const carregarLancamentos = async () => {
        setCarregando(true);
        setErro('');
        try {
            const resposta = await lancamentoService.listarPorMes(usuario.id, mes, ano);
            setLancamentos(resposta.data);
        } catch (e) {
            setErro('Não foi possível carregar as contas a pagar.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarLancamentos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mes, ano]);

    const adicionarLancamento = async () => {
        if (!novoLancamento.descricao || !novoLancamento.valor) {
            setErro('Preencha a descrição e o valor.');
            return;
        }
        setErro('');
        try {
            await lancamentoService.inserir({
                ...novoLancamento,
                tipo: 'RECEITA',
                mes,
                ano,
                usuario: { id: usuario.id }
            });
            setNovoLancamento(lancamentoVazio);
            carregarLancamentos();
        } catch (e) {
            setErro('Não foi possível salvar a conta.');
        }
    };

    const alternarPago = async (lancamento) => {
        try {
            await lancamentoService.alterar({ ...lancamento, pago: !lancamento.pago });
            carregarLancamentos();
        } catch (e) {
            setErro('Não foi possível atualizar o status.');
        }
    };

    const excluirLancamento = async (id) => {
        try {
            await lancamentoService.excluir(id);
            carregarLancamentos();
        } catch (e) {
            setErro('Não foi possível excluir.');
        }
    };

    const totalMes = lancamentos.reduce((soma, l) => soma + l.valor, 0);

    return (
        <div className="pagina-lancamentos">
            <header className="cabecalho-lancamentos">
                <h2>Contas a Receber</h2>
                <div className="seletor-periodo">
                    <Dropdown value={mes} options={meses} onChange={(e) => setMes(e.value)} />
                    <InputNumber
                        value={ano}
                        onValueChange={(e) => setAno(e.value)}
                        useGrouping={false}
                        style={{ width: '100px' }}
                    />
                </div>
            </header>

            <div className="card-formulario">
                <InputText
                    placeholder="Descrição (ex: Aluguel, Netflix...)"
                    value={novoLancamento.descricao}
                    onChange={(e) => setNovoLancamento({ ...novoLancamento, descricao: e.target.value })}
                />
                <InputNumber
                    placeholder="Valor"
                    value={novoLancamento.valor}
                    onValueChange={(e) => setNovoLancamento({ ...novoLancamento, valor: e.value })}
                    mode="currency"
                    currency="BRL"
                    locale="pt-BR"
                />
                <InputNumber
                    placeholder="Parcela atual"
                    value={novoLancamento.parcelaAtual}
                    onValueChange={(e) => setNovoLancamento({ ...novoLancamento, parcelaAtual: e.value })}
                    style={{ width: '110px' }}
                />
                <InputNumber
                    placeholder="Total parcelas"
                    value={novoLancamento.totalParcelas}
                    onValueChange={(e) => setNovoLancamento({ ...novoLancamento, totalParcelas: e.value })}
                    style={{ width: '110px' }}
                />
                <div className="campo-checkbox">
                    <Checkbox
                        checked={novoLancamento.pago}
                        onChange={(e) => setNovoLancamento({ ...novoLancamento, pago: e.checked })}
                        inputId="pago"
                    />
                    <label htmlFor="pago">Já recebido</label>
                </div>
                <Button label="Adicionar" icon="pi pi-plus" onClick={adicionarLancamento} />
            </div>

            {erro && <Message severity="error" text={erro} />}

            <DataTable
                value={lancamentos}
                loading={carregando}
                className="tabela-lancamentos"
                emptyMessage="Nenhuma conta cadastrada neste mês."
            >
                <Column field="descricao" header="Descrição" />
                <Column header="Parcela" body={(l) => (l.totalParcelas ? `${l.parcelaAtual}/${l.totalParcelas}` : '-')} />
                <Column header="Valor" body={(l) => `R$ ${l.valor.toFixed(2).replace('.', ',')}`} />
                <Column
                    header="Status"
                    body={(l) => (
                        <span
                            className={`etiqueta-status ${l.pago ? 'Recebido' : 'A receber'}`}
                            onClick={() => alternarPago(l)}
                        >
                            {l.pago ? 'Pago' : 'Pendente'}
                        </span>
                    )}
                />
                <Column
                    header=""
                    body={(l) => (
                        <Button icon="pi pi-trash" text severity="danger" onClick={() => excluirLancamento(l.id)} />
                    )}
                />
            </DataTable>

            <div className="rodape-total">
                <span>Total do mês:</span>
                <strong>R$ {totalMes.toFixed(2).replace('.', ',')}</strong>
            </div>
        </div>
    );
};

export default ContasPagar;