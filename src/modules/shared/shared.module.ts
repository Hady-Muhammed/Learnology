import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/modules/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../student/components/loader/loader.component';
import { LogoComponent } from '../student/components/logo/logo.component';
import { InboxCardComponent } from '../student/components/cards/inbox-card/inbox-card.component';

@NgModule({
  declarations: [LogoComponent, LoaderComponent, InboxCardComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [LogoComponent, LoaderComponent, MaterialModule, InboxCardComponent],
})
export class SharedModule {}
