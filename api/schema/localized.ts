export enum Languages {
  zhTW = 'zh-TW',
  enUS = 'en-US',
}

export type LocalizedText = Partial<Record<Languages, string>>
