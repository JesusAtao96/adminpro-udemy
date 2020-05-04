import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../models/usuario.model';

import { UsuarioService } from '../services';

import Swal from 'sweetalert2';

declare function init_plugins();


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.scss']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public router: Router,
    public usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false),
    }, {
      validators: this.sonIguales('password', 'password2')
    });

    this.forma.setValue({
      nombre: 'test',
      correo: 'test@test.com',
      password: '123456',
      password2: '123456',
      condiciones: true
    });
  }

  sonIguales(campo1: string, campo2: string) {
    return (group: FormGroup) => {
      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      }

      return {
        sonIguales: true
      };
    };
  }

  registrarUsuario() {
    if (this.forma.invalid) {
      return;
    }

    if (!this.forma.value.condiciones) {
      Swal.fire({
        title: 'Importante',
        text: 'Debe aceptar las condiciones',
        icon: 'warning'
      });
      return;
    }

    const usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    console.log(this.forma.value, usuario);

    this.usuarioService.crearUsuario(usuario)
      .subscribe(resp => this.router.navigate(['/login']));
  }

}
