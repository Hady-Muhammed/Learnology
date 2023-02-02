import { Chat } from 'src/app/models/chat';
import { API_URL, SocketioService } from './../../../../app/services/socketio.service';
import { Teacher } from './../../../../app/models/teacher';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-navbarr',
  templateUrl: './navbarr.component.html',
  styleUrls: ['./navbarr.component.css'],
})
export class NavbarrComponent implements OnInit {

  account!: Teacher;
  numOfUnreadMessages: number = 0;
  @Input() toggle!: boolean;

  constructor(private router: Router, private http: HttpClient , private socketService: SocketioService) {
    this.getAccount();
  }

  ngOnInit(): void {
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signup');
    this.socketService.disconnect()
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.connectToSocket()
        this.getNoOfUnreadMessages()
      });
  }

  connectToSocket(){
    if(!this.isConnectedToSocket()) {
      this.socketService.setupSocketConnection(this.account.email)
      this.socketService.online(this.account._id)
    } else {
      console.log("connected before!")
    }
  }

  isConnectedToSocket(){
    return this.socketService?.socket?.connected
  }

  getNoOfUnreadMessages() {
    this.http.post<Chat[]>(API_URL + `/api/chats/getChats`,{email: this.account.email})
    .subscribe((chats: Chat[]) =>{
      for (let i = 0; i < chats.length; i++) {
        this.numOfUnreadMessages += chats[i].newMessages
      }
    })
  }
}
