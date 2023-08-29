import { Announcement as AnnouncementEntity } from '../../src/announcement'

export type Announcement = {
  datetime: AnnouncementEntity['announcedAt']
  msgEn: AnnouncementEntity['messageEn']
  msgZh: AnnouncementEntity['messageZh']
  uri: AnnouncementEntity['uri']
}
