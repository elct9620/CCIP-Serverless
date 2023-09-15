export type Announcement = {
  announcedAt: Date
  messageEn: string | null
  messageZh: string | null
  uri: string
}

export type CreateAnnouncementParams = {
  messageEn: string | null
  messageZh: string | null
  uri: string
  roles: string[]
}
