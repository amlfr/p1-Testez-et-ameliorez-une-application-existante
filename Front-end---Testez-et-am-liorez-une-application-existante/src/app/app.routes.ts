import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { StudentDetailComponent } from './pages/student-detail/student-detail.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'studentDetail/:id',
    component: StudentDetailComponent,
    canActivate: [authGuard],
  },
];
