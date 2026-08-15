package com.ifpr.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Lancamento;
import com.ifpr.backend.model.ResumoMensal;
import com.ifpr.backend.model.TipoLancamento;
import com.ifpr.backend.repository.LancamentoRepository;

@Service
public class LancamentoService {

    @Autowired
    private LancamentoRepository repository;

    public Lancamento inserir(Lancamento lancamento) {
        return repository.save(lancamento);
    }

    public List<Lancamento> listarPorMes(Long usuarioId, Integer mes, Integer ano) {
        return repository.findByUsuarioIdAndMesAndAnoOrderByDescricaoAsc(usuarioId, mes, ano);
    }

    public Lancamento buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lançamento não encontrado"));
    }

    public void remover(Long id) {
        Lancamento lancamento = buscarPorId(id);
        repository.delete(lancamento);
    }

    public Lancamento alterar(Lancamento lancamento) {
        Lancamento lancamentoDb = buscarPorId(lancamento.getId());
        lancamentoDb.setDescricao(lancamento.getDescricao());
        lancamentoDb.setValor(lancamento.getValor());
        lancamentoDb.setTipo(lancamento.getTipo());
        lancamentoDb.setMes(lancamento.getMes());
        lancamentoDb.setAno(lancamento.getAno());
        lancamentoDb.setPago(lancamento.isPago());
        lancamentoDb.setParcelaAtual(lancamento.getParcelaAtual());
        lancamentoDb.setTotalParcelas(lancamento.getTotalParcelas());

        return repository.save(lancamentoDb);
    }

    public ResumoMensal calcularResumo(Long usuarioId, Integer mes, Integer ano) {
        List<Lancamento> lancamentos = listarPorMes(usuarioId, mes, ano);

        BigDecimal totalReceitas = lancamentos.stream()
                .filter(l -> l.getTipo() == TipoLancamento.RECEITA)
                .map(Lancamento::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDespesas = lancamentos.stream()
                .filter(l -> l.getTipo() == TipoLancamento.DESPESA)
                .map(Lancamento::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saldo = totalReceitas.subtract(totalDespesas);

        return new ResumoMensal(totalReceitas, totalDespesas, saldo);
    }
}