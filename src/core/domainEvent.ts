export interface DomainEvent {
  get id(): string
  get aggregateId(): string
  get occurredAt(): Date
}
