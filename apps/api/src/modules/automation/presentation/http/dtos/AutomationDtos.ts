import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsObject, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TriggerType } from '../../../domain/enums/TriggerType';
import { ExecutionStrategy } from '../../../domain/enums/ExecutionStrategy';

export class CreateAutomationDto {
  @ApiProperty() @IsString() @IsNotEmpty() workspaceRef: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}

export class DuplicateAutomationDto {
  @ApiProperty() @IsString() @IsNotEmpty() newName: string;
}

export class AddTriggerDto {
  @ApiProperty({ enum: TriggerType }) @IsEnum(TriggerType) type: TriggerType;
  @ApiProperty() @IsObject() configuration: Record<string, any>;
}

export class AddConditionDto {
  @ApiProperty() @IsString() @IsNotEmpty() type: string;
  @ApiProperty() @IsString() @IsNotEmpty() expression: string;
  @ApiProperty() @IsObject() configuration: Record<string, any>;
}

export class AddActionDto {
  @ApiProperty() @IsString() @IsNotEmpty() type: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsObject() configuration: Record<string, any>;
}

export class WorkflowNodeDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() type: 'Trigger' | 'Condition' | 'Action';
  @ApiProperty() @IsObject() config: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsNumber() positionX?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() positionY?: number;
}

export class WorkflowConnectionDto {
  @ApiProperty() @IsString() @IsNotEmpty() id: string;
  @ApiProperty() @IsString() @IsNotEmpty() sourceId: string;
  @ApiProperty() @IsString() @IsNotEmpty() targetId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceHandle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetHandle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() condition?: string;
}

export class UpdateWorkflowDto {
  @ApiProperty({ type: [WorkflowNodeDto] }) @IsArray() nodes: WorkflowNodeDto[];
  @ApiProperty({ type: [WorkflowConnectionDto] }) @IsArray() connections: WorkflowConnectionDto[];
}

export class GenerateExecutionPlanDto {
  @ApiPropertyOptional({ enum: ExecutionStrategy }) @IsOptional() @IsEnum(ExecutionStrategy) strategy?: ExecutionStrategy;
}
