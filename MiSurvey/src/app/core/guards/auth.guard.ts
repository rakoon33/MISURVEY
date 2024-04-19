import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { userActions } from '../store/actions';
import { companyActions } from '../store/actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}

  canActivate(): boolean {
    if (this.doesHttpOnlyCookieExist('jwt')) {
      // If the HttpOnly JWT cookie exists, dispatch user data request and allow access
      this.store.dispatch(userActions.getUserDataRequest());

      return true;
    } else {
      // If the HttpOnly JWT cookie does not exist, redirect to login
      this.store.dispatch(userActions.getUserDataSuccess({ user: null, permissions: [] }));
      this.router.navigate(['/login']);
      return false;
    }
  }

  private doesHttpOnlyCookieExist(cookieName: string): boolean {
    var d = new Date();
    d.setTime(d.getTime() + (1000));
    var expires = "expires=" + d.toUTCString();

    document.cookie = cookieName + "=new_value;path=/;" + expires;
    return document.cookie.indexOf(cookieName + '=') == -1;
  }
}
