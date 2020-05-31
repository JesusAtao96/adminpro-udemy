import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {
  tipo: string;
  id: string;

  oculto = 'd-none';

  notificacion = new EventEmitter<any>();

  constructor() { }

  ocultarModal() {
    this.oculto = 'd-none';
    this.id = null;
    this.tipo = null;
  }

  mostrarModal(tipo: string, id: string) {
    this.oculto = '';
    this.id = id;
    this.tipo = tipo;
  }

}
