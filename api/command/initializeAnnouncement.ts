import { Command, getCurrentTime } from '@/core'
import { AnnouncementRepository } from './repository'

export type InitializeAnnouncementInput = {
  messageEn: string | null
  messageZh: string | null
  uri: string
  roles: string[]
}

export class InitializeAnnouncement implements Command<InitializeAnnouncementInput, void> {
  private readonly announcementRepository: AnnouncementRepository

  constructor(announcementRepository: AnnouncementRepository) {
    this.announcementRepository = announcementRepository
  }

  public async execute(input: InitializeAnnouncementInput): Promise<void> {
    const stubbedId = crypto.randomUUID()
    const params = {
      id: stubbedId,
      announcedAt: getCurrentTime().toISOString(),
      messageEn: input.messageEn,
      messageZh: input.messageZh,
      uri: input.uri,
      roles: input.roles,
    }
    await this.announcementRepository.create(params)
  }
}
