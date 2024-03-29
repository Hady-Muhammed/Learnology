import { Observable } from 'rxjs';
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
import { Course } from 'src/app/models/course';
import { API_URL } from 'src/app/services/socketio.service';

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
  popularCourses!: Observable<Course[]>;

  constructor(private http: HttpClient) {
    window.scrollTo(0, 0);
    this.getPopularCourses();
  }

  ngOnInit(): void {}

  getPopularCourses() {
    this.popularCourses = this.http.get<Course[]>(
      API_URL + '/api/courses/getPopularCourses'
    );
  }
}
