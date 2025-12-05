package hu.unideb.inf.randiapp.service.dto;

import lombok.Data;

@Data
public class CompletedDateRequest {
    private Long dateIdeaId;
    private Integer rating;
    private String note;
}