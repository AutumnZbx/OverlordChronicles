import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: string = "https://api-overlord.onrender.com";  // URL de tu API en Render

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'cors'
    })
  };
  constructor(private http : HttpClient) { }

  getAllCharacters(): Observable<any> {
    return this.http.get(this.apiUrl + '/characters').pipe(
      retry(3)
    );
  }
  
  getCharacterById(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/characters/' + id).pipe(
      retry(3)
    );
  }
}
