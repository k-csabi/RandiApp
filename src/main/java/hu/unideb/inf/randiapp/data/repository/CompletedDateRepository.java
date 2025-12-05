package hu.unideb.inf.randiapp.data.repository;

import hu.unideb.inf.randiapp.data.entity.CompletedDate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CompletedDateRepository extends JpaRepository<CompletedDate, Long> {
    List<CompletedDate> findByCoupleIdOrderByCompletedAtDesc(Long coupleId);
    Optional<CompletedDate> findByCoupleIdAndDateIdeaId(Long coupleId, Long dateIdeaId);
}
