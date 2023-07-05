import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamAverageService {
  private managerUrl = 'http://localhost:8081/managers';

  constructor(private http: HttpClient) { }


  getTeamAverage(idEmployee: number): Observable<any> {
    return this.http.get(`${this.managerUrl}/${idEmployee}/team-average-for-skills`);
  }
}
