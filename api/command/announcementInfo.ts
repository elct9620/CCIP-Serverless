import { Announcement } from '@api/schema'
import { AnnouncementRepository } from './repository'

export type AnnouncementReply = Announcement[]

export class AnnouncementInfo {
  private readonly announcementRepository: AnnouncementRepository

  constructor(announcementRepository: AnnouncementRepository) {
    this.announcementRepository = announcementRepository
  }

  public async create(_params: Record<string, unknown>): Promise<void> {
    const fixedValue = {
      id: crypto.randomUUID(),
      announcedAt: new Date('2023-08-27 00:00:00 GMT+8').toISOString(),
      messageEn: 'hello world',
      messageZh: '世界你好',
      uri: 'https://testability.opass.app/announcements/1',
      roles: ['audience'],
    }
    await this.announcementRepository.create(fixedValue)
  }
}
