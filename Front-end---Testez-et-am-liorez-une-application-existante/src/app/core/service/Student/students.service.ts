import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../../models/Student';
import { User } from '../../models/Authentication';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private httpClient: HttpClient) {}

  createStudent(student: Student): Observable<Object> {
    return this.httpClient.post('/api/student/create', student);
  }

  getAllStudents(): Observable<Object> {
    return this.httpClient.get('/api/student/getall');
  }

  getStudentInfo(studentId: number): Observable<Student> {
    return this.httpClient.get<Student>(`/api/student/getInfo/${studentId}`);
  }

  updateStudent(student: Student, studentId: number): Observable<Student> {
    return this.httpClient.post<Student>(
      `/api/student/update/${studentId}`,
      student,
    );
  }

  deleteStudent(studentId: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/student/delete/${studentId}`);
  }
}
