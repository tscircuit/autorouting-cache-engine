import { test, expect } from "bun:test"

import circuit1 from "./assets/testset1/circuit1.json"
import circuit2 from "./assets/testset1/circuit2.json"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "../lib/convertCircuitJsonToNormalizedAutoroutingJson"

test("testset1", () => {
  const normalizedAutoroutingJson1 =
    convertCircuitJsonToNormalizedAutoroutingJson(circuit1 as any)
  const normalizedAutoroutingJson2 =
    convertCircuitJsonToNormalizedAutoroutingJson(circuit2 as any)

  expect(normalizedAutoroutingJson1).toMatchInlineSnapshot(`
{
  "allowed_layers": 1,
  "nets_to_route": [
    3,
  ],
  "sorted_normalized_objects": [
    {
      "height": "0.60",
      "layers": [
        "top",
      ],
      "net": 2,
      "type": "pad",
      "width": "0.60",
      "x": "-2.00",
      "y": "0.00",
    },
    {
      "height": "0.60",
      "layers": [
        "top",
      ],
      "net": 3,
      "type": "pad",
      "width": "0.60",
      "x": "-3.00",
      "y": "0.00",
    },
    {
      "height": "0.60",
      "layers": [
        "top",
      ],
      "net": 3,
      "type": "pad",
      "width": "0.60",
      "x": "3.00",
      "y": "0.00",
    },
    {
      "height": "0.60",
      "layers": [
        "top",
      ],
      "net": 1,
      "type": "pad",
      "width": "0.60",
      "x": "4.00",
      "y": "0.00",
    },
  ],
  "sorted_normalized_traces": [
    {
      "net": 3,
      "route": [
        {
          "layers": [
            "top",
          ],
          "x": "3.00",
          "y": "0.00",
        },
        {
          "layers": [
            "top",
          ],
          "x": "-3.00",
          "y": "0.00",
        },
      ],
    },
  ],
}
`)

  expect(normalizedAutoroutingJson1).toEqual(normalizedAutoroutingJson2)
})
