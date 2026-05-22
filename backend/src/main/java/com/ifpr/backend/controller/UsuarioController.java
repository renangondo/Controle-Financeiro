package com.ifpr.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.service.UsuarioService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService service;


    @GetMapping
    public ResponseEntity<List<Usuario>> buscarTodos(){
        return ResponseEntity.ok(service.listarTodos());
    }
    
    @PostMapping
    public ResponseEntity<Usuario> inserir(@Valid @RequestBody Usuario usuario) {
        Usuario usuarioDB = service.inserir(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioDB);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorid(@PathVariable("id")Long id) {
        return ResponseEntity.ok(service.buscarPorid(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable("id") Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<Usuario> alterar(@Valid @RequestBody Usuario usuario) {
        Usuario usuarioDB = service.alterar(usuario);
        return ResponseEntity.ok(usuarioDB);
    }
}
