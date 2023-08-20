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
}

export class Scenario {
	public readonly id: string
	public readonly order: number

	private _displayText: LocalizedText = {}
	private _showCondition?: ValueMatchCondition

	constructor(attribute: ScenarioAttribute) {
		this.id = attribute.id
		this.order = attribute.order || 0
		this._displayText = attribute.displayText ?? {}
		this._showCondition = attribute.showCondition
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
}
