package hu.unideb.inf.randiapp.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BucketListItemDto {
    private Long id;
    private String title;
    private boolean isCompleted;
    private String createdByName;
}


