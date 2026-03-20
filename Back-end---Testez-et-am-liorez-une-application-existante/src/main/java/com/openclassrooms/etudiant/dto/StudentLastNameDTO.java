package com.openclassrooms.etudiant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentLastNameDTO  {
    @NotBlank
    private long id;

    @NotBlank
    private String lastName;
}
