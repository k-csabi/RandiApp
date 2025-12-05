package hu.unideb.inf.randiapp.data.repository;

import hu.unideb.inf.randiapp.data.entity.BucketListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BucketListRepository extends JpaRepository<BucketListItem, Long> {
    List<BucketListItem> findByCoupleId(Long coupleId);
}

