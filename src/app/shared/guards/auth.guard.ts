import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authSvc: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> { //devuelve un booleano
    return this.authSvc.userData$.pipe(
      map(user => { //pipe con map recorrer los usuarios y aplica alguna transformación a la info
        if (!user) {
          this.router.navigate(['/login']); //si no viene un usuario autenticado se va de nuevo al login
          return false;
        }
        return true;
      })
    );
  }

}
