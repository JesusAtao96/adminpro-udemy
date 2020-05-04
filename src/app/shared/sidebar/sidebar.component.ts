import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  constructor(public sidebarService: SidebarService, public usuarioService: UsuarioService) { }

  ngOnInit() {
  }

}
