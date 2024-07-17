import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { LoaderComponent } from './loader.component';
import { ApiService, ToDo } from './shared/services/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  selector: 'app-root',
  template: `
    @if (loading) {
      <app-loader></app-loader>
    } @else {
      @for (todo of todos; track $index) {
        <div>
          {{ todo.title }}
          <button (click)="update(todo)">Update</button>
          <button (click)="delete(todo)">Delete</button>
        </div>
      }
      @if (errorMessage) {
        <div>{{ errorMessage }}</div>
      }
    }
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  todos!: ToDo[];
  http = inject(HttpClient);
  apiService = inject(ApiService);
  errorMessage = '';
  loading = false;

  ngOnInit(): void {
    this.fetchTodos();
  }

  fetchTodos(): void {
    this.loading = true;
    this.apiService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err);
        this.loading = false;
      },
    });
  }

  update(todo: ToDo) {
    this.loading = true;

    this.apiService.updateTodo(todo).subscribe({
      next: (todoUpdated) => {
        this.todos = this.todos.map((t) =>
          t.id === todoUpdated.id ? todoUpdated : t,
        );
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err);
        this.loading = false;
      },
    });
  }

  delete(todo: ToDo) {
    this.loading = true;
    this.apiService.deleteToDo(todo).subscribe({
      next: () => {
        this.todos = this.todos.filter((t) => t.id !== todo.id);
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err);
        this.loading = false;
      },
    });
  }

  private handleError(error: Error) {
    this.errorMessage = error.message;
    console.error('An error occurred:', error);
  }
}
