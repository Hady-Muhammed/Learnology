import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Email } from 'src/app/models/email';
import { API_URL } from 'src/app/services/socketio.service';

@Injectable({
  providedIn: 'root'
})
export class EmailResolverService implements Resolve<Email[]> {

  constructor(private http: HttpClient) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    return this.getEmail(id)
  }
  getEmail(id: string | null): Observable<any> {
    return this.http
      .get<Email>(API_URL + `/api/emails/getEmail/${id}`)
  }
}
