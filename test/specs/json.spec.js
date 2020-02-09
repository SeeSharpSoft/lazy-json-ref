"use strict";

const {expect} = require("chai");
const {LazyJson} = require("../../dist");

describe("LazyJson", () => {
    describe("create", () => {
        it("should parse a json file", async () => {
            let obj = LazyJson.create(__dirname + "/definitions/teams.json");

            expect(obj).to.deep.equal({
                "Ateam": [
                    {
                        "firstName": "Fred",
                        "lastName": "Fuchs",
                        "age": 12,
                        "hometown": {
                            "name": "York",
                            "country": "United Kingdom"
                        }
                    }
                ],
                "Bteam": [
                    {
                        "firstName": "Fred",
                        "lastName": "Fuchs",
                        "age": 12,
                        "hometown": {
                            "name": "York",
                            "country": "United Kingdom"
                        }
                    },
                    {
                        "firstName": "Bert",
                        "lastName": "Knerz",
                        "age": 42,
                        "hometown": {
                            "name": "Berlin",
                            "country": "Germany"
                        }
                    }
                ]
            });
        });

        // it("should parse a string", async () => {
        //     let str = $RefParser.YAML.parse("hello, world");
        //     expect(str).to.equal("hello, world");
        // });
        //
        // it("should parse a number", async () => {
        //     let str = $RefParser.YAML.parse("42");
        //     expect(str).to.be.a("number").equal(42);
        // });
    });

    // describe("stringify", () => {
    //     it("should stringify an object", async () => {
    //         let yaml = $RefParser.YAML.stringify({
    //             title: "person",
    //             required: ["name", "age"],
    //             properties: {
    //                 name: {
    //                     type: "string"
    //                 },
    //                 age: {
    //                     type: "number"
    //                 }
    //             }
    //         });
    //
    //         expect(yaml).to.equal(
    //             "title: person\n" +
    //             "required:\n" +
    //             "  - name\n" +
    //             "  - age\n" +
    //             "properties:\n" +
    //             "  name:\n" +
    //             "    type: string\n" +
    //             "  age:\n" +
    //             "    type: number\n"
    //         );
    //     });
    // });
});