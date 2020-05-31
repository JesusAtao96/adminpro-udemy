import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubirArchivoService } from './../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [
  ]
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;
  @ViewChild('imgFile') imgFile: ElementRef;

  constructor(private subirArchivoService: SubirArchivoService, public modalUploadService: ModalUploadService) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;
    this.imgFile.nativeElement.value = '';
    this.modalUploadService.ocultarModal();
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire({
        title: 'Sólo Imágenes',
        text: 'El archivo seleccionado no es una imagen',
        icon: 'error'
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  subirImagen() {
    this.subirArchivoService
      .subirArchivo(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
      .then(resp => {
        this.modalUploadService.notificacion.emit(resp);
        this.cerrarModal();
      })
      .catch(err => {
        console.error('Error en la carga...');
      });
  }

}
