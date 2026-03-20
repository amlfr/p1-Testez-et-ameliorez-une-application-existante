import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../../core/service/Student/students.service';
import { Student } from '../../core/models/Student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent implements OnInit {
  studentForm!: FormGroup;
  studentId!: number;
  currentStudent!: Student;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentsService,
  ) {}

  ngOnInit(): void {
    this.studentId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadStudent();
  }

  initForm() {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    });
  }

  loadStudent() {
    this.studentService.getStudentInfo(this.studentId).subscribe({
      next: (student) => {
        this.currentStudent = student;
      },
      error: (err) => console.error(err),
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const updatedStudent = this.studentForm.value;
      this.studentService
        .updateStudent(updatedStudent, this.studentId)
        .subscribe({
          next: () => {
            alert('Student updated successfully');
            this.loadStudent();
          },
          error: (err) => console.error(err),
        });
    }
  }

  deleteStudent() {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(this.studentId).subscribe({
        next: () => {
          alert('Student updated successfully');
          this.router.navigate(['/students']);
        },
        error: (err) => console.error(err),
      });
    }
  }
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
