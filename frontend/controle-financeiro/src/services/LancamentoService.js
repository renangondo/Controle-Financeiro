import BaseService from './BaseService';

class LancamentoService extends BaseService {
    constructor() {
        super('/lancamento');
    }

    async listarPorMes(usuarioId, tipo, mes, ano) {
        const resposta = await this.api.get(this.endPoint, {
            params: { usuarioId, tipo, mes, ano }
        });
        return resposta;
}

    async buscarResumo(usuarioId, mes, ano) {
        const resposta = await this.api.get(`${this.endPoint}/resumo`, {
            params: { usuarioId, mes, ano }
        });
        return resposta;
    }
    async buscarPendentes(usuarioId, mes, ano) {
        const resposta = await this.api.get(`${this.endPoint}/pendentes`, {
            params: { usuarioId, mes, ano }
        });
        return resposta;
    }

    async buscarHistorico(usuarioId, meses = 6) {
        const resposta = await this.api.get(`${this.endPoint}/historico`, {
            params: { usuarioId, meses }
        });
    return resposta;
    }
}

export default LancamentoService;