import { Entity } from '@/core'

export class Booth implements Entity<string> {
  public readonly token: string
  public readonly name: string

  constructor(token: string, name: string) {
    this.token = token
    this.name = name
  }

  public get id(): string {
    return this.token
  }
}
