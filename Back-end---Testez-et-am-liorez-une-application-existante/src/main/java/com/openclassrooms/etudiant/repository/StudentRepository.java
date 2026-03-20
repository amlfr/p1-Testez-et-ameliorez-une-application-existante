package com.openclassrooms.etudiant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openclassrooms.etudiant.entities.Student;

public interface StudentRepository extends JpaRepository<Student, Long>{
}
