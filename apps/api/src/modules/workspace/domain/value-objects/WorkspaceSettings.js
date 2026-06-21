"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceSettings = void 0;
const domain_1 = require("@rrss-auto/domain");
class WorkspaceSettings extends domain_1.ValueObject {
    constructor(props) {
        super(props);
    }
    get timezone() {
        return this.props.timezone;
    }
    get locale() {
        return this.props.locale;
    }
    static create(timezone, locale) {
        if (!locale || locale.trim().length === 0) {
            throw new Error('Locale cannot be empty');
        }
        return new WorkspaceSettings({
            timezone,
            locale: locale.trim()
        });
    }
    updateTimezone(newTimezone) {
        return new WorkspaceSettings({
            ...this.props,
            timezone: newTimezone
        });
    }
    updateLocale(newLocale) {
        if (!newLocale || newLocale.trim().length === 0) {
            throw new Error('Locale cannot be empty');
        }
        return new WorkspaceSettings({
            ...this.props,
            locale: newLocale.trim()
        });
    }
}
exports.WorkspaceSettings = WorkspaceSettings;
