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
}
