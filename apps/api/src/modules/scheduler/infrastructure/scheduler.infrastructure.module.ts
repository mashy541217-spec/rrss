import { Module } from '@nestjs/common';
import { PrismaSchedulerRepository } from './database/repositories/PrismaSchedulerRepository';
import { PrismaScheduleRepository } from './database/repositories/PrismaScheduleRepository';
import { SchedulerMapper } from './database/mappers/SchedulerMapper';
import { ScheduleMapper } from './database/mappers/ScheduleMapper';
import { ReservationMapper } from './database/mappers/ReservationMapper';

@Module({
  providers: [
    PrismaSchedulerRepository,
    PrismaScheduleRepository,
    SchedulerMapper,
    ScheduleMapper,
    ReservationMapper,
  ],
  exports: [
    PrismaSchedulerRepository,
    PrismaScheduleRepository,
  ]
})
export class SchedulerInfrastructureModule {}
