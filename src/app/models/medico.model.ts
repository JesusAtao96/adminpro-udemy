
import { Usuario } from './usuario.model';

export class Medico {

    constructor(
        public nombre?: string,
        public img?: string,
        public usuario?: Usuario,
        public hospital?: any,
        // tslint:disable-next-line: variable-name
        public _id?: string
    ) { }
}
