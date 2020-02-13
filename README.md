![Node.js CI](https://github.com/SeeSharpSoft/lazy-json-ref/workflows/Node.js%20CI/badge.svg)

# lazy-json-ref

Provide resolution of references in JSON (https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html) in a lazy and transparent manner.

**Example:**

pets.json

```
{
  "definitions": {
    "pet": {
      "type": "object",
      "properties": {
        "name":  { "type": "string" },
        "breed": { "type": "string" },
        "age":  { "type": "string" }
      },
      "required": ["name", "breed", "age"]
    }
  },
  "type": "object",
  "properties": {
    "cat": { "$ref": "#/definitions/pet" },
    "dog": { "$ref": "#/definitions/pet" }
  }
}
```

```
let json = LazyJson.create("/test/specs/definitions/pets.json"); // argument can also be a json object itself

json.properties.cat.required
> ["name", "breed", "age"]

json.properties.dog.type
> "object"

```

**What's special about it?**

The reference is resolved lazy on request (**not** in `LazyJson.create`) without any additional function call or de-reference handling. Works also with referencing .json files.

Further examples can be found [here](https://github.com/SeeSharpSoft/lazy-json-ref/tree/master/test/specs/definitions).

**Disclaimer**

This is a first draft (or PoC so to say) - feedback welcome!
