import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assessment } from '../assessment/assessment.model';

interface AssessmentDTO {
    idSkill: number;
    rating: number;
}
@Injectable({
    providedIn: 'root'
})
export class AssessmentService {

    private apiUrl = 'http://10.66.12.54:8081/assessments';

    constructor(private http: HttpClient) { }

    getAssessments(id: number): Observable<Assessment[]> {
        id = parseInt(localStorage.getItem('idEmployee') || '');
        return this.http.get<Assessment[]>(`${this.apiUrl}/all/${id}`);
    }

    // saveAssessment(assessment: Assessment): Observable<Assessment> {
    //     return this.http.post<Assessment>(this.apiUrl +'/create', assessment);
    // }
    saveAssessments(employeeId: number, assessments: AssessmentDTO[]): Observable<AssessmentDTO[]> {
        const employeeAssessmentDTO: any = {
            idEmployee: employeeId,
            assessments: assessments,
        };
        return this.http.post<Assessment[]>(`${this.apiUrl}/saveAssessments`, employeeAssessmentDTO);
    }
    getAllAssessments(): Observable<any[]> {
        const id = parseInt(localStorage.getItem('idEmployee') || '');
        const url = `${this.apiUrl}//all/${id}`;
        return this.http.get<any[]>(url);
    }
    getAssessmentsByEmployeeId(id: number): Observable<Assessment[]> {
        return this.http.get<Assessment[]>(`${this.apiUrl}/employee/${id}`);
    }

}