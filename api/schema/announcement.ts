export type Announcement = {
  announcedAt: Date
  messageEn: string | null
  messageZh: string | null
  uri: string
}

export type CreateAnnouncementPayload = {
  msg_en: string | null
  msg_zh: string | null
  uri: string
  role: string | string[]
}
