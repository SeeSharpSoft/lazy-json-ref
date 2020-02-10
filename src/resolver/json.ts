"use strict";

import { ExternalResolver, getBasePath } from "./external";

const fs = require("fs");

export class JsonResolver extends ExternalResolver {
    canHandle($ref: string): boolean {
        return super.canHandle($ref) && $ref.endsWith(".json");
    }

    getJsonFromFile(path: string): any {
        try {
            const jsonString = fs.readFileSync(path);
            return JSON.parse(jsonString);
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }
}
