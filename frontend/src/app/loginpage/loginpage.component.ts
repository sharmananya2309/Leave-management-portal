import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css'
})
export class LoginpageComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false; // ✅ Define showPassword

  handleLogin(event: Event) {
    event.preventDefault();
    
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: this.email, password: this.password })
    })
    .then(response => {
      if (!response.ok) throw new Error('Invalid credentials');
      return response.json();
    })
    .then(data => {
      console.log("logged in user", data);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("token", data.token);

      if (data.user.role === "hod") {
        window.location.href = '/hod';
      } else {
        window.location.href = "/staff";
      }
    })
    .catch(error => alert(error.message));
  }
}

