package hu.unideb.inf.randiapp.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String coupleCode;
    private String partnerName;
    private int completedDatesCount;
    private String avatar;
    private String partnerAvatar;
    private String relationshipStart;
}


