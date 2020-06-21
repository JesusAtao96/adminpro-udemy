import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services';
import { Usuario } from './../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;

  constructor(public sidebarService: SidebarService, public usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuario = this.usuarioService.usuario;
    this.sidebarService.cargarMenu();
  }

}
