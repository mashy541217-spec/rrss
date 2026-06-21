"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceTimezone = void 0;
const domain_1 = require("@rrss-auto/domain");
const InvalidTimezoneException_1 = require("../exceptions/InvalidTimezoneException");
class WorkspaceTimezone extends domain_1.ValueObject {
    constructor(props) {
        super(props);
    }
    get value() {
        return this.props.value;
    }
    static create(value) {
        if (!value || value.trim().length === 0) {
            throw new InvalidTimezoneException_1.InvalidTimezoneException('Timezone cannot be empty');
        }
        const trimmedValue = value.trim();
        try {
            Intl.DateTimeFormat(undefined, { timeZone: trimmedValue });
        }
        catch (e) {
            throw new InvalidTimezoneException_1.InvalidTimezoneException(`Timezone '${trimmedValue}' is not a valid IANA timezone`);
        }
        return new WorkspaceTimezone({ value: trimmedValue });
    }
}
exports.WorkspaceTimezone = WorkspaceTimezone;
