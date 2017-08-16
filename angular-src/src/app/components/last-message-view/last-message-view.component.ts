import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { PostsService } from '../../services/posts/posts.service';

import { User } from '../../core/user';


@Component({
  selector: 'rts-last-message-view',
  templateUrl: './last-message-view.component.html',
  styleUrls: ['./last-message-view.component.css']
})
export class LastMessageViewComponent implements OnInit, OnDestroy {
  @Input() user: User;

  sub: any;

  lastPostMessage: String;
  // lastPostMessage: String = 'Canada is the Best country ever !';

  constructor(
    private _authService: AuthService,
    private _postService: PostsService
  ) { }

  ngOnInit() {
    this.sub = this._postService.getLastPost(this.user.nickname).subscribe(data => {
      if (data.err) {
        console.log(data.err);
      } else {
        this.lastPostMessage = data.lastPost.details;
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
