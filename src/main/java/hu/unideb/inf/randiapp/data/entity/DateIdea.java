package hu.unideb.inf.randiapp.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class DateIdea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    @ElementCollection
    private List<String> tags;

    @ManyToOne
    @JoinColumn(name = "created_by_couple_id")
    private Couple createdBy;
}