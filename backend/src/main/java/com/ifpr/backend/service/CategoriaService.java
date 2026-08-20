package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Categoria;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.repository.CategoriaRepository;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Categoria inserir(Categoria categoria) {
        Usuario usuario = usuarioRepository.findById(categoria.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        categoria.setUsuario(usuario);
        return repository.save(categoria);
    }

    public List<Categoria> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioIdOrderByNomeAsc(usuarioId);
    }

    public Categoria buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
    }

    public void remover(Long id) {
        repository.delete(buscarPorId(id));
    }

    public Categoria alterar(Categoria categoria) {
        Categoria categoriaDb = buscarPorId(categoria.getId());
        categoriaDb.setNome(categoria.getNome());
        categoriaDb.setCor(categoria.getCor());
        return repository.save(categoriaDb);
    }
}