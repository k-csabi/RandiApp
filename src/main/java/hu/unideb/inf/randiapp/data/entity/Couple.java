package hu.unideb.inf.randiapp.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.time.LocalDate;

@Entity
@Data
public class Couple {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String inviteCode;

    private LocalDate relationshipStart;

    @OneToMany(mappedBy = "couple")
    private List<User> partners;
}
