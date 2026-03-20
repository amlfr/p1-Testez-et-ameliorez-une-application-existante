package com.openclassrooms.etudiant.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.Mapping;

import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;

@Mapper(componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface StudentDTOMapper {
    @Mapping(
      target = "dateOfBirth",
      source = "dateOfBirth",
      dateFormat = "yyyy-MM-dd"
    )
    StudentResponseDTO toDto(Student student);

    @Mapping(target = "id", ignore = true)
    Student toEntity(StudentRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    void updateEntity(@MappingTarget Student student, StudentRequestDTO dto);
}
