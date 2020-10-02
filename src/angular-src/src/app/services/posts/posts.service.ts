import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {AuthService} from '../auth/auth.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class PostsService {
  authToken: any;

  constructor(
    private _http: Http,
    private _auth: AuthService
  ) {
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  /**
   * Permet D'enregistrer un nouveau post
   * @param newPost Nouveau post
   */
  sendNewPost(newPost) {
    const headers = new Headers();
    this.loadToken();

    headers.append('Authorization', this.authToken);
    headers
      .append('Content-type', 'application/json');
    return this._http
      .post(environment.BACKENDURL + '/api/new-post', newPost, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Récupère le dernier message d'un utilisateur
   * @param userId Pseudo de l'utilisateur
   */
  getLastPost(userId) {
    const headers = new Headers();
    this.loadToken();

    headers.append('Authorization', this.authToken);
    headers
      .append('Content-type', 'application/json');
    return this._http
      .post(environment.BACKENDURL + '/api/get-last-post', {
        userId: userId
      }, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Récupère tous les posts
   */
  getPosts() {
    const headers = new Headers();
    this.loadToken();

    headers.append('Authorization', this.authToken);
    headers
      .append('Content-type', 'application/json');
    return this._http
      .get(environment.BACKENDURL + '/api/get-post', { headers: headers })
      .map(res => res.json());
  }


  /**
   * Récupère tous les posts d'un utilisateur spécifié
   */
  getOwnerPosts(ownerId) {
    const headers = new Headers();
    this.loadToken();

    headers.append('Authorization', this.authToken);
    headers
      .append('Content-type', 'application/json');
    return this._http
      .post(environment.BACKENDURL + '/api/get-owner-post', { ownerId: ownerId }, { headers: headers })
      .map(res => res.json());
  }

  /**
   * Supprime un post
   * @param id Clef liée au commentaire
   */
  deletePost(id) {
    const headers = new Headers();
    this.loadToken();

    headers.append('Authorization', this.authToken);
    headers
      .append('Content-type', 'application/json');
    return this._http
      .delete(environment.BACKENDURL + '/api/delete-post/' + id, { headers: headers })
      .map(res => res.json());
  };

  /**
   *Ajout un nouveau commentaire
   */
  addComment(comment) {
    const headers = new Headers();
    this.loadToken();

    headers.append('Authorization', this.authToken);
    headers
      .append('Content-type', 'application/json');
    return this._http
      .post(environment.BACKENDURL + '/api/add-comment', comment, { headers: headers })
      .map(res => res.json());
  };

  /**
     *Nombresde commentaires
     */
  getNbComments() {
    const headers = new Headers();
    this.loadToken();

    headers.append('Authorization', this.authToken);
    headers
      .append('Content-type', 'application/json');
    return this._http
      .get(environment.BACKENDURL + '/api/nb-comments', { headers: headers })
      .map(res => res.json());
  };

}
