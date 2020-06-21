import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(public router: Router, private usuarioService: UsuarioService) {}

  canActivate() {
    if (this.usuarioService.usuario.role === 'ADMIN_ROLE') {
      return true;
    }

    console.log('BLOQUEADO POR EL ADMIN GUARD');
    this.router.navigate(['/login']);
    return false;
  }

}
