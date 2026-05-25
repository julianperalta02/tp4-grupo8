import { PersonaModel } from './persona.model.ts';

export class AlumnoModel extends PersonaModel {
    //no modificable
    private legajo: number;
    //no modificable
    private fechaAlta: string = new Date().toISOString().split('T')[0];
    private modificacion: string = new Date().toISOString().split('T')[0];
    private activo: boolean = true;

    constructor(nombre: string, apellido: string, email: string, legajo: number, fechaAlta: string, modificacion: string, activo: boolean) {
        super(nombre, apellido, email);
        this.legajo = legajo;
        this.fechaAlta = fechaAlta;
        this.modificacion = modificacion;
        this.activo = activo;
    }

    public getLegajo(): number {
        return this.legajo;
    }
    public getFechaAlta(): string {
        return this.fechaAlta;
    }
    public getModificacion(): string {
        return this.modificacion;
    }
    public setModificacion(modificacion: string): void {
        this.modificacion = modificacion;
    }
    public getActivo(): boolean {
        return this.activo;
    }
    public setActivo(activo: boolean): void {
        this.activo = activo;
    }

    public override getAllAttributes(): Object {
        return {
            ...super.getAllAttributes(),
            legajo: this.legajo,
            fechaAlta: this.fechaAlta,
            modificacion: this.modificacion,
            activo: this.activo
        }
    }
}