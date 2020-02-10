import {ResolverFactory} from "./resolver/factory";

export const REFERENCE_PROPERTY = "$ref";
export const LAZY_JSON_MARKER = "__$ljr$__";
export const LAZY_JSON_PARENT = "__$ljrParent$__";
export const LAZY_JSON_PARENT_PATH = "__$ljrPath$__";

export class Parser {
    isPrimitiveType(value: any): boolean {
        // strings, numbers, boolean values true/false , null
        return value === null ||
            value === undefined ||
            (value).constructor === String || (value).constructor === Number || (value).constructor === Boolean;
    }

    visited(source: any): boolean {
        if (this.isPrimitiveType(source)) {
            return source;
        }
        return LAZY_JSON_MARKER in source;
    }

    private createLazyReference(parent: any, key: string | number, value: any, reference: string): Function {
        let resolver = this.getResolver(reference);
        return function () {
            let targetJson = resolver.getJson(reference, value);
            Object.keys(targetJson).forEach(function (key) {
                Object.defineProperty(value, key, {
                    enumerable: true,
                    configurable: false,
                    get: function () {
                        return targetJson[key];
                    },
                    set: function (vValue) {
                        targetJson[key] = vValue;
                    }
                });
            });
            Object.defineProperty(parent, key, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: value
            });
            return value;
        };
    }

    getResolver(reference: string) {
        return ResolverFactory.getResolver(reference);
    }

    resolve(reference: string, context: any) {
        return this.getResolver(reference).getJson(reference, context);
    }

    parse(value: any, parent?: any, key?: string | number): any {
        if (key === REFERENCE_PROPERTY) {
            return null;
        } else if (this.isPrimitiveType(value)) {
            return value;
        } else if (this.visited(value)) {
            return value[LAZY_JSON_MARKER];
        }
        let target: any = Array.isArray(value) ? [] : {};

        Object.defineProperty(target, LAZY_JSON_PARENT, {value: parent, configurable: true});
        Object.defineProperty(target, LAZY_JSON_PARENT_PATH, {value: key, configurable: true});
        Object.defineProperty(value, LAZY_JSON_MARKER, {value: target});
        Object.keys(value).forEach(function (key: string) {
            let parserResult = this.parse(value[key], target, key);
            if (parserResult === null) {
                return;
            }
            if ((parserResult).constructor === Function) {
                Object.defineProperty(target, key, {
                    enumerable: true,
                    configurable: true,
                    get: parserResult
                })
            } else {
                Object.defineProperty(target, key, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: parserResult
                });
            }
        }.bind(this));

        if (REFERENCE_PROPERTY in value) {
            if (parent !== undefined && key !== undefined) {
                target = this.createLazyReference(parent, key, target, value[REFERENCE_PROPERTY]);
            } else {
                target = this.resolve(value[REFERENCE_PROPERTY], target);
            }
        }

        return target;
    }
}