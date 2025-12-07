package hu.unideb.inf.randiapp.service;

import hu.unideb.inf.randiapp.data.entity.BucketListItem;
import hu.unideb.inf.randiapp.data.entity.User;
import hu.unideb.inf.randiapp.data.repository.BucketListRepository;
import hu.unideb.inf.randiapp.data.repository.UserRepository;
import hu.unideb.inf.randiapp.service.dto.BucketListItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BucketListService {

    private final BucketListRepository bucketListRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public List<BucketListItemDto> getList() {
        User user = getCurrentUser();
        List<BucketListItem> items = bucketListRepository.findByCoupleId(user.getCouple().getId());

        return items.stream().map(item -> new BucketListItemDto(
                item.getId(),
                item.getTitle(),
                item.isCompleted(),
                item.getCreatedBy() != null ? item.getCreatedBy().getName() : "Ismeretlen"
        )).toList();
    }

    public void add(BucketListItem item) {
        User user = getCurrentUser();
        item.setCouple(user.getCouple());
        item.setCreatedBy(user);
        item.setCompleted(false);
        bucketListRepository.save(item);
    }

    public void deleteItem(Long id) {
        if(bucketListRepository.existsById(id)) {
            bucketListRepository.deleteById(id);
        }
    }

    public void toggleComplete(Long id) {
        BucketListItem item = bucketListRepository.findById(id).orElseThrow();
        item.setCompleted(!item.isCompleted());
        bucketListRepository.save(item);
    }
}