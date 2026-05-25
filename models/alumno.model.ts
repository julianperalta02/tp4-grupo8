import { PersonaModel } from './persona.model.ts'

export class AlumnoModel extends PersonaModel {

    //no modificable
    private legajo: number
    //no modificable
    private fechaAlta: string = new Date().toISOString().split('T')[0]
    private modificacion: string = new Date().toISOString().split('T')[0]
    private activo: boolean = true
    constructor(nombre: string, apellido: string, email: string, legajo: number, fechaAlta: string, modificacion: string, activo: boolean) {
        super(nombre, apellido, email)
        this.legajo = legajo
        this.fechaAlta = fechaAlta
        this.modificacion = modificacion
        this.activo = activo
    }

    // legajo
    public getLegajo(): number {
        return this.legajo
    }


    // fechaAlta
    public getFechaAlta(): string {
        return this.fechaAlta
    }

    // modificacion
    public getModificacion(): string {
        return this.modificacion
    }

    public setModificacion(modificacion: string): void {
        this.modificacion = modificacion
    }

    // isActive
    public getIsActive(): boolean {
        return this.activo
    }

    public setActivo(activo: boolean): void {
        this.activo = activo;
    }

    // todos los atributos
    public override getAllAttributes(): Object {
        return {
            ...super.getAllAttributes(),
            legajo: this.legajo,
            fechaAlta: this.fechaAlta,
            modificacion: this.modificacion,
            activo: this.activo
        }
    }

    // validaciones
    public static validate(data: any): string[] {

        const errors = super.validate(data)

        if (
            data.legajo === undefined ||
            typeof data.legajo !== "number"
        ) {

            errors.push(
                "El legajo es obligatorio y debe ser numérico"
            )

        }

        if (
            !data.fechaAlta ||
            typeof data.fechaAlta !== "string"
        ) {

            errors.push(
                "La fechaAlta es obligatoria"
            )

        }

        if (
            !data.modificacion ||
            typeof data.modificacion !== "string"
        ) {

            errors.push(
                "La modificación es obligatoria"
            )

        }

        if (
            typeof data.activo !== "boolean"
        ) {

            errors.push(
                "activo debe ser boolean"
            )

        }

        return errors

    }

}