import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamAverageService {
  private managerUrl = 'http://10.66.12.54:8081/managers';

  constructor(private http: HttpClient) { }


  getTeamAverage(idEmployee: number): Observable<any> {
    return this.http.get(`${this.managerUrl}/3/team-average-for-skills`);
  }
}
