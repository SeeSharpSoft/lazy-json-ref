"use strict";

import { Resolver, Priority } from "./factory";
import { LazyJson } from "../index";
import { LAZY_JSON_PARENT } from "../parser";

export class SchemaResolver implements Resolver {
    readonly priority: number = Priority.HIGHEST;

    canHandle($ref: string): boolean {
        return $ref.startsWith("#");
    }

    getJson($ref: string, context: any): any {
        let currentContext = context,
            path = $ref.substring(1);

        if (path.startsWith("/")) {
            currentContext = LazyJson.getRoot(context);
            path = path.substring(1);
        }

        let paths = path.split("/");

        return paths.reduce(function (currentContext: any, currentPath) {
            if (currentPath === ".") {
                return currentContext;
            }
            if (currentPath === "..") {
                return currentContext[LAZY_JSON_PARENT];
            }
            return currentContext[currentPath];
        }, currentContext);
    }
}
