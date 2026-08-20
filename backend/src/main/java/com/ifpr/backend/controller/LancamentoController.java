package com.ifpr.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.model.Lancamento;
import com.ifpr.backend.model.ResumoCategoria;
import com.ifpr.backend.model.ResumoMensal;
import com.ifpr.backend.model.ResumoPeriodo;
import com.ifpr.backend.model.TipoLancamento;
import com.ifpr.backend.service.LancamentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/lancamento")
@CrossOrigin
public class LancamentoController {

    @Autowired
    private LancamentoService service;

    @GetMapping
    public ResponseEntity<List<Lancamento>> listarPorMesETipo(
        @RequestParam Long usuarioId,
        @RequestParam TipoLancamento tipo,
        @RequestParam Integer mes,
        @RequestParam Integer ano) {
    return ResponseEntity.ok(service.listarPorMesETipo(usuarioId, tipo, mes, ano));
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

    @GetMapping("/pendentes")
        public ResponseEntity<List<Lancamento>> pendentes(
            @RequestParam Long usuarioId,
            @RequestParam Integer mes,
            @RequestParam Integer ano) {
        return ResponseEntity.ok(service.listarPendentes(usuarioId, mes, ano));
    }

    @GetMapping("/historico")
        public ResponseEntity<List<ResumoPeriodo>> historico(
            @RequestParam Long usuarioId,
            @RequestParam(defaultValue = "6") Integer meses) {
        return ResponseEntity.ok(service.calcularHistorico(usuarioId, meses));
    }

    @GetMapping("/por-categoria")
        public ResponseEntity<List<ResumoCategoria>> porCategoria(
            @RequestParam Long usuarioId,
            @RequestParam TipoLancamento tipo,
            @RequestParam Integer mes,
            @RequestParam Integer ano) {
        return ResponseEntity.ok(service.calcularPorCategoria(usuarioId, tipo, mes, ano));
    }
}