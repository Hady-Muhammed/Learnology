import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { Student } from './../../../../app/models/student';
import { API_URL } from './../../../../app/services/socketio.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.css'],
})
export class AdminStudentsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'select',
    'no',
    'avatar',
    'name',
    'email',
    'since',
    'actions',
  ];
  dataSource!: MatTableDataSource<Student>;
  selection = new SelectionModel<any>(true, []);
  subscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, public toast: NgToastService) {
    this.getAllStudents();
  }

  ngOnInit(): void {}

  isAllSelected(): boolean {
    const numSelected = this.selection?.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllStudents(): void {
    const sub = this.http
      .get<Student[]>(API_URL + '/api/students/getAllStudents')
      .subscribe((students: Student[]) => {
        this.dataSource = new MatTableDataSource(students);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    this.subscription?.add(sub);
  }

  deleteStudentsBySelection(): void {
    if (this.selection.selected.length == 1) {
      const sub = this.http
        .post(API_URL + '/api/students/deleteStudent', {
          email: this.selection.selected[0].email,
        })
        .subscribe({
          next: (res: any) => {
            this.toast.success({ detail: res.message });
            this.getAllStudents();
            this.selection.clear();
          },
          error: (err) => {
            this.toast.error({ detail: err.message });
          },
        });
      this.subscription?.add(sub);
    } else {
      let emails: string[] = [];
      for (const student of this.selection.selected) {
        emails.push(student.email);
      }
      const sub = this.http
        .post(API_URL + '/api/students/deleteManyStudents', {
          emails,
        })
        .subscribe({
          next: (res: any) => {
            this.toast.success({ detail: res.message });
            this.getAllStudents();
            this.selection.clear();
          },
          error: (err) => {
            this.toast.error({ detail: err.message });
          },
        });
      this.subscription?.add(sub);
    }
  }

  deleteStudent(email: string): void {
    const sub = this.http
      .post(API_URL + '/api/students/deleteStudent', {
        email,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getAllStudents();
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
