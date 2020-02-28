import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html'
})
export class GraficoDonaComponent implements OnInit {
  @Input() public labels: Label[] = [];
  @Input() public data: SingleDataSet = [];
  @Input() public type: ChartType = 'doughnut';

  constructor() { }

  ngOnInit() {
  }

}
