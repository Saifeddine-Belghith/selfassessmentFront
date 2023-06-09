import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../employee-details/employee.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  idEmployee!: number;


  constructor(private router: Router, private http: HttpClient) { }

  Login() {
    const bodyData = {
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:8081/login', bodyData).subscribe((resultData: any) => {
      console.log('result:', resultData);
      if (resultData.message === 'Email does not exist') {
        alert('Email does not exist');
      } else if (resultData.message === 'password Not Match') {
        alert('Incorrect email or password');
      } else if (resultData.message === 'Login Success') {
        // Set the idEmployee property of the component
        this.idEmployee = resultData.idEmployee;
        // Store the idEmployee in local storage
        localStorage.setItem('idEmployee', resultData.idEmployee);
        //console.log('id Employee:' + this.idEmployee);
        // Redirect to employee details page with the employee ID
        this.router.navigateByUrl(`/home`);
      }
    });
  }
}
