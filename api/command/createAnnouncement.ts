import { Command, getCurrentTime } from '@/core'
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
