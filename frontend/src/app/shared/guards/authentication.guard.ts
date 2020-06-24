import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router,
              private cookieService: CookieService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.cookieService.check('TOKEN_SESSION')) {
      return true;
    } else {
      this.router.navigate(['/login']).then(
        r => console.log(r ? 'Successfully redirected' : 'An error has occurred during redirection')
      );
      return false;
    }
  }
}
