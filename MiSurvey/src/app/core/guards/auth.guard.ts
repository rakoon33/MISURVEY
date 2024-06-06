import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { userActions } from '../store/actions';
import { companyActions } from '../store/actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token != '') {
      
      var d = new Date();
      d.setTime(d.getTime() + (60 * 60 * 1000));
      var expires = 'expires=' + d.toUTCString();
  
      document.cookie = 'jwt' + `=${token};path=/;` + expires;

      this.store.dispatch(userActions.getUserDataRequest());

      return true;
    }

    this.store.dispatch(
      userActions.getUserDataSuccess({
        user: null,
        permissions: [],
        packages: null,
      })
    );
    this.router.navigate(['/login']);
    return false;

  }

  private doesHttpOnlyCookieExist(cookieName: string): boolean {
    var d = new Date();
    d.setTime(d.getTime() + 1000);
    var expires = 'expires=' + d.toUTCString();

    const token = localStorage.getItem('token');

    document.cookie = 'jwt' + `=${token};path=/;` + expires;
    return document.cookie.indexOf('jwt' + '=') == -1;
  }
}
