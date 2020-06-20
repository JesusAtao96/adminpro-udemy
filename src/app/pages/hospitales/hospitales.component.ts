import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services';
import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = [];
  desde = 0;

  totalRegistros = 0;
  cargando = true;

  constructor(private hospitalService: HospitalService, private modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this.modalUploadService.notificacion.subscribe(() => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde)
      .subscribe((resp: any) => {
        this.hospitales = resp.hospitales;
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
    this.cargarHospitales();
  }

  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;
    this.hospitalService.buscarHospital(termino)
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('hospitales', id);
  }

  borrarHospital(hospital: Hospital) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta a punto de borrar el hospital ${hospital.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Si, Borralo!'
    }).then((result) => {
      if (result.value) {
        this.hospitalService.borrarHospital(hospital._id)
          .subscribe(() => {
            this.desde = 0;
            this.cargarHospitales();
          });
      }
    });
  }

  crearHospital() {
    Swal.fire({
      title: 'Crear Hospital',
      input: 'text',
      showCancelButton: true,
      inputPlaceholder: 'Ingrese el nombre',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.hospitalService.crearHospital(result.value.toString()).subscribe(
          () => this.cargarHospitales()
        );
      } else {
        Swal.fire({ title: 'No puede guardar hospital', text: 'Debe tener un nombre', icon: 'error' });
      }
    });
  }

  actualizarHospital(hospital: Hospital) {
    if (!hospital.nombre) {
      Swal.fire({ title: 'No puede guardar hospital', text: 'Debe tener un nombre', icon: 'error' });
      return;
    }

    this.hospitalService.actualizarHospital(hospital).subscribe();
  }

}
