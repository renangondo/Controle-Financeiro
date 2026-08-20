import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import CategoriaService from '../../services/CategoriaService';
import './Categorias.css';

const categoriaService = new CategoriaService();

const Categorias = () => {
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');

    const [categorias, setCategorias] = useState([]);
    const [nome, setNome] = useState('');
    const [cor, setCor] = useState('#2563eb');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const carregarCategorias = async () => {
        setCarregando(true);
        try {
            const resposta = await categoriaService.listarPorUsuario(usuario.id);
            setCategorias(resposta.data);
        } catch (e) {
            setErro('Não foi possível carregar as categorias.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarCategorias();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const adicionarCategoria = async () => {
        if (!nome.trim()) {
            setErro('Digite o nome da categoria.');
            return;
        }
        setErro('');
        try {
            await categoriaService.inserir({ nome, cor, usuario: { id: usuario.id } });
            setNome('');
            setCor('#2563eb');
            carregarCategorias();
        } catch (e) {
            const mensagem = e?.response?.data?.mensagem || 'Não foi possível salvar a categoria.';
            setErro(mensagem);
        }
    };

    const excluirCategoria = async (id) => {
        try {
            await categoriaService.excluir(id);
            carregarCategorias();
        } catch (e) {
            setErro('Não foi possível excluir. Verifique se ela não está em uso em algum lançamento.');
        }
    };

    return (
        <div className="pagina-categorias">
            <h2>Categorias</h2>

            <div className="card-formulario-categoria">
                <input
                    type="color"
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                    className="seletor-cor"
                />
                <InputText
                    placeholder="Nome da categoria (ex: Moradia, Lazer...)"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <Button label="Adicionar" icon="pi pi-plus" onClick={adicionarCategoria} />
            </div>

            {erro && <Message severity="error" text={erro} />}

            <div className="lista-categorias">
                {carregando && <p>Carregando...</p>}
                {!carregando && categorias.length === 0 && (
                    <p className="texto-vazio">Nenhuma categoria cadastrada ainda.</p>
                )}
                {categorias.map((categoria) => (
                    <div className="item-categoria" key={categoria.id}>
                        <span className="bolinha-cor" style={{ backgroundColor: categoria.cor }} />
                        <span className="nome-categoria">{categoria.nome}</span>
                        <Button
                            icon="pi pi-trash"
                            text
                            severity="danger"
                            onClick={() => excluirCategoria(categoria.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categorias;