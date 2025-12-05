package hu.unideb.inf.randiapp.controller;

import hu.unideb.inf.randiapp.service.dto.CompletedDateDto;
import hu.unideb.inf.randiapp.service.dto.CompletedDateRequest;
import hu.unideb.inf.randiapp.data.entity.CompletedDate;
import hu.unideb.inf.randiapp.service.CompletedDateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class CompletedDateController {

    private final CompletedDateService service;

    @PostMapping
    public void logDate(@RequestBody CompletedDateRequest request) {
        service.logDate(request);
    }

    @GetMapping
    public List<CompletedDateDto> getHistory() {
        return service.getHistory();
    }

    @PutMapping("/{id}")
    public void updateLog(@PathVariable Long id, @RequestBody CompletedDateRequest request) {
        service.updateLog(id, request);
    }
}