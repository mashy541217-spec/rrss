import { ITracer } from '../tracing/ITracer';
import { ILogger } from '../logging/ILogger';
import { IMetricsProvider } from '../metrics/IMetricsProvider';
import { PluginTelemetry } from '../metrics/PluginTelemetry';
import { AiTelemetry } from '../metrics/AiTelemetry';
import { IReplayManager } from '../replay/IReplayManager';

export class TelemetryManager {
  private static instance: TelemetryManager;

  public tracer!: ITracer;
  public logger!: ILogger;
  public metrics!: IMetricsProvider;
  public replayManager!: IReplayManager;

  public pluginTelemetry!: PluginTelemetry;
  public aiTelemetry!: AiTelemetry;

  private constructor() {}

  public static getInstance(): TelemetryManager {
    if (!TelemetryManager.instance) {
      TelemetryManager.instance = new TelemetryManager();
    }
    return TelemetryManager.instance;
  }

  public initialize(
    tracer: ITracer,
    logger: ILogger,
    metrics: IMetricsProvider,
    replayManager: IReplayManager
  ) {
    this.tracer = tracer;
    this.logger = logger;
    this.metrics = metrics;
    this.replayManager = replayManager;

    this.pluginTelemetry = new PluginTelemetry(this.metrics);
    this.aiTelemetry = new AiTelemetry(this.metrics);
    
    console.log('[TelemetryManager] Global Observability initialized.');
  }
}
