import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Usuario } from '../../models/usuario.model';

import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient, public router: Router, public subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  logout() {
    this.token = '';
    this.usuario = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    return this.http.post(`${environment.URL_SERVICIOS}/login/google`, { token })
      .pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
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
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          return true;
        })
      );
  }

  crearUsuario(usuario: Usuario) {
    return this.http.post(`${environment.URL_SERVICIOS}/usuario`, usuario)
      .pipe(
        map((resp: any) => {
          Swal.fire({ title: 'Usuario creado', text: usuario.email, icon: 'success' });
          return resp.usuario;
        })
      );
  }

  actualizarUsuario(usuario: Usuario) {
    return this.http.put(`${environment.URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`, usuario)
      .pipe(
        map((resp: any) => {
          if (usuario._id === this.usuario._id) {
            const usuarioDb: Usuario = resp.usuario;
            this.guardarStorage(usuarioDb._id, this.token, usuarioDb);
          }

          Swal.fire({ title: 'Usuario actualizado', text: usuario.nombre, icon: 'success' });
          return true;
        })
      );
  }

  cambiarImagen(archivo: File, id: string) {
    this.subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then((resp: any) => {
        this.usuario.img = resp.usuario.img;
        this.guardarStorage(this.usuario._id, this.token, this.usuario);
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
