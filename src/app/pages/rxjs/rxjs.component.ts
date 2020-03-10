import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor() {
    this.subscription = this.regresaObservable()
      .subscribe(
        numero => console.log('Subs ', numero),
        error => console.error('Errow en el obs', error),
        () => console.log('El observador terminó!')
      );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let contador = 0;
      const intervalo = setInterval(() => {
        contador += 1;

        const salida = {
          valor: contador
        };

        observer.next(salida);

        /* if (contador === 3) {
          clearInterval(intervalo);
          observer.complete();
        } */

        /* if (contador === 2) {
          // clearInterval(intervalo);
          observer.error('Auxilio!');
        } */
      }, 1000);
    }).pipe(
      // retry(2)
      map(resp => resp.valor),
      filter(valor => valor % 2 === 1)
    );
  }

}
