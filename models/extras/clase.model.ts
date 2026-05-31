export class ClaseModel {

    constructor(
        private idClase: number,
        private idMateria: string,
        private aula: string,
        private horario: string
    ) { }

    // getters
    public getIdClase(): number {
        return this.idClase
    }

    public getIdMateria(): string {
        return this.idMateria
    }

    public getAula(): string {
        return this.aula
    }

    public getHorario(): string {
        return this.horario
    }

    // setters
    public setAula(aula: string): void {
        this.aula = aula
    }

    public setHorario(horario: string): void {
        this.horario = horario
    }

    // atributos
    public getAllAttributes(): {

        idClase: number,
        idMateria: string,
        aula: string,
        horario: string

    } {

        return {

            idClase: this.idClase,
            idMateria: this.idMateria,
            aula: this.aula,
            horario: this.horario

        }

    }

    // validaciones
    public static validate(data: any): string[] {

        const errors: string[] = []

        if (
            data.idClase === undefined ||
            typeof data.idClase !== "number"
        ) {
            errors.push("idClase es obligatorio")
        }

        if (
            !data.idMateria ||
            typeof data.idMateria !== "string"
        ) {
            errors.push("idMateria es obligatorio")
        }

        if (
            !data.aula ||
            typeof data.aula !== "string"
        ) {
            errors.push("El aula es obligatoria")
        }

        if (
            !data.horario ||
            typeof data.horario !== "string"
        ) {
            errors.push("El horario es obligatorio")
        }

        return errors
    }
}