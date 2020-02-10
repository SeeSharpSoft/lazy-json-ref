"use strict";

const {expect} = require("chai");
const {LazyJson} = require("../../dist");
const {FileCache} = require("../../dist/resolver/external");

describe("LazyJson", () => {
    describe("create", () => {
        it("should parse an object", async () => {
            FileCache.GLOBAL.reset();

            let obj = LazyJson.create(__dirname + "/definitions/simple.json");

            expect(obj).to.deep.equal({
                persons: [
                    {
                        firstName: "Martin",
                        lastName: "Sommer",
                        age: 40
                    },
                    {
                        firstName: "Bert",
                        lastName: "Knerz",
                        age: 420
                    }
                ],
                winner: {
                    firstName: "Bert",
                    lastName: "Knerz",
                    age: 420,
                    win: "1000"
                },
                looser: {
                    firstName: "Martin",
                    lastName: "Sommer",
                    age: 40,
                    win: "1"
                }
            });
        });

    });

    describe("change", () => {
        it("should change all references", async () => {
            FileCache.GLOBAL.reset();

            let obj = LazyJson.create(__dirname + "/definitions/simple.json");

            obj.persons[0].firstName = "Lothar";
            obj.persons[1].age = -1;

            expect(obj.winner).to.deep.equal({
                    firstName: "Bert",
                    lastName: "Knerz",
                    age: -1,
                    win: "1000"
                });
            expect(obj.looser).to.deep.equal( {
                firstName: "Lothar",
                lastName: "Sommer",
                age: 40,
                win: "1"
            });
        });

        it("reference change should change source", async () => {
            FileCache.GLOBAL.reset();

            let obj = LazyJson.create(__dirname + "/definitions/simple.json");

            obj.winner.firstName = "Adam";
            obj.looser.age = 100;

            expect(obj.persons[1]).to.deep.equal({
                firstName: "Adam",
                lastName: "Knerz",
                age: 420
            });
            expect(obj.persons[0]).to.deep.equal( {
                firstName: "Martin",
                lastName: "Sommer",
                age: 100
            });
        });
    });
});