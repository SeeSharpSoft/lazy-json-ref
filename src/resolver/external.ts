"use strict";

import { Resolver, Priority } from "./factory";
import { LAZY_JSON_FILE, LazyJson } from "../index";
import { Parser } from "../parser";

export class FileCache {
    private cache: Record<string, any>;

    static GLOBAL:FileCache = new FileCache();

    constructor() {
        this.reset();
    }

    reset() {
        this.cache = {};
    }

    add(filePath: string, json: any) {
        this.cache[filePath] = json;
    }

    get(filePath: string) {
        if (!this.contains(filePath)) {
            throw new Error(filePath + " not found in FileCache");
        }
        return this.cache[filePath];
    }

    contains(filePath: string):boolean {
        return filePath in this.cache;
    }
}

export function getBasePath(context: any) {
    let filePath = context ? LazyJson.getRoot(context)[LAZY_JSON_FILE] : undefined;

    return filePath ? filePath.substring(0, filePath.lastIndexOf("/")) : undefined;
}

export abstract class ExternalResolver implements Resolver {
    private parser:Parser;

    constructor() {
        this.parser = new Parser();
    }

    readonly priority: number = Priority.LOWEST;

    canHandle($ref: string): boolean {
        return !$ref.startsWith("#");
    }

    getJson($ref: string, context: any): any {
        let basePath = getBasePath(context),
            filePath = basePath ? basePath + "/" + $ref : $ref,
            json = null;
        if (!(FileCache.GLOBAL.contains(filePath))) {
            json = this.getJsonFromFile(filePath);
            if (json) {
                json = this.parser.parse(json);
                Object.defineProperty(json, LAZY_JSON_FILE, { value: filePath});
            }
            FileCache.GLOBAL.add(filePath, json);
        }

        return FileCache.GLOBAL.get(filePath);
    }

    abstract getJsonFromFile(path: string): any;
}
