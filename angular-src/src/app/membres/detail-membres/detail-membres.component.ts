import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';

import { User } from '../../core/user';
import { PostViewComponent } from './../../feeds/post-view/post-view.component';
import { ProfileViewComponent } from './../../profile/profile-view/profile-view.component';

@Component({
  selector: 'rts-detail-membres',
  templateUrl: './detail-membres.component.html',
  styleUrls: ['./detail-membres.component.css']
})
export class DetailMembresComponent implements OnInit, OnDestroy {
  user: User;

  suivi: false;
  isOwnProfile: Boolean;
  getUserProfile: Boolean;

  // Connexions Ajax actives
  sub: any;
  subRoute: any;
  subGetMember: any;

  // Référence de l'utilisateur
  id: String;
  ownerId: String;

  isPostActive: Boolean;

  constructor(
    private _route: ActivatedRoute,
    private _authService: AuthService
  ) {
    this.isOwnProfile = false;
  }
  ngOnInit() {
    this.getUserProfile = false;
    this.getUserId();
    this.isPostActive = false;
  }


  getUserId() {

    this.subRoute = this._route.params.subscribe(params => {
      this.id = params['id'];
      this.ownerId = this.id;
      this.getUserDetails(this.id);
    });
  }

  getUserDetails(id) {
    this.subGetMember = this._authService.memberdetails(id).subscribe(data => {
      if (data.err) {
        console.log(data.err);
      } else {

        this.user = data.memberDetails;
        this.getUserProfile = true;
      }
    });
  }



  postActiveMode() {
    this.isPostActive = true;
  }

  profilActiveMode() {
    this.isPostActive = false;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }

    if (this.subRoute) {
      this.subRoute = null;
    }

    if (this.subGetMember) {
      this.subGetMember = null;
    }
  }
}
