import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Employee } from './employee.model';
import { Assessment } from '../assessment/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {


  private apiUrl = 'http://localhost:8081/employees';
  private coachUrl = 'http://localhost:8081/coach';
  private managerUrl = 'http://localhost:8081/managers';
  private assessmentUrl = 'http://localhost:8081/assessments';


  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/getAll`);
  }
  getOtherEmployees(id: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/getOtherEmployees/${id}`);
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
  getEmployeesByManagerId(id: number): Observable<Employee[]> {

    return this.http.get<Employee[]>(`${this.managerUrl}/${id}/employees-managed`);

  }
  getAssessmentsByEmployeeId(id: number): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.assessmentUrl}/employee/${id}`).pipe(
      map((assessments: Assessment[]) => {
        if (assessments && assessments.length > 0) {
          return assessments;
        } else {
          throw new Error('No assessments found.');
        }
      }),
      catchError((error: any) => {
        if (error.status === 404) {
          throw new Error('No assessments found.');
        } else {
          console.error(error);
          throw new Error('Error fetching assessments.');
        }
      })
    );
  }
  searchConsultantsBySkillsAndRatings(payload: any): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/search`, { params: payload });
  }
  

}
