package com.ifpr.backend.model;

public record ResumoPeriodo(
    Integer mes,
    Integer ano,
    Double totalReceitas,
    Double totalDespesas,
    Double saldo
) {}