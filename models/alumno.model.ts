import { PersonaModel } from "./persona.model"

export class AlumnoModel extends PersonaModel {


    constructor(
        nombre: string,
        apellido: string,
        email: string,
        private legajo: number,
        private fechaAlta: string = new Date().toISOString().split("T")[0],
        private modificacion: string = new Date().toISOString().split("T")[0],
        private isActive: boolean = true
    ) {

        super(nombre, apellido, email)

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
        return this.isActive
    }

    public setIsActive(isActive: boolean): void {
        this.isActive = isActive
    }

    // todos los atributos
    public override getAllAttributes(): {

        legajo: number,
        nombre: string,
        apellido: string,
        email: string,
        fechaAlta: string,
        modificacion: string,
        isActive: boolean
    } {

        return {
            legajo: this.legajo,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            fechaAlta: this.fechaAlta,
            modificacion: this.modificacion,
            isActive: this.isActive
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
            typeof data.isActive !== "boolean"
        ) {

            errors.push(
                "isActive debe ser boolean"
            )

        }

        return errors

    }

}