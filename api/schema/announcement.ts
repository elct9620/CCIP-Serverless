export type Announcement = {
  announcedAt: Date
  message: Record<string, string | null>
  uri: string
  roles: string[]
}

export type CreateAnnouncementPayload = {
  msg_en: string | null
  msg_zh: string | null
  uri: string
  role: string[]
}
