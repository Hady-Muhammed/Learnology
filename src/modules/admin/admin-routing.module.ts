import { AdminComponent } from './pages/admin/admin.component';
import { AdminEmailDetailComponent } from './pages/admin-email-detail/admin-email-detail.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminStudentsComponent } from './pages/admin-students/admin-students.component';
import { AdminTeachersComponent } from './pages/admin-teachers/admin-teachers.component';
import { AdminEmailsComponent } from './pages/admin-emails/admin-emails.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'd/dashboard',
  },
  {
    path: 'd',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: 'students',
        component: AdminStudentsComponent,
      },
      {
        path: 'teachers',
        component: AdminTeachersComponent,
      },
      {
        path: 'emails',
        component: AdminEmailsComponent,
      },
      {
        path: 'emails/:id',
        component: AdminEmailDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
