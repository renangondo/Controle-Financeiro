package com.ifpr.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ifpr.backend.model.Perfil;
import com.ifpr.backend.service.PerfilService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/perfil")
public class PerfilController {

    @Autowired
    private PerfilService service;

    @GetMapping
    public ResponseEntity<List<Perfil>> buscarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Perfil> inserir(@Valid @RequestBody Perfil perfil) {
        Perfil perfilDB = service.inserir(perfil);
        return ResponseEntity.status(HttpStatus.CREATED).body(perfilDB);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perfil> buscarPorid(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(service.buscarPorid(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable("id") UUID id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<Perfil> alterar(@Valid @RequestBody Perfil perfil) {
        Perfil perfilDB = service.alterar(perfil);
        return ResponseEntity.ok(perfilDB);
    }
}