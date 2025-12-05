package hu.unideb.inf.randiapp.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class CompletedDate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Couple couple;

    @ManyToOne
    @JsonIgnoreProperties({"createdBy", "couple"})
    private DateIdea dateIdea;

    private LocalDateTime completedAt;
    private Integer ratingUser1;
    private Integer ratingUser2;
    private String note;

    @ManyToOne
    @JsonIgnoreProperties({"couple", "password"})
    private User initiator;
}