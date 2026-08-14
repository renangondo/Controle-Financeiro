import BaseService from "./BaseService";

class UsuarioService extends BaseService {
    constructor() {
        super ('/usuario');
    }

    async login(dados) {
        const resposta = await this.api.post(
            `${this.endPoint}/login`, dados
        );
        return resposta;
    }
}

export default UsuarioService;


