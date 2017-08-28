import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PostViewComponent } from './post-view/post-view.component';
import { CommentComponent } from './comment/comment.component';
import { FromNowPipe } from './comment/from-now.pipe';
import { ShowImagesModule } from './../show-images/show-images.module';
import { FeedsComponent } from './feeds/feeds.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';
import { ListFriendsComponent } from './list-friends/list-friends.component';


import { SendMessageComponent } from './send-message/send-message.component';
import { FriendsConnectedComponent } from './friends-connected/friends-connected.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ShowImagesModule,
    ReactiveFormsModule

  ],
  declarations: [
    PostViewComponent,
    CommentComponent,
    FromNowPipe,
    SendMessageComponent,
    FeedsComponent,
    SubMenuComponent,
    FriendsConnectedComponent,
    ListFriendsComponent
  ],
  exports: [
    PostViewComponent,
    SendMessageComponent,
    FeedsComponent,
    ListFriendsComponent
  ]
})
export class FeedsModule { }