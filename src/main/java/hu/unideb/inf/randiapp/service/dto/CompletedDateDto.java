package hu.unideb.inf.randiapp.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CompletedDateDto {
    private Long id;
    private String dateTitle;
    private LocalDateTime completedAt;
    private String user1Name;
    private Integer ratingUser1;
    private String user2Name;
    private Integer ratingUser2;
    private String note;
    private Long dateIdeaId;
}