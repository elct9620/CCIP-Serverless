export enum ScenarioLocale {
	zhTW = 'zh-TW',
	enUS = 'en-US',
}

export type LocalizedText = Partial<Record<ScenarioLocale, string>>

export type ScenarioAttribute = {
	id: string
	order?: number
	displayText?: LocalizedText
}

export class Scenario {
	public readonly id: string
	public readonly order: number

	private _displayText: LocalizedText = {}

	constructor(attribute: ScenarioAttribute) {
		this.id = attribute.id
		this.order = attribute.order || 0
		this._displayText = attribute.displayText ?? {}
	}

	get displayText(): LocalizedText {
		return { ...this._displayText }
	}
}
