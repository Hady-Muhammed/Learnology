import { AdminRoutingModule } from './admin-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { NaavbarComponent } from './components/naavbar/naavbar.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    NaavbarComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgChartsModule
  ]
})
export class AdminModule { }
