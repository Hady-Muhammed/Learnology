import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  account!: Student;

  constructor(private http: HttpClient,private socketService: SocketioService) {
  }

  ngOnInit(): void {
    this.getAccount()
  }
  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student
        this.connectToSocket()
        this.socketService.online(student._id);
      });
  }
  connectToSocket(){
    if(!this.isConnectedToSocket()) {
      this.socketService.setupSocketConnection(this.account.email)
    } else {
      console.log("connected before!")
    }
  }

  isConnectedToSocket(){
    return this.socketService?.socket?.connected
  }
}
