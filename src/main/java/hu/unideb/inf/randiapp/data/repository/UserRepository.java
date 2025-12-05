package hu.unideb.inf.randiapp.data.repository;

import hu.unideb.inf.randiapp.data.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
