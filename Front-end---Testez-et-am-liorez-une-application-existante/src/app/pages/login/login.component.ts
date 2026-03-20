import { Component, inject } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { UserService } from '../../core/service/User/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, RouterLink],
})
export class LoginComponent {
  private router = inject(Router);
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private UserService: UserService,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  onSubmit() {
    console.log('fire submit btn');
    const user = this.loginForm.value;
    this.UserService.login(user).subscribe(() => {
      this.router.navigate(['/students']);
    });
  }
}
