import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(public router: Router , public usuarioService: UsuarioService) {}

  canActivate(): boolean {
    if (this.usuarioService.estaLogueado()) {
      console.log('PASO EL GUARD');
      return true;
    } else {
      console.log('BLOQUEADO POR EL GUARD');
      this.router.navigate(['/login']);
      return false;
    }
  }

}
