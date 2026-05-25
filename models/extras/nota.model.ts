export class NotaModel {

    constructor(
        private id: number,
        private legajo: number,
        private idMateria: string,
        private nota: number,
        private fecha: string
    ) { }

    // getters
    public getId(): number {
        return this.id
    }

    public getLegajo(): number {
        return this.legajo
    }

    public getIdMateria(): string {
        return this.idMateria
    }

    public getNota(): number {
        return this.nota
    }

    public getFecha(): string {
        return this.fecha
    }

    // setters
    public setNota(nota: number): void {
        this.nota = nota
    }

    public setFecha(fecha: string): void {
        this.fecha = fecha
    }

    // atributos
    public getAllAttributes(): {
        id: number,
        legajo: number,
        idMateria: string,
        nota: number,
        fecha: string
    } {

        return {
            id: this.id,
            legajo: this.legajo,
            idMateria: this.idMateria,
            nota: this.nota,
            fecha: this.fecha
        }

    }
    // validaciones
    public static validate(data: any): string[] {

        const errors: string[] = []

        if (
            data.id === undefined ||
            typeof data.id !== "number"
        ) {
            errors.push("El id es obligatorio")
        }

        if (
            data.legajo === undefined ||
            typeof data.legajo !== "number"
        ) {
            errors.push("El legajo es obligatorio")
        }

        if (
            !data.idMateria ||
            typeof data.idMateria !== "string"
        ) {
            errors.push("idMateria es obligatorio")
        }

        if (
            data.nota === undefined ||
            typeof data.nota !== "number"
        ) {
            errors.push("La nota es obligatoria")
        }

        if (
            !data.fecha ||
            typeof data.fecha !== "string"
        ) {
            errors.push("La fecha es obligatoria")
        }

        return errors
    }
}