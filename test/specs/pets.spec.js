"use strict";

const {expect} = require("chai");
const {LazyJson} = require("../../dist");
const {FileCache} = require("../../dist/resolver/external");

describe("Pets", () => {
    describe("parse", () => {
        it("should parse a simple reference", async () => {
            FileCache.GLOBAL.reset();

            let json = LazyJson.create(__dirname + "/definitions/pets.json");

            expect(json.properties.cat).to.deep.equal(json.definitions.pet);
            expect(json.properties.dog).to.deep.equal(json.definitions.pet);
            expect(json.properties.cat).to.deep.equal(json.properties.dog)
        });

    });

    describe("change", () => {
        it("should change all references", async () => {
            FileCache.GLOBAL.reset();

            let json = LazyJson.create(__dirname + "/definitions/pets.json");

            json.definitions.pet.type = "Animal";

            expect(json.properties.cat.type).to.equal("Animal");
            expect(json.properties.dog.type).to.equal("Animal");
        });

        it("reference change should change source", async () => {
            FileCache.GLOBAL.reset();

            let json = LazyJson.create(__dirname + "/definitions/pets.json");

            json.properties.cat.required = ["category"];

            expect(json.definitions.pet.required).to.deep.equal(["category"]);
            expect(json.properties.dog.required).to.deep.equal(["category"]);
        });
    });
});