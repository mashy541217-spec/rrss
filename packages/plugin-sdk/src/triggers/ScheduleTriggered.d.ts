export interface ScheduleTriggeredEvent {
    readonly cronExpression: string;
    readonly scheduledTime: Date;
    readonly triggerTime: Date;
}
