"use strict";

const {expect} = require("chai");
const {LazyJson} = require("../../dist");

describe("LazyJson", () => {
    describe("create", () => {
        it("should parse an object", async () => {
            let obj = LazyJson.create(
                {
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
                        $ref: "#/persons/1",
                        win: "1000"
                    },
                    looser: {
                        win: "1",
                        $ref: "#../persons/0"
                    }
                }
            );

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