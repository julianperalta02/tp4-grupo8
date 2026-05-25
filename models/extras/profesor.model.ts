import { PersonaModel } from "../persona.model"

export class ProfesorModel extends PersonaModel {

    constructor(
        nombre: string,
        apellido: string,
        email: string,
        private legajoProfesor: number,
        private especialidad: string
    ) {

        super(nombre, apellido, email)

    }

    // getters
    public getLegajoProfesor(): number {
        return this.legajoProfesor
    }

    public getEspecialidad(): string {
        return this.especialidad
    }

    // setters
    public setEspecialidad(especialidad: string): void {
        this.especialidad = especialidad
    }

    // atributos
    public override getAllAttributes(): {

        legajoProfesor: number,
        nombre: string,
        apellido: string,
        email: string,
        especialidad: string

    } {

        return {

            legajoProfesor: this.legajoProfesor,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            especialidad: this.especialidad

        }

    }

    // validaciones
    public static override validate(data: any): string[] {

        const errors = super.validate(data)

        if (
            data.legajoProfesor === undefined ||
            typeof data.legajoProfesor !== "number"
        ) {
            errors.push("El legajoProfesor es obligatorio")
        }

        if (
            !data.especialidad ||
            typeof data.especialidad !== "string"
        ) {
            errors.push("La especialidad es obligatoria")
        }

        return errors
    }
}