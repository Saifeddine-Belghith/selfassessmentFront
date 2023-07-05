import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientFeedback, ClientFeedbackPlayload } from './clientfeedback.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientfeedbackService {

  private baseUrl = 'http://localhost:8081/clientfeedbacks';

  constructor(private http: HttpClient) { }

  createClientFeedback(idEmployee: number, clientFeedback: ClientFeedbackPlayload): Observable<ClientFeedback> {
    const url = `${this.baseUrl}/create/${idEmployee}`;
    return this.http.post<ClientFeedback>(url, clientFeedback);
  }
  getClientFeedbackByEmployee(idEmployee: number): Observable<ClientFeedback[]> {
    const url = `${this.baseUrl}/employee/${idEmployee}`;
    return this.http.get<ClientFeedback[]>(url);
  }
}
