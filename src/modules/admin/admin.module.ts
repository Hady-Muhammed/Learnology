import { SharedModule } from './../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { NaavbarComponent } from './components/naavbar/naavbar.component';
import { NgChartsModule } from 'ng2-charts';
import { AdminTeachersComponent } from './pages/admin-teachers/admin-teachers.component';
import { AdminStudentsComponent } from './pages/admin-students/admin-students.component';
import { AdminEmailsComponent } from './pages/admin-emails/admin-emails.component';
import { AdminEmailDetailComponent } from './pages/admin-email-detail/admin-email-detail.component';
import { AdminComponent } from './pages/admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    NaavbarComponent,
    AdminTeachersComponent,
    AdminStudentsComponent,
    AdminEmailsComponent,
    AdminEmailDetailComponent,
    AdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgChartsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
