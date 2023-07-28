import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProfileRole } from './profile-role.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileRoleService {
    private apiUrl = 'http://10.66.12.54:8081/profilerole';
    targetroles: ProfileRole[] = [];
    idTragetRole!: number;

    constructor(private http: HttpClient) { }

    getProfileRoles(): Observable<ProfileRole[]> {
        return this.http.get<ProfileRole[]>(`${this.apiUrl}/all`);
    }
    getMinScore(idProfileRole: number): Observable<{ [key: string]: number }> {
        const url = `${this.apiUrl}/${idProfileRole}/minscores`;
        return this.http.get<{ [key: string]: number }>(url);
    }

    getProfileRoleById(idProfileRole: number): Observable<ProfileRole> {
        return this.http.get<ProfileRole>(`${this.apiUrl}/${idProfileRole}`);
    }
}
