import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services';
import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];
  desde = 0;

  totalRegistros = 0;
  cargando = true;

  constructor(private medicoService: MedicoService, private modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarMedicos();
    this.modalUploadService.notificacion.subscribe(() => this.cargarMedicos());
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos(this.desde)
      .subscribe((resp: any) => {
        this.medicos = resp.medicos;
        this.totalRegistros = resp.total;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    console.log(desde, this.desde);

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
  }

  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;
    this.medicoService.buscarMedico(termino)
      .subscribe((medicos: Medico[]) => {
        this.medicos = medicos;
        this.cargando = false;
      });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('medicos', id);
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta a punto de borrar el médico ${medico.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Si, Borralo!'
    }).then((result) => {
      if (result.value) {
        this.medicoService.borrarMedico(medico._id)
          .subscribe(() => {
            this.desde = 0;
            this.cargarMedicos();
          });
      }
    });
  }

}
