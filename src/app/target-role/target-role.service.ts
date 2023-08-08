import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TargetRole } from './target-role.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetRoleService {

  private baseUrl = 'http://10.66.12.54:8081/target-role';

  constructor(private http: HttpClient) { }

  assignTargetRole(targetRole: TargetRole, idEmployee: number, originId: number): Observable<TargetRole> {
    const url = `${this.baseUrl}/assign/${idEmployee}/origins/${originId}`;
    return this.http.post<TargetRole>(url, targetRole);
  }

  deleteTargetRole(idTargetRole: number): Observable<void> {
    const url = `${this.baseUrl}/${idTargetRole}`;
    return this.http.delete<void>(url);
  }

  getTargetRoleByEmployee(idEmployee: number): Observable<TargetRole[]> {
    const url = `${this.baseUrl}/employee/${idEmployee}`;
    return this.http.get<TargetRole[]>(url);
  }
}
