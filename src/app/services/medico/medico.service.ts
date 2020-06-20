import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Medico } from '../../models/medico.model';

import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(public http: HttpClient, private usuarioService: UsuarioService) { }

  cargarMedicos(desde: number = 0) {
    const url = `${environment.URL_SERVICIOS}/medico?desde=${desde}`;
    return this.http.get(url);
  }

  obtenerMedico(id: string) {
    const url = `${environment.URL_SERVICIOS}/medico/${id}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.medico)
      );
  }

  borrarMedico(id: string) {
    const url = `${environment.URL_SERVICIOS}/medico/${id}?token=${this.usuarioService.token}`;
    return this.http.delete(url)
    .pipe(
      map((resp: any) => {
        Swal.fire('Médico borrado', 'El médico a sido eliminado correctamente', 'success');
        return true;
      })
    );
  }

  buscarMedico(termino: string) {
    const url = `${environment.URL_SERVICIOS}/busqueda/coleccion/medicos/${termino}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.medicos)
      );
  }

  guardarMedico(medico: Medico) {
    if (medico._id) {
      return this.http.put(`${environment.URL_SERVICIOS}/medico/${ medico._id}?token=${this.usuarioService.token}`, medico)
        .pipe(
          map((resp: any) => {
            Swal.fire({ title: 'Médico actualizado', text: medico.nombre, icon: 'success' });
            return resp.medico;
          })
        );
    } else {
      return this.http.post(`${environment.URL_SERVICIOS}/medico?token=${this.usuarioService.token}`, medico)
      .pipe(
        map((resp: any) => {
          Swal.fire({ title: 'Médico creado', text: medico.nombre, icon: 'success' });
          return resp.medico;
        })
      );
    }
  }

  actualizarMedico(medico: Medico) {
    return this.http.put(`${environment.URL_SERVICIOS}/medico/${ medico._id}?token=${this.usuarioService.token}`, medico)
    .pipe(
      map((resp: any) => {
        Swal.fire({ title: 'Médico actualizado', text: medico.nombre, icon: 'success' });
        return true;
      })
    );
  }
}
