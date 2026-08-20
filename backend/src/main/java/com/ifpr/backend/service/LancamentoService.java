package com.ifpr.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Categoria;
import com.ifpr.backend.model.Lancamento;
import com.ifpr.backend.model.ResumoCategoria;
import com.ifpr.backend.model.ResumoMensal;
import com.ifpr.backend.model.ResumoPeriodo;
import com.ifpr.backend.model.TipoLancamento;
import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.repository.CategoriaRepository;
import com.ifpr.backend.repository.LancamentoRepository;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class LancamentoService {

    @Autowired
    private LancamentoRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public Lancamento inserir(Lancamento lancamento) {
        Usuario usuario = usuarioRepository.findById(lancamento.getUsuario().getId())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        lancamento.setUsuario(usuario);

        if (lancamento.getCategoria() != null && lancamento.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(lancamento.getCategoria().getId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
            lancamento.setCategoria(categoria);
        } else {
            lancamento.setCategoria(null);
        }

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
        repository.delete(buscarPorId(id));
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

        if (lancamento.getCategoria() != null && lancamento.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(lancamento.getCategoria().getId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
            lancamentoDb.setCategoria(categoria);
        } else {
            lancamentoDb.setCategoria(null);
        }

        return repository.save(lancamentoDb);
    }

    public ResumoMensal calcularResumo(Long usuarioId, Integer mes, Integer ano) {
        List<Lancamento> lancamentos = listarPorMes(usuarioId, mes, ano);

        double totalReceitas = lancamentos.stream()
            .filter(l -> l.getTipo() == TipoLancamento.RECEITA)
            .mapToDouble(Lancamento::getValor)
            .sum();

        double totalDespesas = lancamentos.stream()
            .filter(l -> l.getTipo() == TipoLancamento.DESPESA)
            .mapToDouble(Lancamento::getValor)
            .sum();

        return new ResumoMensal(totalReceitas, totalDespesas, totalReceitas - totalDespesas);
    }

    public List<Lancamento> listarPorMesETipo(Long usuarioId, TipoLancamento tipo, Integer mes, Integer ano) {
        return repository.findByUsuarioIdAndTipoAndMesAndAnoOrderByDescricaoAsc(usuarioId, tipo, mes, ano);
    }

    public List<Lancamento> listarPendentes(Long usuarioId, Integer mes, Integer ano) {
        return listarPorMes(usuarioId, mes, ano).stream()
            .filter(l -> !l.isPago())
            .toList();
    }   

    public List<ResumoPeriodo> calcularHistorico(Long usuarioId, int quantidadeMeses) {
        List<ResumoPeriodo> resultado = new ArrayList<>();
        LocalDate hoje = LocalDate.now();

        for (int i = quantidadeMeses - 1; i >= 0; i--) {
            LocalDate referencia = hoje.minusMonths(i);
            ResumoMensal resumo = calcularResumo(usuarioId, referencia.getMonthValue(), referencia.getYear());
            resultado.add(new ResumoPeriodo(
                referencia.getMonthValue(),
                referencia.getYear(),
                resumo.totalReceitas(),
                resumo.totalDespesas(),
                resumo.saldo()
            ));
        }

    return resultado;
    }

    public List<ResumoCategoria> calcularPorCategoria(Long usuarioId, TipoLancamento tipo, Integer mes, Integer ano) {
        List<Lancamento> lancamentos = listarPorMesETipo(usuarioId, tipo, mes, ano);

        Map<String, Double> totais = new LinkedHashMap<>();
        for (Lancamento l : lancamentos) {
            String nome = l.getCategoria() != null ? l.getCategoria().getNome() : "Sem categoria";
            totais.merge(nome, l.getValor(), Double::sum);
        }

        return totais.entrySet().stream()
            .map(e -> new ResumoCategoria(e.getKey(), e.getValue()))
            .toList();
    }
}