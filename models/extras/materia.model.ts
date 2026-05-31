export class MateriaModel {

    constructor(
        private idMateria: string,
        private nombre: string,
        private cuatrimestre: number
    ) { }

    // getters
    public getIdMateria(): string {
        return this.idMateria
    }

    public getNombre(): string {
        return this.nombre
    }

    public getCuatrimestre(): number {
        return this.cuatrimestre
    }

    // setters
    public setNombre(nombre: string): void {
        this.nombre = nombre
    }

    public setCuatrimestre(cuatrimestre: number): void {
        this.cuatrimestre = cuatrimestre
    }

    // atributos
    public getAllAttributes(): {
        idMateria: string,
        nombre: string,
        cuatrimestre: number
    } {

        return {
            idMateria: this.idMateria,
            nombre: this.nombre,
            cuatrimestre: this.cuatrimestre
        }

    }

    // validaciones
    public static validate(data: any): string[] {

        const errors: string[] = []

        if (
            !data.idMateria ||
            typeof data.idMateria !== "string"
        ) {
            errors.push("idMateria es obligatorio")
        }

        if (
            !data.nombre ||
            typeof data.nombre !== "string"
        ) {
            errors.push("El nombre es obligatorio")
        }

        if (
            data.cuatrimestre === undefined ||
            typeof data.cuatrimestre !== "number"
        ) {
            errors.push("El cuatrimestre es obligatorio")
        }

        return errors
    }
}