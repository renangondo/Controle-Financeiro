package com.ifpr.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.model.Lancamento;
import com.ifpr.backend.model.TipoLancamento;

public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {

    List<Lancamento> findByUsuarioIdAndMesAndAnoOrderByDescricaoAsc(Long usuarioId, Integer mes, Integer ano);

    List<Lancamento> findByUsuarioIdAndTipoAndMesAndAnoOrderByDescricaoAsc(
            Long usuarioId, TipoLancamento tipo, Integer mes, Integer ano);

}