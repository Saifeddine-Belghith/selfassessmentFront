import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee.model';
import { Assessment } from '../assessment/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  

  private apiUrl = 'http://localhost:8081/employees';
  private coachUrl = 'http://localhost:8081/coach';
  private assessmentUrl = 'http://localhost:8081/assessments';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/getAll`);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/AddEmployee`, employee);
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/update/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.apiUrl}/delete/${id}`);
  }

  getEmployeesByExperience(experienceLevel: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees/experience/${experienceLevel}`);
  }

  getMyProfile(email: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/myProfile?email=${email}`);
  }
  getCoach(): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/coach`);
  }

  getCoacheesByCoachId(id: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.coachUrl}/${id}/coachees`);
    
  }
  getAssessmentsByEmployeeId(id: number): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.assessmentUrl}/employee/${id}`);
  }

}
