package com.openclassrooms.etudiant.controller;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.etudiant.service.StudentService;
import com.openclassrooms.etudiant.entities.Student;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import lombok.RequiredArgsConstructor;

import com.openclassrooms.etudiant.mapper.StudentDTOMapper;
import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentLastNameDTO;


@RestController
@RequestMapping
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final StudentDTOMapper studentDTOMapper;

    @PostMapping("/api/student/create")
    public ResponseEntity<?> create(@RequestBody StudentRequestDTO studentRequestDTO) {
        Student newStudent = studentService.create(studentDTOMapper.toEntity(studentRequestDTO));
        return new ResponseEntity<>(studentDTOMapper.toDto(newStudent), HttpStatus.CREATED);
    }

    @GetMapping("/api/student/getall")
    public ResponseEntity<?> getAll() {
        List<Student> students = studentService.findAll();
        List<StudentLastNameDTO> dtoList = students.stream()
                .map(student -> new StudentLastNameDTO(student.getId(),student.getLastName()))
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/api/student/getInfo/{id}")
        public ResponseEntity<?> getInfo(@PathVariable Long id) {
        return studentService.findById(id)
            .map(student -> ResponseEntity.ok(studentDTOMapper.toDto(student)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/student/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody StudentRequestDTO studentRequestDTO) {
        return studentService.findById(id)
                .map(existingStudent -> {
                    studentDTOMapper.updateEntity(existingStudent, studentRequestDTO);
                    Student updated = studentService.update(existingStudent);
                    return ResponseEntity.ok(studentDTOMapper.toDto(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/student/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return studentService.findById(id)
                .map(student -> {
                    studentService.delete(student);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    } 
}
