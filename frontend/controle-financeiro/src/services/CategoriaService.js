import BaseService from './BaseService';

class CategoriaService extends BaseService {
    constructor() {
        super('/categoria');
    }

    async listarPorUsuario(usuarioId) {
        const resposta = await this.api.get(this.endPoint, { params: { usuarioId } });
        return resposta;
    }
}

export default CategoriaService;