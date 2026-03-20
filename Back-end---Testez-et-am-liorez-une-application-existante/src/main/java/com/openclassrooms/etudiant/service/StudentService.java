package com.openclassrooms.etudiant.service;

import org.springframework.stereotype.Service;

import com.openclassrooms.etudiant.repository.StudentRepository;
import com.openclassrooms.etudiant.entities.Student;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {
    private final StudentRepository studentRepository;

    public Student create(Student student) {
        Objects.requireNonNull(student, "student must be not null");
        log.info("Registering new student");
        return studentRepository.save(student);
    }

    public List<Student> findAll() { 
        log.info("Getting the list of all student associated with the user");

        return studentRepository.findAll();
    }

    public Optional<Student> findById(Long id) { 
        Objects.requireNonNull(id, "id must be not null");
        log.info("Getting all the infos of the student");
        
        return studentRepository.findById(id);
    }

    public Student update(Student student) { 
        Objects.requireNonNull(student, "student must be not null");
        log.info("Updating a student with provided new infos");

        return studentRepository.save(student);
    }

    public void delete(Student student) { 
        Objects.requireNonNull(student, "student must be not null");
        log.info("Deleting the provided student");

        studentRepository.delete(student);
    }
}
