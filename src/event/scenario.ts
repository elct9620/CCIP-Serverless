import { Condition } from './condition'

export enum ScenarioLocale {
  zhTW = 'zh-TW',
  enUS = 'en-US',
}
export type LocalizedText = Partial<Record<ScenarioLocale, string>>

export enum ScenarioConditionType {
  Visible = 'show',
  Unlock = 'unlock',
}
type ScenarioConditionMap = Record<ScenarioConditionType, Condition>

type MetadataTemplate = {
  key: string
}
type MetadataDefinition = Record<string, MetadataTemplate>

type AvailableTime = {
  start: Date
  end: Date
}

export type ScenarioAttribute = {
  availableTime: AvailableTime
  order?: number
  displayText?: LocalizedText
  metadataDefinition?: MetadataDefinition
}

export class Scenario {
  public readonly order: number
  public readonly availableTime: AvailableTime

  private conditions: Partial<ScenarioConditionMap> = {}

  public readonly metadataDefinition: MetadataDefinition = {}
  private _metadata: Record<string, any> = {}

  private _displayText: LocalizedText = {}
  private _visible: boolean = true

  private _locked: boolean = false
  private _lockReason?: string

  private _usedAt?: Date

  constructor(attribute: ScenarioAttribute) {
    this.order = attribute.order || 0
    this.availableTime = attribute.availableTime
    this._displayText = attribute.displayText ?? {}
    this.metadataDefinition = attribute.metadataDefinition ?? {}
  }

  setCondition(type: ScenarioConditionType, condition: Condition): void {
    this.conditions[type] = condition
  }

  conditionsOf(type: ScenarioConditionType): Condition {
    return this.conditions[type] ?? Condition.empty()
  }

  get displayText(): LocalizedText {
    return { ...this._displayText }
  }

  get isVisible(): boolean {
    return this._visible
  }

  hide(): void {
    this._visible = false
  }

  get isLocked(): boolean {
    return this._locked
  }

  get lockReason(): string {
    return this._lockReason || 'Locked'
  }

  lock(reason?: string): void {
    this._locked = true
    this._lockReason = reason
  }

  unlock(): void {
    this._locked = false
  }

  get metadata(): Record<string, any> {
    return { ...this._metadata }
  }

  setMetadata(key: string, value: any): void {
    this._metadata[key] = value
  }

  isAvailableAt(datetime: Date): boolean {
    return datetime >= this.availableTime.start && datetime < this.availableTime.end
  }

  get usedAt(): Date | null {
    return this._usedAt ?? null
  }

  useAt(datetime: Date): void {
    this._usedAt = datetime
  }
}
