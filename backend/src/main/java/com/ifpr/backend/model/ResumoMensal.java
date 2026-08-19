package com.ifpr.backend.model;


public record ResumoMensal(
    Double totalReceitas,
    Double totalDespesas,
    Double saldo
) {}

// Usado record aqui porque é só um "pacote" de dados de saída, não precisa ser entidade de banco.)