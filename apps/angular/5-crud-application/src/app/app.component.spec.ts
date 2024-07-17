/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { LoaderComponent } from './loader.component';
import { ApiService, ToDo } from './shared/services/api.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppComponent, LoaderComponent],
      providers: [ApiService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should fetch todos successfully', () => {
    const mockTodos: ToDo[] = [{ id: 1, title: 'Test Todo', completed: false }];

    jest.spyOn(apiService, 'getTodos').mockReturnValue(of(mockTodos));

    component.ngOnInit();

    expect(component.todos).toEqual(mockTodos);
    expect(component.loading).toBeFalsy();
  });

  it('should update todo successfully', () => {
    const mockTodo: ToDo = { id: 1, title: 'Test Todo', completed: false };
    const updatedTodo: ToDo = {
      id: 1,
      title: 'Updated Test Todo',
      completed: false,
    };

    component.todos = [mockTodo];
    jest.spyOn(apiService, 'updateTodo').mockReturnValue(of(updatedTodo));

    component.update(mockTodo);

    expect(component.todos[0].title).toBe(updatedTodo.title);
    expect(component.loading).toBeFalsy();
  });

  it('should delete todo successfully', () => {
    const mockTodos: ToDo[] = [
      { id: 1, title: 'Test Todo 1', completed: false },
      { id: 2, title: 'Test Todo 2', completed: true },
    ];

    const deletedTodo: ToDo = { id: 1, title: 'Test Todo 1', completed: false };

    component.todos = mockTodos;
    jest.spyOn(apiService, 'deleteToDo').mockReturnValue(of(deletedTodo));

    component.delete(deletedTodo);

    expect(component.todos.length).toBe(1);
    expect(
      component.todos.some((todo) => todo.id === deletedTodo.id),
    ).toBeFalsy();
    expect(component.loading).toBeFalsy();
  });
});
