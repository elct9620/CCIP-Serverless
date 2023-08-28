type Attributes = {
  token: string
  eventId: string
  displayName: string
  firstUsedAt?: Date
  role: AttendeeRole
  metadata: Record<string, any>
}

export enum AttendeeRole {
  Audience = 'audience',
  Staff = 'staff',
}

export class Attendee {
  public readonly token: string
  public readonly eventId: string
  public readonly displayName: string
  public readonly role: AttendeeRole = AttendeeRole.Audience

  private _metadata: Record<string, any> = {}
  private _firstUsedAt: Date | null = null

  constructor(attributes: Attributes) {
    this.token = attributes.token
    this.eventId = attributes.eventId
    this.displayName = attributes.displayName
    this.role = attributes.role
    this._metadata = attributes.metadata
    this._firstUsedAt = attributes.firstUsedAt ?? null
  }

  get firstUsedAt(): Date | null {
    return this._firstUsedAt
  }

  get metadata(): Record<string, any> {
    const publicMetadata: Record<string, any> = {}
    for (const key in this._metadata) {
      if (key.startsWith('_')) {
        continue
      }
      publicMetadata[key] = this._metadata[key]
    }

    return publicMetadata
  }

  getMetadata(key: string): any {
    return this._metadata[key]
  }

  setMetadata(key: string, value: any): void {
    this._metadata[key] = value
  }

  touch(): void {
    if (!this._firstUsedAt) {
      this._firstUsedAt = new Date()
    }
  }

  isUsedScenario(scenarioId: string): boolean {
    return !!this.getMetadata(`_scenario_${scenarioId}`)
  }

  getScenarioUsedTime(scenarioId: string): Date | null {
    if (!this.isUsedScenario(scenarioId)) {
      return null
    }

    try {
      return new Date(this.getMetadata(`_scenario_${scenarioId}`))
    } catch (e) {
      return null
    }
  }

  useScenario(scenarioId: string, usedAt: Date): void {
    if (this.isUsedScenario(scenarioId)) {
      return
    }

    this.setMetadata(`_scenario_${scenarioId}`, usedAt)
  }
}
