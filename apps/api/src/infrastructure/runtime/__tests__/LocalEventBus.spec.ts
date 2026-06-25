import { LocalEventBus } from '../bus/LocalEventBus';
import { EventHandlerRegistry } from '../bus/EventHandlerRegistry';

describe('LocalEventBus', () => {
  let registry: EventHandlerRegistry;
  let eventBus: LocalEventBus;

  beforeEach(() => {
    registry = new EventHandlerRegistry();
    eventBus = new LocalEventBus(registry);
  });

  it('should dispatch event to registered handlers', async () => {
    const handler1 = { handle: jest.fn().mockResolvedValue(undefined) };
    const handler2 = { handle: jest.fn().mockResolvedValue(undefined) };

    registry.register('TestEvent', handler1);
    registry.register('TestEvent', handler2);

    const event = { eventType: 'TestEvent', payload: 'data' };

    await eventBus.publish(event);

    expect(handler1.handle).toHaveBeenCalledWith(event);
    expect(handler2.handle).toHaveBeenCalledWith(event);
  });

  it('should not crash if no handlers are registered', async () => {
    const event = { eventType: 'UnknownEvent' };
    
    // Should not throw
    await expect(eventBus.publish(event)).resolves.not.toThrow();
  });

  it('should dispatch multiple events', async () => {
    const handler = { handle: jest.fn().mockResolvedValue(undefined) };
    registry.register('EventA', handler);
    registry.register('EventB', handler);

    await eventBus.publishAll([
      { eventType: 'EventA' },
      { eventType: 'EventB' }
    ]);

    expect(handler.handle).toHaveBeenCalledTimes(2);
  });
});
