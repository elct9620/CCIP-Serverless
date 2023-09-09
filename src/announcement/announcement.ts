import { Entity } from '@/core'

type Attributes = {
  id: number
  announcedAt: Date
  messageEn: string | null
  messageZh: string | null
  uri: string
}

export class Announcement implements Entity<number> {
  public readonly id: number
  public readonly announcedAt: Date
  public readonly messageEn: string | null
  public readonly messageZh: string | null
  public readonly uri: string

  constructor(attributes: Attributes) {
    this.id = attributes.id
    this.announcedAt = attributes.announcedAt
    this.messageEn = attributes.messageEn
    this.messageZh = attributes.messageZh
    this.uri = attributes.uri
  }
}
