import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Usuario } from '../../models/usuario.model';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(public http: HttpClient, public router: Router, public subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  renuevaToken() {
    return this.http.get(`${environment.URL_SERVICIOS}/login/renuevatoken?token=${ this.token }`)
      .pipe(
        map((resp: any) => {
          this.token = resp.token;
          localStorage.setItem('token', this.token);
          console.log('Token renovado', this.token);
          return true;
        }),
        catchError((err: any) => {
          this.router.navigate(['/login']);
          Swal.fire({ title: 'Error', text: 'No fue posible renovar token', icon: 'error' });
          return throwError(err);
        })
      );
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any[]) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  logout() {
    this.token = '';
    this.usuario = null;
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    return this.http.post(`${environment.URL_SERVICIOS}/login/google`, { token })
      .pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        })
      );
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http.post(`${environment.URL_SERVICIOS}/login`, usuario)
      .pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        }),
        catchError(err => {
          Swal.fire({ title: 'Error', text: err.error.mensaje, icon: 'error' });
          return throwError(err);
        })
      );
  }

  crearUsuario(usuario: Usuario) {
    return this.http.post(`${environment.URL_SERVICIOS}/usuario`, usuario)
      .pipe(
        map((resp: any) => {
          Swal.fire({ title: 'Usuario creado', text: usuario.email, icon: 'success' });
          return resp.usuario;
        }),
        catchError(err => {
          Swal.fire({ title: err.error.mensaje, text: err.error.errors.mensaje, icon: 'error' });
          return throwError(err);
        })
      );
  }

  actualizarUsuario(usuario: Usuario) {
    return this.http.put(`${environment.URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`, usuario)
      .pipe(
        map((resp: any) => {
          if (usuario._id === this.usuario._id) {
            const usuarioDb: Usuario = resp.usuario;
            this.guardarStorage(usuarioDb._id, this.token, usuarioDb, this.menu);
          }

          Swal.fire({ title: 'Usuario actualizado', text: usuario.nombre, icon: 'success' });
          return true;
        }),
        catchError(err => {
          Swal.fire({ title: err.error.mensaje, text: err.error.errors.message, icon: 'error' });
          return throwError(err);
        })
      );
  }

  cambiarImagen(archivo: File, id: string) {
    this.subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) => {
        this.usuario.img = resp.usuario.img;
        this.guardarStorage(this.usuario._id, this.token, this.usuario, this.menu);
        Swal.fire({ title: 'Imagen actualizada', text: this.usuario.nombre, icon: 'success' });
      })
      .catch(resp => {
        console.error(resp);
      });
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${environment.URL_SERVICIOS}/usuario?desde=${desde}`;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = `${environment.URL_SERVICIOS}/busqueda/coleccion/usuarios/${termino}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.usuarios)
      );
  }

  borrarUsuario(id: string) {
    const url = `${environment.URL_SERVICIOS}/usuario/${id}?token=${this.token}`;
    return this.http.delete(url)
    .pipe(
      map((resp: any) => {
        Swal.fire('Usuario borrado', 'El usuario a sido eliminado correctamente', 'success');
        return true;
      })
    );
  }
}
