"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Interfaces
__exportStar(require("./interfaces/Plugin"), exports);
__exportStar(require("./interfaces/PluginManifest"), exports);
__exportStar(require("./interfaces/PluginMetadata"), exports);
__exportStar(require("./interfaces/PluginCapability"), exports);
__exportStar(require("./interfaces/PluginConfiguration"), exports);
__exportStar(require("./interfaces/PluginContext"), exports);
__exportStar(require("./interfaces/PluginLifecycle"), exports);
__exportStar(require("./interfaces/PluginRegistry"), exports);
__exportStar(require("./interfaces/PluginLoader"), exports);
__exportStar(require("./interfaces/PluginInstaller"), exports);
__exportStar(require("./interfaces/PluginHealth"), exports);
// Actions
__exportStar(require("./actions/PublishContent"), exports);
__exportStar(require("./actions/UploadMedia"), exports);
__exportStar(require("./actions/DownloadMedia"), exports);
__exportStar(require("./actions/SendMessage"), exports);
__exportStar(require("./actions/ReadMessages"), exports);
__exportStar(require("./actions/CreateCampaign"), exports);
__exportStar(require("./actions/UpdateCampaign"), exports);
__exportStar(require("./actions/DeleteCampaign"), exports);
__exportStar(require("./actions/CreateLead"), exports);
__exportStar(require("./actions/UpdateLead"), exports);
// Triggers
__exportStar(require("./triggers/WebhookReceived"), exports);
__exportStar(require("./triggers/ScheduleTriggered"), exports);
__exportStar(require("./triggers/MessageReceived"), exports);
__exportStar(require("./triggers/PublicationCompleted"), exports);
__exportStar(require("./triggers/ExecutionCompleted"), exports);
// Auth
__exportStar(require("./auth/OAuth2"), exports);
__exportStar(require("./auth/ApiKey"), exports);
__exportStar(require("./auth/BearerToken"), exports);
__exportStar(require("./auth/CookieSession"), exports);
__exportStar(require("./auth/UsernamePassword"), exports);
// Registry & Demo
__exportStar(require("./registry/DefaultPluginRegistry"), exports);
__exportStar(require("./registry/DefaultPluginLoader"), exports);
__exportStar(require("./demo/DemoPlugin"), exports);
