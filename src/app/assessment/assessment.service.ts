import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assessment } from '../assessment/assessment.model';
import { formatDate } from '@angular/common';

interface AssessmentDTO {
    idSkill: number;
    rating: number;
}
@Injectable({
    providedIn: 'root'
})
export class AssessmentService {

    private apiUrl = 'http://localhost:8081/assessments';

    constructor(private http: HttpClient) { }

    getAssessments(id: number): Observable<Assessment[]> {
        id = parseInt(localStorage.getItem('idEmployee') || '');
        return this.http.get<Assessment[]>(`http://localhost:8081/assessments/all/${id}`);
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
    // getAllAssessments(): Observable<any[]> {
    //     const id = parseInt(localStorage.getItem('idEmployee') || '');
    //     const url = `http://localhost:8081/assessments/all/${id}`;
    //     return this.http.get<any[]>(url);
    // }
    getAssessmentsByEmployeeId(id: number): Observable<Assessment[]> {
        return this.http.get<Assessment[]>(`http://localhost:8081/assessments/employee/${id}`);
    }
    getRatingChangesForEmployeeAndSkill(employeeId: number, skillName: string, startDate: Date, endDate: Date) {
        const formattedStartDate = isNaN(Date.parse(startDate.toString())) ? null : formatDate(startDate, 'yyyy-MM-dd', 'en-US');
        const formattedEndDate = isNaN(Date.parse(endDate.toString())) ? null : formatDate(endDate, 'yyyy-MM-dd', 'en-US');

        if (!formattedStartDate || !formattedEndDate) {
            throw new Error('Invalid date format');
        }

        const url = `http://localhost:8081/assessments/employee/${employeeId}/skill/${skillName}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
        console.log('Constructed URL:', url);
        return this.http.get<any>(url);

    }
    calculateAverageRatingsByCategoryAndEmployee(employeeId: number): Observable<Map<number, number>> {
        const url = `${this.apiUrl}/average-ratings/employee/${employeeId}`;
        return this.http.get<Map<number, number>>(url);
    }
    calculateAverageRatingsByCategoryAndExperience(experienceLevel: string): Observable<Map<number, number>> {
        const url = `${this.apiUrl}/average-ratings/experience/${experienceLevel}`;
        return this.http.get<Map<number, number>>(url);
    }

    getAssistanceByEmployeeAndCategory(idCategory: number, idEmployee: number): Observable<any> {
        const url = `${this.apiUrl}/assistance/category/${idCategory}/${idEmployee}`;
        return this.http.get<any>(url);
    }
    
}
