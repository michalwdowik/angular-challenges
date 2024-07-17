import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { randText } from '@ngneat/falso';
import { Observable, catchError, throwError } from 'rxjs';

export interface ToDo {
  completed: boolean;
  id: number;
  userId?: number;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {}

  public getTodos(): Observable<ToDo[]> {
    return this.http
      .get<ToDo[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public updateTodo(todo: ToDo): Observable<ToDo> {
    const url = `${this.apiUrl}/${todo.id}`;
    return this.http
      .put<ToDo>(
        url,
        JSON.stringify({
          todo: todo.id,
          title: randText(),
          userId: todo.userId,
        }),
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      )
      .pipe(catchError(this.handleError));
  }

  public deleteToDo(todo: ToDo): Observable<ToDo> {
    const url = `${this.apiUrl}/${todo.id}`;
    return this.http.delete<ToDo>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.error);
    return throwError(
      () => new Error('Something bad happened; please try again later.'),
    );
  }
}
