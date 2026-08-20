package com.ifpr.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByUsuarioIdOrderByNomeAsc(Long usuarioId);


}