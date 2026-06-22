import { IEventBus } from '@rrss-auto/application';
import { IResourcePoolRepository } from '../../../domain/repositories/IResourcePoolRepository';
import { ResourceType } from '../../../domain/value-objects/ResourceType';
import { ResourceId } from '../../../domain/value-objects/ResourceId';
import { ResourceRecovered } from '../../../domain/domain-events/ResourceRecovered';

export interface RecoverResourceCommand {
  resourceType: string;
  resourceId: string;
}

export class RecoverResourceUseCase {
  constructor(
    private readonly poolRepo: IResourcePoolRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: RecoverResourceCommand): Promise<void> {
    const pool = await this.poolRepo.findByType(ResourceType.create(command.resourceType));
    if (!pool) throw new Error(`Pool for ${command.resourceType} not initialized`);

    // Reclaim capacity. In a real scenario, we'd verify the resource's actual state 
    // instead of blindly releasing 1 unit.
    pool.release(1);
    await this.poolRepo.save(pool);
    
    await this.eventBus.publish(new ResourceRecovered(ResourceId.create(command.resourceId)));
    await this.eventBus.publishAll(pool.domainEvents);
    pool.clearDomainEvents();
  }
}
