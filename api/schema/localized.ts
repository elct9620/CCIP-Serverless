import { z } from 'zod'

export enum Languages {
  zhTW = 'zh-TW',
  enUS = 'en-US',
}

export type LocalizedText = z.infer<typeof localizedTextSchema>
export const localizedTextSchema = z
  .record(z.nativeEnum(Languages), z.string())
  .describe('RFC5646 Language Tag => Text')
  .default({ 'en-US': 'Check-in' })
