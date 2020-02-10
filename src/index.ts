"use strict";

import { SchemaResolver } from "./resolver/schema";
import { JsonResolver } from "./resolver/json";
import { ResolverFactory } from "./resolver/factory";
import { Parser, LAZY_JSON_PARENT } from "./parser";

export const LAZY_JSON_FILE = "__$ljrFile$__";

ResolverFactory.register(new SchemaResolver());
ResolverFactory.register(new JsonResolver());

export namespace LazyJson {

    export function create(jsonInput: string | any): any {
        let parser = new Parser();

        let json = jsonInput,
            filePath = __dirname;
        if (parser.isPrimitiveType(jsonInput)) {
            filePath = jsonInput;

            let resolver = ResolverFactory.getResolver(filePath);
            return resolver.getJson(filePath, null);
        }

        return parser.parse(json);
    };

    export function getRoot(context: any) {
        if (!context[LAZY_JSON_PARENT]) {
            return context;
        }
        return getRoot(context[LAZY_JSON_PARENT]);
    }
}
