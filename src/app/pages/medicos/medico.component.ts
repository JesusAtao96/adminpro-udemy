import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Hospital } from './../../models/hospital.model';
import { Medico } from './../../models/medico.model';

import { HospitalService, MedicoService } from '../../services';

import { Subscription } from 'rxjs';

import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit, OnDestroy {
  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', null, null, '');
  hospital: Hospital = new Hospital('');

  modalSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.hospitalService.cargarHospitales()
      .subscribe((response: any) => this.hospitales = response.hospitales);

    this.activatedRoute.params.subscribe((params: any) => {
      // tslint:disable-next-line: no-string-literal
      const id = params['id'];
      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });

    this.modalSubscription = this.modalUploadService.notificacion.subscribe((resp: any) => {
      this.medico.img = resp.medico.img;
    });
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
  }

  cargarMedico(id: string) {
    this.medicoService.obtenerMedico(id)
      .subscribe(
        (medico: Medico) => {
          this.medico = medico;
          this.medico.hospital = medico.hospital._id;
          this.cambioHospital(this.medico.hospital);
        },
        () => this.router.navigate(['/medico'])
      );
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('medicos', id);
  }

  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico).subscribe(
      (medico: Medico) => {
        this.medico._id = medico._id;
        this.router.navigate(['/medico', medico._id]);
      }
    );
  }

  cambioHospital(id: string) {
    this.hospitalService.obtenerHospital(id)
      .subscribe((hospital: Hospital) => this.hospital = hospital);
  }

}
