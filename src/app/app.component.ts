import { Component } from '@angular/core';
import { SettingsService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public settingsService: SettingsService) {}
}
