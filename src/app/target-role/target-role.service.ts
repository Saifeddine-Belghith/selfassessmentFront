import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TargetRole } from './target-role.model';

@Injectable({
    providedIn: 'root'
})
export class TargetRoleService {
    private apiUrl = 'http://10.66.12.54:8081/targetrole';
    targetroles: TargetRole[] = [];
    idTragetRole!: number;

    constructor(private http: HttpClient) { }

    getTargetRoles(): Observable<TargetRole[]> {
        return this.http.get<TargetRole[]>(`${this.apiUrl}/all`);
    }
    getMinScore(idTargetRole: number): Observable<{ [key: string]: number }> {
        const url = `${this.apiUrl}/${idTargetRole}/minscores`;
        return this.http.get<{ [key: string]: number }>(url);
    }

    getTargetRoleById(idTargetRole: number): Observable<TargetRole> {
        return this.http.get<TargetRole>(`${this.apiUrl}/${idTargetRole}`);
    }
}