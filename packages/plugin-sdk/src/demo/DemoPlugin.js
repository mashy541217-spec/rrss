"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoPlugin = void 0;
const PluginCapability_1 = require("../interfaces/PluginCapability");
class DemoPlugin {
    manifest = {
        id: 'demo-plugin',
        name: 'Demo Plugin',
        version: '1.0.0',
        description: 'Reference implementation proving dynamic loading works',
        capabilities: [PluginCapability_1.PluginCapability.Publishing, PluginCapability_1.PluginCapability.Messaging],
        metadata: {
            author: 'RRSS AUTO Core Team',
            license: 'MIT',
        },
    };
    isEnabled = false;
    async onInstall(context) {
        context.logger.info('DemoPlugin: onInstall hooks triggered successfully');
    }
    async onEnable(context, config) {
        this.isEnabled = true;
        context.logger.info('DemoPlugin: onEnable hooks triggered successfully', config.settings);
    }
    async onDisable(context) {
        this.isEnabled = false;
        context.logger.info('DemoPlugin: onDisable hooks triggered successfully');
    }
    async onUpgrade(context, oldVersion, newVersion) {
        context.logger.info(`DemoPlugin: Upgraded from ${oldVersion} to ${newVersion}`);
    }
    async onRemove(context) {
        context.logger.info('DemoPlugin: onRemove hooks triggered successfully');
    }
    async executeAction(actionName, context, config, params) {
        if (!this.isEnabled) {
            throw new Error('Plugin is disabled');
        }
        context.logger.info(`DemoPlugin: Executing action: ${actionName} with params:`, params);
        switch (actionName) {
            case 'PublishContent':
                return {
                    success: true,
                    externalId: `ext-pub-${Date.now()}`,
                    url: `https://demo-platform.example.com/posts/${Date.now()}`,
                    metadata: { params, settings: config.settings },
                };
            case 'SendMessage':
                return {
                    success: true,
                    messageId: `msg-${Date.now()}`,
                };
            default:
                throw new Error(`Action ${actionName} is not supported by DemoPlugin`);
        }
    }
    async checkHealth(context, config) {
        return {
            isHealthy: this.isEnabled,
            lastCheckedAt: new Date(),
            message: this.isEnabled ? 'Plugin is operating normally' : 'Plugin is disabled',
        };
    }
}
exports.DemoPlugin = DemoPlugin;
