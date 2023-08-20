export enum ScenarioLocale {
	zhTW = 'zh-TW',
	enUS = 'en-US',
}

export type LocalizedText = Partial<Record<ScenarioLocale, string>>

type ValueMatchCondition = {
	key: string
	value: string
}

export type ScenarioAttribute = {
	id: string
	order?: number
	displayText?: LocalizedText
	showCondition?: ValueMatchCondition
	locked?: boolean
	lockReason?: string
}

export class Scenario {
	public readonly id: string
	public readonly order: number

	private _displayText: LocalizedText = {}
	private _showCondition?: ValueMatchCondition

	private _locked: boolean = false
	private _lockReason?: string

	constructor(attribute: ScenarioAttribute) {
		this.id = attribute.id
		this.order = attribute.order || 0
		this._displayText = attribute.displayText ?? {}
		this._showCondition = attribute.showCondition
		this._locked = attribute.locked ?? false
		this._lockReason = attribute.lockReason
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

	get isLocked(): boolean {
		return this._locked
	}

	get lockReason(): string {
		return this._lockReason || 'Locked'
	}
}
