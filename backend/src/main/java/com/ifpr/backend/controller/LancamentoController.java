package com.ifpr.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ifpr.backend.model.Lancamento;
import com.ifpr.backend.model.ResumoMensal;
import com.ifpr.backend.service.LancamentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/lancamento")
@CrossOrigin
public class LancamentoController {

    @Autowired
    private LancamentoService service;

    @GetMapping
    public ResponseEntity<List<Lancamento>> listarPorMes(
            @RequestParam Long usuarioId,
            @RequestParam Integer mes,
            @RequestParam Integer ano) {
        return ResponseEntity.ok(service.listarPorMes(usuarioId, mes, ano));
    }

    @GetMapping("/resumo")
    public ResponseEntity<ResumoMensal> resumo(
            @RequestParam Long usuarioId,
            @RequestParam Integer mes,
            @RequestParam Integer ano) {
        return ResponseEntity.ok(service.calcularResumo(usuarioId, mes, ano));
    }

    @PostMapping
    public ResponseEntity<Lancamento> inserir(@Valid @RequestBody Lancamento lancamento) {
        Lancamento lancamentoDB = service.inserir(lancamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(lancamentoDB);
    }

    @PutMapping
    public ResponseEntity<Lancamento> alterar(@Valid @RequestBody Lancamento lancamento) {
        return ResponseEntity.ok(service.alterar(lancamento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable("id") Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}