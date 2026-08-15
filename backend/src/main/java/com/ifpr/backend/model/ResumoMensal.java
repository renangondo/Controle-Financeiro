package com.ifpr.backend.model;

import java.math.BigDecimal;

public record ResumoMensal(
    BigDecimal totalReceitas,
    BigDecimal totalDespesas,
    BigDecimal saldo
) {}

// Usado record aqui porque é só um "pacote" de dados de saída, não precisa ser entidade de banco.)