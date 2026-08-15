package com.ifpr.backend.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Lancamento {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message= "Descrição obrigatorio")
    private  String descrico;

    @NotNull(message= "Valor Obrigatório")
    private BigDecimal valor; 

    @Enumerated(EnumType.STRING)
    @NotNull(message= "Tipo obrigatório (DESPESA ou RECEITA)")
    private TipoLancamento tipo;

    @NotNull(message = "Mês obrigatório")
    private Integer mes; // 1 a 12

    @NotNull(message = "Ano obrigatório")
    private Integer ano;

    private boolean pago = false;

    // Parcelamento (opcional) - ex: parcelaAtual=2, totalParcelas=4 -> "2/4"
    private Integer parcelaAtual;
    private Integer totalParcelas;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @NotNull(message = "Usuário obrigatório")
    private Usuario usuario;
}
    
