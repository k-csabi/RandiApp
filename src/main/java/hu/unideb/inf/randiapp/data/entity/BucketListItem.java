package hu.unideb.inf.randiapp.data.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class BucketListItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private boolean isCompleted;

    @ManyToOne
    @JoinColumn(name = "couple_id")
    private Couple couple;

    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;
}

