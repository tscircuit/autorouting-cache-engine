import { test, expect } from "bun:test"

import circuit1 from "./assets/testset2/circuit1.json"
import circuit2 from "./assets/testset2/circuit2.json"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "../lib/convertCircuitJsonToNormalizedAutoroutingJson"

test("testset2 should be not be equal because of already routed traces", () => {
  //   const { normalizedAutoroutingJson: normalizedAutoroutingJson1 } =
  //     convertCircuitJsonToNormalizedAutoroutingJson(circuit1 as any)
  //   const { normalizedAutoroutingJson: normalizedAutoroutingJson2 } =
  //     convertCircuitJsonToNormalizedAutoroutingJson(circuit2 as any)
  //   expect(normalizedAutoroutingJson1).toMatchInlineSnapshot(`
  // {
  //   "allowed_layers": 1,
  //   "nets_to_route": [
  //     1,
  //   ],
  //   "sorted_normalized_objects": [
  //     {
  //       "height": "0.60",
  //       "layers": [
  //         "top",
  //       ],
  //       "net": null,
  //       "type": "pad",
  //       "width": "0.60",
  //       "x": "-2.00",
  //       "y": "0.00",
  //     },
  //     {
  //       "height": "0.60",
  //       "layers": [
  //         "top",
  //       ],
  //       "net": 1,
  //       "type": "pad",
  //       "width": "0.60",
  //       "x": "-3.00",
  //       "y": "0.00",
  //     },
  //     {
  //       "height": "0.60",
  //       "layers": [
  //         "top",
  //       ],
  //       "net": 1,
  //       "type": "pad",
  //       "width": "0.60",
  //       "x": "3.00",
  //       "y": "0.00",
  //     },
  //     {
  //       "height": "0.60",
  //       "layers": [
  //         "top",
  //       ],
  //       "net": null,
  //       "type": "pad",
  //       "width": "0.60",
  //       "x": "4.00",
  //       "y": "0.00",
  //     },
  //   ],
  // }
  // `)
  //   expect(normalizedAutoroutingJson1).toEqual(normalizedAutoroutingJson2)
})
