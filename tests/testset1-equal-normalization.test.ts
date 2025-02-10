import { test, expect } from "bun:test"

import circuit1 from "./assets/testset1/circuit1.json"
import circuit2 from "./assets/testset1/circuit2.json"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "../lib/convertCircuitJsonToNormalizedAutoroutingJson"

test("testset1 should be equal despite translation", () => {
  const { normalizedAutoroutingJson: normalizedAutoroutingJson1 } =
    convertCircuitJsonToNormalizedAutoroutingJson(circuit1 as any)
  const { normalizedAutoroutingJson: normalizedAutoroutingJson2 } =
    convertCircuitJsonToNormalizedAutoroutingJson(circuit2 as any)

  expect(normalizedAutoroutingJson1).toMatchInlineSnapshot(`
    {
      "allowed_layers": 1,
      "nets_to_route": [
        1,
      ],
      "sorted_normalized_objects": [
        {
          "height": "0.60",
          "layers": [
            "top",
          ],
          "net": null,
          "type": "rect_pad",
          "width": "0.60",
          "x": "-2.50",
          "y": "0.00",
        },
        {
          "height": "0.60",
          "layers": [
            "top",
          ],
          "net": 1,
          "type": "rect_pad",
          "width": "0.60",
          "x": "-3.50",
          "y": "0.00",
        },
        {
          "height": "0.60",
          "layers": [
            "top",
          ],
          "net": 1,
          "type": "rect_pad",
          "width": "0.60",
          "x": "2.50",
          "y": "0.00",
        },
        {
          "height": "0.60",
          "layers": [
            "top",
          ],
          "net": null,
          "type": "rect_pad",
          "width": "0.60",
          "x": "3.50",
          "y": "0.00",
        },
        {
          "net": 1,
          "route_segments": [
            {
              "layer": "top",
              "x1": "-1.20",
              "x2": "-1.20",
              "y1": "0.00",
              "y2": "1.30",
            },
            {
              "layer": "top",
              "x1": "-1.20",
              "x2": "-3.50",
              "y1": "1.30",
              "y2": "1.30",
            },
            {
              "layer": "top",
              "x1": "-3.50",
              "x2": "-3.50",
              "y1": "1.30",
              "y2": "0.00",
            },
            {
              "layer": "top",
              "x1": "2.50",
              "x2": "-1.20",
              "y1": "0.00",
              "y2": "0.00",
            },
          ],
          "type": "trace",
          "vias": [],
        },
      ],
    }
  `)

  expect(normalizedAutoroutingJson1).toEqual(normalizedAutoroutingJson2)
})
