import { Student } from './../../models/student';
import { SocketioService, API_URL } from './../../services/socketio.service';
import { Course } from './../../models/course';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Autoplay, SwiperOptions } from 'swiper';
// import Swiper core and required modules
import SwiperCore, {
  EffectFade,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
} from 'swiper';
import jwtDecode from 'jwt-decode';

// install Swiper modules
SwiperCore.use([EffectFade, Autoplay, Navigation, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  panelOpenState: boolean = false;
  config: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 10,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      10: {
        slidesPerView: 1,
      },
      900: {
        slidesPerView: 2,
      },
    },
  };
  config2: SwiperOptions = {
    slidesPerView: 1,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    effect: 'fade',
    loop: true,
  };
  popularCourses!: Course[];
  account!: Student;

  constructor(
    private http: HttpClient,
    private socketService: SocketioService
  ) {
    this.getAllCourses();
    window.scrollTo(0, 0);
    this.getAccount();
  }
  ngOnInit(): void {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.socketService.setupSocketConnection(student.email);
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.socketService.online(student._id);
      });
  }

  getAllCourses() {
    this.http
      .get<Course[]>(API_URL + '/api/courses/getAllCourses')
      .subscribe((courses: Course[]) => {
        this.popularCourses = courses.filter(
          (course: Course) => course.num_of_likes >= 200
        );
      });
  }
}
