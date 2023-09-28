import { Command, getCurrentTime } from '@/core'
import { Announcement } from '@/announcement'
import { AnnouncementRepository } from './repository'

export type CreateAnnouncementInput = {
  messageEn: string | null
  messageZh: string | null
  uri: string
  roles: string[]
}

export class CreateAnnouncement implements Command<CreateAnnouncementInput, void> {
  private readonly announcementRepository: AnnouncementRepository

  constructor(announcementRepository: AnnouncementRepository) {
    this.announcementRepository = announcementRepository
  }

  public async execute(input: CreateAnnouncementInput): Promise<void> {
    const announcementId = crypto.randomUUID()
    const announcement = new Announcement({
      id: announcementId,
      announcedAt: getCurrentTime(),
      messageEn: input.messageEn,
      messageZh: input.messageZh,
      uri: input.uri,
      roles: input.roles,
    })
    await this.announcementRepository.create(announcement)
  }
}
