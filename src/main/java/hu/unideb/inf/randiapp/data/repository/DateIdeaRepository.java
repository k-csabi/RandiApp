package hu.unideb.inf.randiapp.data.repository;

import hu.unideb.inf.randiapp.data.entity.DateIdea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DateIdeaRepository extends JpaRepository<DateIdea, Long> {

    @Query("""
        SELECT d FROM DateIdea d 
        WHERE (d.createdBy IS NULL OR d.createdBy.id = :coupleId)
        AND d.id NOT IN (
            SELECT c.dateIdea.id FROM CompletedDate c WHERE c.couple.id = :coupleId
        )
    """)
    List<DateIdea> findAllForCouple(Long coupleId);
}