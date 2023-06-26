import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/employee-details/employee.model';
import { Assessment } from '../assessment.model';
//import { AssessmentDTO } from '../assessment/assessmentdto/assessmentdto.model';
interface AssessmentDTO {
  idSkill: number;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class ViewallassessmentService {

  private apiUrl = 'http://localhost:8081/assessments';

  constructor(private http: HttpClient) { }
  getAllAssessmentsByIdCoach(id: number, employeeId: number, assessments: AssessmentDTO[]): Observable<AssessmentDTO[]> {
    const employeeAssessmentDTO: any = {
      idEmployee: employeeId,
      assessments: assessments,
    };
    return this.http.get<AssessmentDTO[]>(`${this.apiUrl}/all/${id}`);
  }
  getAssessments(id: number): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.apiUrl}/all/${id}`);
  }
  getAllAssessments(): Observable<any[]> {
    const id = parseInt(localStorage.getItem('idEmployee') || '');
    const url = `${this.apiUrl}/all/${id}`;
    return this.http.get<any[]>(url);
  }
}
