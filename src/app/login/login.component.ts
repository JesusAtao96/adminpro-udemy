import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  recuerdame = false;

  auth2: any;

  constructor(private router: Router, public usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    this.recuerdame = this.email.length > 0;
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '204410247276-u0nc858m6gf3furfm0g7ffj5em26mu32.apps.googleusercontent.com',
        cookiepolicy: 'single-host-origin',
        scope: 'profile'
      });

      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      // const profile = googleUser.getBasicProfile();
      // console.log('profile', profile);

      const token = googleUser.getAuthResponse().id_token;
      console.log('token', token);

      this.usuarioService
        .loginGoogle(token)
        .subscribe(() => window.location.href = '#/dashboard');
    });
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }

    const usuario = new Usuario(null, forma.value.email, forma.value.password);

    this.usuarioService
      .login(usuario, forma.value.recuerdame)
      .subscribe(() => this.router.navigate(['/dashboard']));
  }

}
