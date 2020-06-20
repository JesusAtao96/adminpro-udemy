import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Hospital } from '../../models/hospital.model';

import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(public http: HttpClient, private usuarioService: UsuarioService) { }

  cargarHospitales(desde: number = 0) {
    const url = `${environment.URL_SERVICIOS}/hospital?desde=${desde}`;
    return this.http.get(url);
  }

  obtenerHospital(id: string) {
    const url = `${environment.URL_SERVICIOS}/hospital/${id}`;
    return this.http.get(url);
  }

  borrarHospital(id: string) {
    const url = `${environment.URL_SERVICIOS}/hospital/${id}?token=${this.usuarioService.token}`;
    return this.http.delete(url)
    .pipe(
      map((resp: any) => {
        Swal.fire('Hospital borrado', 'El hospital a sido eliminado correctamente', 'success');
        return true;
      })
    );
  }

  crearHospital(nombre: string) {
    return this.http.post(`${environment.URL_SERVICIOS}/hospital?token=${this.usuarioService.token}`, { nombre })
    .pipe(
      map((resp: any) => {
        Swal.fire({ title: 'Hospital creado', text: nombre, icon: 'success' });
        return true;
      })
    );
  }

  buscarHospital(termino: string) {
    const url = `${environment.URL_SERVICIOS}/busqueda/coleccion/hospitales/${termino}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.hospitales)
      );
  }

  actualizarHospital(hospital: Hospital) {
    return this.http.put(`${environment.URL_SERVICIOS}/hospital/${ hospital._id}?token=${this.usuarioService.token}`, hospital)
    .pipe(
      map((resp: any) => {
        Swal.fire({ title: 'Hospital actualizado', text: hospital.nombre, icon: 'success' });
        return true;
      })
    );
  }
}
