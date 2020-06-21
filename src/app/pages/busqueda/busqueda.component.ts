import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Usuario } from '../../models/usuario.model';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';


@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {
  usuarios: Usuario[] = [];
  hospitales: Hospital[] = [];
  medicos: Medico[] = [];

  constructor(private activatedRouter: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params: any) => {
      // tslint:disable-next-line: no-string-literal
      const termino = params['termino'];
      this.buscar(termino);
    });
  }

  buscar(termino: string) {
    const url = `${environment.URL_SERVICIOS}/busqueda/todo/${termino}`;

    this.http.get(url).subscribe((resp: any) => {
      console.log(resp);
      this.usuarios = resp.usuarios;
      this.hospitales = resp.hospitales;
      this.medicos = resp.medicos;
    });
  }

}
