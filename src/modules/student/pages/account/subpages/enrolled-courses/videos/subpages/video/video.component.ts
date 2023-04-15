import { HttpClient } from '@angular/common/http';
import { Component, SecurityContext , OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, OnDestroy {
  id!: string
  video_url!: any
  subscription!: Subscription

  constructor(private http: HttpClient , private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.params['videoID'];
      this.getVideo()
    })
  }

  getVideo() {
    try {
      const videoID = this.route.snapshot.params['videoID']
      const sectionID = this.route.snapshot.paramMap.get("sectionID")
      const courseID = this.route.parent?.snapshot.params['courseID']
      const sub = this.http.post(API_URL + `/api/sections/getVideo`, {
        courseID,
        sectionID,
        videoID,
      })
      .subscribe((video: any) => {
        this.video_url = this.sanitizer.bypassSecurityTrustResourceUrl(video.video_url);
      })
      this.subscription?.add(sub)
    } catch (error) {
      console.log(error)
    }
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
