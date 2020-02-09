"use strict";

import { Resolver, Priority } from "./factory";
import { LAZY_JSON_FILE, LazyJson } from "../index";

const fs = require("fs");

function getBasePath(context: any) {
    let filePath = context ? LazyJson.getRoot(context)[LAZY_JSON_FILE] : undefined;

    return filePath ? filePath.substring(0, filePath.lastIndexOf("/")) : undefined;
}

export class JsonResolver implements Resolver {
    readonly priority: number = Priority.LOWEST;

    canHandle($ref: string): boolean {
        return !$ref.startsWith("#");
    }

    getJson($ref: string, context: any): any {
        let basePath = getBasePath(context),
            filePath = basePath ? basePath + "/" + $ref : $ref;
        try {
            const jsonString = fs.readFileSync(filePath);
            return JSON.parse(jsonString);
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }
}
