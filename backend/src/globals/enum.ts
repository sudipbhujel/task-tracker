export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum TaskDeadline {
  PAST = 'PAST',
  TODAY = 'TODAY',
  FUTURE = 'FUTURE',
}

export enum SortBy {
  priority = 'priority',
  deadline = 'deadline',
  updatedAt = 'updatedAt',
}

export enum OrderBy {
  desc = 'desc',
  asc = 'asc',
}
