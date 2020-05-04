import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor(public usuarioService: UsuarioService) { }

  ngOnInit() {
  }

}
