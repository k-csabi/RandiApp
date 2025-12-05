package hu.unideb.inf.randiapp.controller;

import hu.unideb.inf.randiapp.data.entity.DateIdea;
import hu.unideb.inf.randiapp.service.DateIdeaService;
import hu.unideb.inf.randiapp.service.dto.DateIdeaDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dates")
@RequiredArgsConstructor
public class DateIdeaController {
    private final DateIdeaService dateIdeaService;

    @GetMapping
    public List<DateIdeaDto> getAllDates() {
        return dateIdeaService.getAllDates();
    }

    @PostMapping
    public DateIdea createDate(@RequestBody DateIdea dateIdea) {
        return dateIdeaService.createDate(dateIdea);
    }

    @DeleteMapping("/{id}")
    public void deleteDate(@PathVariable Long id) {
        dateIdeaService.deleteDate(id);
    }

    @PutMapping("/{id}")
    public void updateDate(@PathVariable Long id, @RequestBody DateIdeaDto dto) {
        dateIdeaService.updateDate(id, dto);
    }
}
