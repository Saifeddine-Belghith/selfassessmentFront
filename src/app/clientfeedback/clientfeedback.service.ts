import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientFeedback } from './clientfeedback.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientfeedbackService {

  private baseUrl = 'http://10.66.12.54:8081/clientfeedbacks';

  constructor(private http: HttpClient) { }

  createClientFeedback(idEmployee: number, clientFeedback: ClientFeedback): Observable<ClientFeedback> {
    const url = `${this.baseUrl}/create/${idEmployee}`;
    return this.http.post<ClientFeedback>(url, clientFeedback);
  }
  getClientFeedbackByEmployee(idEmployee: number): Observable<ClientFeedback[]> {
    const url = `${this.baseUrl}/employee/${idEmployee}`;
    return this.http.get<ClientFeedback[]>(url);
  }
}
