import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { StudentsService } from '../../core/service/Student/students.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Student } from '../../core/models/Student';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css',
})
export class StudentListComponent implements OnInit {
  private router = inject(Router);
  students: Student[] = [];
  studentForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private studentsService: StudentsService,
  ) {}

  ngOnInit() {
    this.studentForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
    });
    this.loadAllStudent();
  }

  loadAllStudent() {
    this.studentsService.getAllStudents().subscribe({
      next: (data: any) => (this.students = data),
      error: (err) => console.error('Failed to load students', err),
    });
  }

  onSubmit() {
    console.log('fire create btn');
    const student = this.studentForm.value;
    this.studentsService.createStudent(student).subscribe(() => {
      alert('SUCCESS!! :-)');
      this.loadAllStudent();
    });
  }
  getStudentInfo(studentId: number) {
    console.log('fire delete btn');
    this.router.navigate(['/studentDetail', studentId]);
  }
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
