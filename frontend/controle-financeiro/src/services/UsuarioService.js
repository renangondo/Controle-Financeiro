import BaseService from "./BaseService";

class UsuarioService extends BaseService {
    constructor() {
        super ('/usuario');
    }
}

export default UsuarioService;


try {
    await UsuarioService.service.inserir(dados);
    setSucesso('Cadastro realizado com sucesso');

    setNome("");
    setEmail("");
    setSenha("")
    setConfirmacaoSenha("")
} catch (erroCadastro) {}