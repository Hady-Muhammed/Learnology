import { NgToastService } from 'ng-angular-popup';
import { API_URL } from './../../../../app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Teacher } from './../../../../app/models/teacher';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-teachers',
  templateUrl: './admin-teachers.component.html',
  styleUrls: ['./admin-teachers.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTeachersComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'no',
    'avatar',
    'name',
    'email',
    'since',
    'actions',
  ];
  dataSource!: MatTableDataSource<Teacher>;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, public toast: NgToastService) {
    this.getAllTeachers();
  }

  ngOnInit(): void {}

  isAllSelected() {
    const numSelected = this.selection?.selected?.length;
    const numRows = this.dataSource?.data?.length;
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

  getAllTeachers() {
    this.http
      .get<Teacher[]>(API_URL + '/api/teachers/getAllTeachers')
      .subscribe((teachers: Teacher[]) => {
        this.dataSource = new MatTableDataSource(teachers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  deleteTeachersBySelection() {
    if (this.selection.selected.length == 1) {
      this.http
        .post(API_URL + '/api/teachers/deleteTeacher', {
          email: this.selection.selected[0].email,
        })
        .subscribe({
          next: (res: any) => {
            this.toast.success({ detail: res.message });
            this.getAllTeachers();
            this.selection.clear()
          },
          error: (err) => {
            this.toast.error({ detail: err.message });
          },
        });
    } else {
      let emails: string[] = [];
      for (const teacher of this.selection.selected) {
        emails.push(teacher.email);
      }
      this.http
        .post(API_URL + '/api/teachers/deleteManyTeachers', {
          emails,
        })
        .subscribe({
          next: (res: any) => {
            this.toast.success({ detail: res.message });
            this.getAllTeachers();
            this.selection.clear()
          },
          error: (err) => {
            this.toast.error({ detail: err.message });
          },
        });
    }
  }

  deleteTeacher(email: string) {
    this.http
      .post(API_URL + '/api/teachers/deleteTeacher', {
        email,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getAllTeachers();
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }
}
