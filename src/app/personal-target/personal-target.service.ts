import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonalTarget } from './personal-target.model';

@Injectable({
    providedIn: 'root'
})
export class PersonalTargetService {

    private baseUrl = 'http://10.66.12.54:8080/personal-targets';

    constructor(private http: HttpClient) { }

    createPersonalTarget(idEmployee: number, idTarget: number, year: number): Observable<PersonalTarget> {
        const url = `${this.baseUrl}/create/employees/${idEmployee}`;
        const body = { idTarget, year };
        return this.http.post<PersonalTarget>(url, body);
    }

    updatePersonalTargetStatus(idPersonalTarget: number, status: string): Observable<PersonalTarget> {
        const url = `${this.baseUrl}/${idPersonalTarget}/status`;
        const body = { status };
        return this.http.put<PersonalTarget>(url, body);
    }

    deletePersonalTarget(idPersonalTarget: number): Observable<void> {
        const url = `${this.baseUrl}/${idPersonalTarget}`;
        return this.http.delete<void>(url);
    }

    getPersonalTargetsByEmployee(idEmployee: number): Observable<PersonalTarget[]> {
        const url = `${this.baseUrl}/employee/${idEmployee}`;
        return this.http.get<PersonalTarget[]>(url);
    }
}