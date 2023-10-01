import { Entity } from '@/core'

export enum AnnouncementLocales {
  zhTW = 'zh-TW',
  enUS = 'en-US',
}

export type LocalizedText = Partial<Record<AnnouncementLocales, string>>

type Attributes = {
  id: string
  announcedAt: Date
  messageEn: string | null
  messageZh: string | null
  message: LocalizedText
  uri: string
  roles?: string[]
}

export class Announcement implements Entity<string> {
  public readonly id: string
  public readonly announcedAt: Date
  public readonly messageEn: string | null
  public readonly messageZh: string | null
  public readonly message: LocalizedText
  public readonly uri: string
  public readonly roles: string[]

  constructor(attributes: Attributes) {
    this.id = attributes.id
    this.announcedAt = attributes.announcedAt
    this.messageEn = attributes.messageEn
    this.messageZh = attributes.messageZh
    this.message = attributes.message
    this.uri = attributes.uri
    this.roles = attributes.roles ?? []
  }
}
