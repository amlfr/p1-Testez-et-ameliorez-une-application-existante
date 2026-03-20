import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginModule } from './pages/login/login.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, LoginModule],
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'etudiant-frontend';
}
