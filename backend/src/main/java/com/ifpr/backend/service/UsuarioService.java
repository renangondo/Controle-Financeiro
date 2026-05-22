package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public Usuario inserir(Usuario usuario) {
        return repository.save(usuario);
    }
    

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public Usuario buscarPorid(Long id) {
        Usuario usuario = repository.findById(id).orElseThrow(() ->new RuntimeException("Usuario não encontrado"));

        return usuario;
    }

    public void remover(Long id) {
        repository.deleteById(id);;
    }

    public Usuario alterar(Usuario usuario) {
        Usuario usuarioDb = buscarPorid(usuario.getId());
        usuarioDb.setNome(usuario.getNome());
        usuarioDb.setEmail(usuario.getEmail());

        return repository.save(usuarioDb);

    }
}
