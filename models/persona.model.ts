export class PersonaModel {
  protected nombre: string
  protected apellido: string
  protected email: string
  constructor(nombre: string, apellido: string, email: string) {
    this.nombre = nombre
    this.apellido = apellido
    this.email = email
  }

  // nombre
  public getNombre(): string {
    return this.nombre
  }
  public setNombre(nombre: string): void {
    this.nombre = nombre
  }

  // apellido
  public getApellido(): string {
    return this.apellido
  }
  public setApellido(apellido: string): void {
    this.apellido = apellido
  }

  // nombre completo (nombre + apelido)
  public getNombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`
  }

  // email
  public getEmail(): string {
    return this.email
  }
  public setEmail(email: string): void {
    this.email = email
  }

  // devolver todos los atributos en un objeto literal/plano (es como un JSON)
  public getAllAttributes(): object {
    return {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email
    }
  }
}
