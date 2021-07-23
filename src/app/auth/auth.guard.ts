import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

   constructor(private authService: AuthService, private router: Router){}

    canActivate(
        route: import("@angular/router").ActivatedRouteSnapshot,
        state: import("@angular/router").RouterStateSnapshot
        ): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {

        const isAuth = this.authService.getIsAuth();
        if(!isAuth){
            this.router.navigate(['/auth/login']);
        }

         return isAuth;
    }

}
