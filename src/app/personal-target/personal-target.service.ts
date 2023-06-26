import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonalTarget } from './personal-target.model';
import { Employee } from '../employee-details/employee.model';

@Injectable({
    providedIn: 'root'
})
export class PersonalTargetService {

    private baseUrl = 'http://10.66.12.54:8081/personal-targets';

    constructor(private http: HttpClient) { }

    createPersonalTarget(idEmployee: number, personalTarget: PersonalTarget): Observable<PersonalTarget> {
        const url = `${this.baseUrl}/create/${idEmployee}`;
        return this.http.post<PersonalTarget>(url, personalTarget);
    }

    assignPersonalTarget(personalTarget: PersonalTarget, idEmployee: number, originId: number): Observable<PersonalTarget> {
        const url = `${this.baseUrl}/assign/${idEmployee}/origins/${originId}`;
        return this.http.post<PersonalTarget>(url, personalTarget);
    }

    updatePersonalTargetStatus(personalTargetId: number, status: string): Observable<PersonalTarget> {
        const url = `${this.baseUrl}/${personalTargetId}/status`;
        const body = { status: status };
        return this.http.put<PersonalTarget>(url, body);
    }

    deletePersonalTarget(personalTargetId: number): Observable<void> {
        const url = `${this.baseUrl}/${personalTargetId}`;
        return this.http.delete<void>(url);
    }

    getPersonalTargetsByEmployee(idEmployee: number): Observable<PersonalTarget[]> {
        const url = `${this.baseUrl}/employee/${idEmployee}`;
        return this.http.get<PersonalTarget[]>(url);
    }

    searchConsultantsByTarget(payload: any): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.baseUrl}/search`, { params: payload });
    }
}