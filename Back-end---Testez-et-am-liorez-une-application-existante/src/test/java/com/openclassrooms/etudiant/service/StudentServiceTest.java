package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.util.List;

@ExtendWith(SpringExtension.class)
public class StudentServiceTest {
    private static final int STUDENT_ID = 15;
    private static final String FIRST_NAME = "Jean-Jacques";
    private static final String LAST_NAME = "Rousseau";
    private static final LocalDate DATE_OF_BIRTH = LocalDate.of(1997, 7, 7);

    @Mock
    private StudentRepository studentRepository;
    @InjectMocks
    private StudentService studentService;


    @Test
    public void test_create_student() {
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setDateOfBirth(DATE_OF_BIRTH);
        student.setId(STUDENT_ID);
        when(studentRepository.save(student)).thenReturn(student);

        // WHEN
        Student result = studentService.create(student);

        // THEN
        ArgumentCaptor<Student> studentCaptor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).save(studentCaptor.capture());
        assertThat(result).isEqualTo(student);
        assertThat(studentCaptor.getValue()).isEqualTo(student);
    }

    @Test
    public void test_findAll_students() {
        // GIVEN
        Student student1 = new Student();
        student1.setId(15);
        student1.setFirstName(FIRST_NAME);
        student1.setLastName(LAST_NAME);
        student1.setDateOfBirth(DATE_OF_BIRTH);

        Student student2 = new Student();
        student2.setId(12);
        student2.setFirstName("Alice");
        student2.setLastName("Smith");
        student2.setDateOfBirth(LocalDate.of(1998, 5, 15));

        List<Student> students = List.of(student1, student2);
        when(studentRepository.findAll()).thenReturn(students);

        // WHEN
        List<Student> result = studentService.findAll();

        // THEN
        verify(studentRepository).findAll();
        assertThat(result).hasSize(2);
        assertThat(result).isEqualTo(students);
    }

    @Test
    public void test_findById_student() {
        // GIVEN
        Student student = new Student();
        student.setId(STUDENT_ID);
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setDateOfBirth(DATE_OF_BIRTH);
        when(studentRepository.findById((long) STUDENT_ID)).thenReturn(Optional.of(student));

        // WHEN
        Optional<Student> result = studentService.findById((long) STUDENT_ID);

        // THEN
        verify(studentRepository).findById((long) STUDENT_ID);
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(student);
    }

    @Test
    public void test_update_student() {
        // GIVEN
        Student student = new Student();
        student.setId(STUDENT_ID);
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setDateOfBirth(DATE_OF_BIRTH);
        when(studentRepository.save(student)).thenReturn(student);

        // WHEN
        Student result = studentService.update(student);

        // THEN
        ArgumentCaptor<Student> studentCaptor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).save(studentCaptor.capture());
        assertThat(result).isEqualTo(student);
        assertThat(studentCaptor.getValue()).isEqualTo(student);
    }

    @Test
    public void test_delete_student() {
        // GIVEN
        Student student = new Student();
        student.setId(STUDENT_ID);
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setDateOfBirth(DATE_OF_BIRTH);

        // WHEN
        studentService.delete(student);

        // THEN
        ArgumentCaptor<Student> studentCaptor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).delete(studentCaptor.capture());
        assertThat(studentCaptor.getValue()).isEqualTo(student);
    }
}
