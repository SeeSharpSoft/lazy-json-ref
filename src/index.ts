"use strict";

const fs = require("fs");
import { SchemaResolver } from "./resolver/schema";
import { JsonResolver } from "./resolver/json";
import { ResolverFactory } from "./resolver/factory";

export const REFERENCE_PROPERTY = "$ref";
export const LAZY_JSON_MARKER = "__$ljr$__";
export const LAZY_JSON_PARENT = "__$ljrParent$__";
export const LAZY_JSON_PARENT_PATH = "__$ljrPath$__";
export const LAZY_JSON_FILE = "__$ljrFile$__";

ResolverFactory.register(new SchemaResolver());
ResolverFactory.register(new JsonResolver());

export namespace LazyJson {

    export function create(jsonInput: string | any): any {
        let json = jsonInput,
            filePath = __dirname;
        if (isPrimitiveType(jsonInput)) {
            filePath = jsonInput;

            let resolver = ResolverFactory.getResolver(filePath);
            json = resolver.getJson(filePath, null);
        }

        let result = {},
            key = "data";

        parse(result, key, json);
        let data = result["data"];
        delete data[LAZY_JSON_PARENT];
        delete data[LAZY_JSON_PARENT_PATH];
        Object.defineProperty(data, LAZY_JSON_FILE, { value: filePath});

        return data;
    };

    export function getRoot(context: any) {
        if (!context[LAZY_JSON_PARENT]) {
            return context;
        }
        return getRoot(context[LAZY_JSON_PARENT]);
    }

    function isPrimitiveType(value: any): boolean {
        // strings, numbers, boolean values true/false , null
        return value === null ||
            value === undefined ||
            (value).constructor === String || (value).constructor === Number || (value).constructor === Boolean;
    }

    function visited(source: any): boolean {
        if (isPrimitiveType(source)) {
            return source;
        }
        return LAZY_JSON_MARKER in source;
    }

    function createLazyReference(parent: any, key: string | number, value: any, reference: string) {
        let resolver = ResolverFactory.getResolver(reference);
        Object.defineProperty(parent, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                let result = Object.assign({}, resolver.getJson(reference, value), value);
                Object.defineProperty(result, LAZY_JSON_PARENT, {value: parent});
                Object.defineProperty(result, LAZY_JSON_PARENT_PATH, {value: key});
                Object.defineProperty(parent, key, {value: result, enumerable: true});
                return result;
            }
        });
    }

    function parse(parent: any, key: string | number, value: any) {
        if (key === REFERENCE_PROPERTY) {
            return;
        } else if (isPrimitiveType(value)) {
            Object.defineProperty(parent, key, {value: value, enumerable: true});
        } else if (visited(value)) {
            Object.defineProperty(parent, key, {value: value[LAZY_JSON_MARKER], enumerable: true});
        } else {
            let target: any | [];
            if (Array.isArray(value)) {
                target = [];
                Object.defineProperty(value, LAZY_JSON_MARKER, {value: target});
                value.forEach(function (entry: any, index) {
                    parse(target, index, entry);
                });
            } else {
                target = {};
                Object.defineProperty(value, LAZY_JSON_MARKER, {value: target});
                Object.keys(value).forEach(function (key: string) {
                    parse(target, key, value[key]);
                });

            }
            Object.defineProperty(target, LAZY_JSON_PARENT, {value: parent, configurable: true});
            Object.defineProperty(target, LAZY_JSON_PARENT_PATH, {value: key, configurable: true});
            if (REFERENCE_PROPERTY in value) {
                createLazyReference(parent, key, target, value[REFERENCE_PROPERTY]);
            } else {
                Object.defineProperty(parent, key, {value: target, enumerable: true, configurable: true});
            }
        }
    }
}
