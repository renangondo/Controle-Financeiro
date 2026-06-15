package com.ifpr.backend.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor  // construtor que recebe todos os atributos 
public class ErroResposta {
    private int status;
    private String menssagem;
    private LocalDateTime dataHora;
}
