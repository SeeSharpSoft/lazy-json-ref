"use strict";

export interface Resolver {
    readonly priority: number;
    canHandle: ($ref: string) => boolean;
    getJson: ($ref: string, context: any) => any;
}

export const Priority = {
    LOWEST: 0,
    DEFAULT: 100,
    HIGHEST: 1000
};

let resolvers: Resolver[] = [];

interface ResolverDefinition {
    readonly resolver: Resolver;
    readonly path: string;
}

class ResolverChain implements Resolver {
    readonly resolvers: ResolverDefinition[];
    readonly priority: number = Priority.LOWEST;

    constructor(...resolvers: ResolverDefinition[]) {
        this.resolvers = resolvers;
    }

    canHandle: ($ref: string) => true;
    getJson($ref: string, context: any): any {
        return this.resolvers.reduce((prev, current) => {
            return current.resolver.getJson(current.path, prev);
        }, context);
    };
}

export let ResolverFactory = {
    register: function (resolver: Resolver) {
        if (resolvers.includes(resolver)) {
            return;
        }
        resolvers.push(resolver);
        resolvers.sort((a,b) => a.priority - b.priority);
    },

    unregister: function (resolver: Resolver) {
        let index:number = resolvers.indexOf(resolver);
        if (index === -1) {
            return;
        }
        resolvers.splice(index, 1);
    },

    getResolver: function ($ref): Resolver {
        let fragmentIndex = $ref.indexOf("#"),
            fragmentPath = fragmentIndex < 1 ? undefined : $ref.substring(fragmentIndex),
            path = fragmentPath ? $ref.substring(0, $ref.length - fragmentPath.length) : $ref;

        if (fragmentPath) {
            return new ResolverChain({
                resolver: this.getResolver(path),
                path: path
            }, {
                resolver: this.getResolver(fragmentPath),
                path: fragmentPath
            });
        }

        let resolver = resolvers.find(resolver => resolver.canHandle($ref));
        if (!resolver) {
            throw new Error("no resolver found for reference " + $ref);
        }
        return resolver;
    }
};
