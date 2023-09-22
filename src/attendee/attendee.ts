import { Entity, getCurrentTime } from '@/core'

type MetadataValue = string | number | boolean | null
type Attributes = {
  token: string
  eventId: string
  displayName: string
  firstUsedAt?: Date
  role: AttendeeRole
  metadata: Record<string, MetadataValue>
}

export enum AttendeeRole {
  Audience = 'audience',
  Staff = 'staff',
}

export class Attendee implements Entity<string> {
  public readonly token: string
  public readonly eventId: string
  public readonly displayName: string
  public readonly role: AttendeeRole = AttendeeRole.Audience

  private _metadata: Record<string, MetadataValue> = {}
  private _firstUsedAt: Date | null = null

  constructor(attributes: Attributes) {
    this.token = attributes.token
    this.eventId = attributes.eventId
    this.displayName = attributes.displayName
    this.role = attributes.role
    this._metadata = attributes.metadata
    this._firstUsedAt = attributes.firstUsedAt ?? null
  }

  get id(): string {
    return this.token
  }

  get firstUsedAt(): Date | null {
    return this._firstUsedAt
  }

  get metadata(): Record<string, MetadataValue> {
    const publicMetadata: Record<string, MetadataValue> = {}
    for (const key in this._metadata) {
      if (key.startsWith('_')) {
        continue
      }
      publicMetadata[key] = this._metadata[key]
    }

    return publicMetadata
  }

  get metadataWithHidden(): Record<string, MetadataValue> {
    return this._metadata
  }

  getMetadata(key: string): MetadataValue {
    return this._metadata[key]
  }

  setMetadata(key: string, value: MetadataValue): void {
    this._metadata[key] = value
  }

  touch(): void {
    if (!this._firstUsedAt) {
      this._firstUsedAt = getCurrentTime()
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
      return new Date(this.getMetadata(`_scenario_${scenarioId}`) as string)
    } catch (e) {
      return null
    }
  }

  useScenario(scenarioId: string, usedAt: Date): void {
    if (this.isUsedScenario(scenarioId)) {
      return
    }

    this.setMetadata(`_scenario_${scenarioId}`, usedAt.toISOString())
  }
}
