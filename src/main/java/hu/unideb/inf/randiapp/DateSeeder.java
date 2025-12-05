package hu.unideb.inf.randiapp;

import hu.unideb.inf.randiapp.data.entity.DateIdea;
import hu.unideb.inf.randiapp.data.repository.DateIdeaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DateSeeder implements CommandLineRunner {

    private final DateIdeaRepository dateIdeaRepository;

    public DateSeeder(DateIdeaRepository dateIdeaRepository) {
        this.dateIdeaRepository = dateIdeaRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (dateIdeaRepository.count() == 0) {
            System.out.println("--- 20 Alap Randi feltöltése... ---");

            add("Naplemente séta", "Séta a legközelebbi kilátóhoz.", List.of("KÜLTÉRI", "INGYENES", "ROMANTIKUS"));
            add("Otthoni Mozi", "Popcorn és Netflix.", List.of("BELTÉRI", "INGYENES", "PIHENŐS"));
            add("Közös főzés", "Olasz tészta est.", List.of("BELTÉRI", "KÖZEPES", "AKTÍV"));
            add("Étterem", "Próbáljatok ki egy új helyet.", List.of("BELTÉRI", "FIZETŐS", "ROMANTIKUS"));
            add("Piknik", "Szendvicsek a parkban.", List.of("KÜLTÉRI", "OLCSÓ", "ROMANTIKUS"));
            add("Társasjáték", "Versenyzzetek egymással!", List.of("BELTÉRI", "INGYENES", "AKTÍV"));
            add("Szabadulószoba", "Jussatok ki együtt.", List.of("BELTÉRI", "FIZETŐS", "IZGALMAS"));
            add("Biciklitúra", "Tekerjetek a szomszéd városba.", List.of("KÜLTÉRI", "INGYENES", "AKTÍV"));
            add("Múzeum", "Nézzetek meg egy kiállítást.", List.of("BELTÉRI", "FIZETŐS", "KULTÚRA"));
            add("Csillagnézés", "Menjetek ki a város szélére este.", List.of("KÜLTÉRI", "INGYENES", "ROMANTIKUS"));
            add("Korcsolyázás", "Télen kötelező!", List.of("KÜLTÉRI", "FIZETŐS", "AKTÍV"));
            add("Állatkert", "Séta az állatok között.", List.of("KÜLTÉRI", "FIZETŐS", "AKTÍV"));
            add("Borozás", "Borkóstoló otthon vagy bárban.", List.of("BELTÉRI", "FIZETŐS", "ROMANTIKUS"));
            add("Bowling", "Döntsétek a bábukat.", List.of("BELTÉRI", "FIZETŐS", "AKTÍV"));
            add("Cukrászda", "Egy süti mindig belefér.", List.of("BELTÉRI", "OLCSÓ", "ROMANTIKUS"));
            add("Fürdőzés", "Wellness hétvége vagy strand.", List.of("BELTÉRI", "FIZETŐS", "PIHENŐS"));
            add("Kirándulás", "Túra az erdőben.", List.of("KÜLTÉRI", "INGYENES", "AKTÍV"));
            add("Karaoke", "Énekeljetek (akár otthon is).", List.of("BELTÉRI", "INGYENES", "VICCES"));
            add("Piacozás", "Vegyetek friss zöldséget reggel.", List.of("KÜLTÉRI", "OLCSÓ", "AKTÍV"));
            add("Fotózás", "Csináljatok egymásról képeket.", List.of("KÜLTÉRI", "INGYENES", "KREATÍV"));

            System.out.println("--- Kész! ---");
        }
    }

    private void add(String title, String desc, List<String> tags) {
        DateIdea idea = new DateIdea();
        idea.setTitle(title);
        idea.setDescription(desc);
        idea.setTags(tags);
        idea.setCreatedBy(null);
        dateIdeaRepository.save(idea);
    }
}
