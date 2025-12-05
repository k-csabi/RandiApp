package hu.unideb.inf.randiapp.controller;

import hu.unideb.inf.randiapp.data.entity.BucketListItem;
import hu.unideb.inf.randiapp.service.BucketListService;
import hu.unideb.inf.randiapp.service.dto.BucketListItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bucketlist")
@RequiredArgsConstructor
public class BucketListController {

    private final BucketListService bucketListService;

    @GetMapping
    public List<BucketListItemDto> getList() {
        return bucketListService.getList();
    }

    @PostMapping
    public void add(@RequestBody BucketListItem item) {
        bucketListService.add(item);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        bucketListService.deleteItem(id);
    }

    @PutMapping("/{id}/toggle")
    public void toggle(@PathVariable Long id) {
        bucketListService.toggleComplete(id);
    }
}