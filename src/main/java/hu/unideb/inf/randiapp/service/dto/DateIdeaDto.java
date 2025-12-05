package hu.unideb.inf.randiapp.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DateIdeaDto {
    private Long id;
    private String title;
    private String description;
    private List<String> tags;
    private boolean isOwn;
}