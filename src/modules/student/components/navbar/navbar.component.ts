import { Subscription } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import { Student } from 'src/app/models/student';
import { Notification } from 'src/app/models/notification';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isOpened: boolean = false;
  account!: Student;
  notificationsMenuOpened: boolean = false;
  numOfNotifications: number = 0;
  notifications!: Notification[];
  subscription!: Subscription;

  constructor(
    private http: HttpClient,
    public socketService: SocketioService,
    public router: Router
  ) {
    this.getAccount();
  }

  ngOnInit(): void {}

  logOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signup');
    this.socketService.disconnect();
  }

  getAccount() {
    const token = localStorage.getItem('token') || '';
    const account: any = jwt_decode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${account.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.connectToSocket();
        this.listenForNewNotifications();
      });
  }

  listenForNewNotifications() {
    this.socketService.socket?.on(
      'listen-someone-commented',
      (email: string) => {
        if (this.account.email === email) {
          this.numOfNotifications++;
        }
      }
    );
    this.socketService.socket?.on('listen-someone-replied', (email: string) => {
      if (this.account.email === email) {
        this.numOfNotifications++;
      }
    });
    this.socketService.socket?.on('listen-someone-reacted', (email: string) => {
      if (this.account.email === email) {
        this.numOfNotifications++;
      }
    });
  }

  toggleNotificationMenu() {
    this.notificationsMenuOpened = !this.notificationsMenuOpened;
    if (this.notificationsMenuOpened) {
      this.getNotifications();
    }
    this.numOfNotifications = 0;
  }

  getNotifications() {
    this.subscription = this.http
      .get<Notification[]>(
        API_URL + `/api/notifications/getAllNotifications/${this.account._id}`
      )
      .subscribe(
        (notifications: Notification[]) => (this.notifications = notifications)
      );
  }

  connectToSocket() {
    if (!this.isConnectedToSocket()) {
      this.socketService.setupSocketConnection(this.account.email);
      this.socketService.online(this.account._id);
    }
  }

  isConnectedToSocket() {
    return this.socketService?.socket?.connected;
  }

  navigate(postID: string) {
    this.router.navigate(['notified-post', postID]);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
