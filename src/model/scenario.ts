import { Condition } from './condition'

export enum ScenarioLocale {
	zhTW = 'zh-TW',
	enUS = 'en-US',
}

export enum ScenarioConditionType {
	Visible = 'show',
	Unlock = 'unlock',
}

export type LocalizedText = Partial<Record<ScenarioLocale, string>>

type ValueMatchCondition = {
	key: string
	value: string
}

export type ScenarioAttribute = {
	order?: number
	displayText?: LocalizedText
	showCondition?: ValueMatchCondition
	locked?: boolean
	lockReason?: string
	unlockCondition?: ValueMatchCondition
}

type ScenarioConditionMap = Record<ScenarioConditionType, Condition[]>

export class Scenario {
	public readonly order: number

	private conditions: Partial<ScenarioConditionMap> = {}

	private _displayText: LocalizedText = {}
	private _visible: boolean = true
	private _showCondition?: ValueMatchCondition

	private _locked: boolean = false
	private _lockReason?: string
	private _unlockCondition?: ValueMatchCondition

	constructor(attribute: ScenarioAttribute) {
		this.order = attribute.order || 0

		this._displayText = attribute.displayText ?? {}
		this._showCondition = attribute.showCondition

		this._locked = attribute.locked ?? false
		this._lockReason = attribute.lockReason
		this._unlockCondition = attribute.unlockCondition
	}

	addCondition(type: ScenarioConditionType, condition: Condition): void {
		if (!this.conditions[type]) {
			this.conditions[type] = []
		}

		this.conditions[type]?.push(condition)
	}

	conditionsOf(type: ScenarioConditionType): Condition[] {
		return this.conditions[type] ?? []
	}

	get displayText(): LocalizedText {
		return { ...this._displayText }
	}

	get showCondition(): ValueMatchCondition | null {
		if (!this._showCondition) {
			return null
		}

		return { ...this._showCondition }
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

	unlock(): void {
		this._locked = false
	}

	get lockReason(): string {
		return this._lockReason || 'Locked'
	}

	get unlockCondition(): ValueMatchCondition | null {
		if (!this._unlockCondition) {
			return null
		}

		return { ...this._unlockCondition }
	}
}
