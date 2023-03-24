import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { Student } from './../../../../app/models/student';
import { API_URL } from './../../../../app/services/socketio.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.css'],
})
export class AdminStudentsComponent implements OnInit {
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, public toast: NgToastService) {
    this.getAllStudents();
  }

  ngOnInit(): void {}

  isAllSelected() {
    const numSelected = this.selection?.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllStudents() {
    this.http
      .get<Student[]>(API_URL + '/api/students/getAllStudents')
      .subscribe((students: Student[]) => {
        this.dataSource = new MatTableDataSource(students);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  deleteStudentsBySelection() {
    if (this.selection.selected.length == 1) {
      this.http
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
    } else {
      let emails: string[] = [];
      for (const student of this.selection.selected) {
        emails.push(student.email);
      }
      this.http
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
    }
  }

  deleteStudent(email: string) {
    this.http
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
  }
}
