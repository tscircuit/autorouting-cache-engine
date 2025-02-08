import { test, expect } from "bun:test"

import circuit1 from "./assets/testset1/circuit1.json"
import circuit2 from "./assets/testset1/circuit2.json"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "../lib/convertCircuitJsonToNormalizedAutoroutingJson"
import { generateCacheKey } from "../lib"

test("testset1 should be equal despite translation", () => {
  const { longString: longString1, cacheKey: cacheKey1 } = generateCacheKey(
    circuit1 as any,
  )
  const { longString: longString2, cacheKey: cacheKey2 } = generateCacheKey(
    circuit2 as any,
  )

  expect(cacheKey1).toMatchInlineSnapshot(`"3af4d29e4d3a95accf5706cdde360628"`)

  expect(cacheKey1).toEqual(cacheKey2)

  expect(longString1).toMatchInlineSnapshot(
    `"{"allowed_layers":1,"nets_to_route":[1],"sorted_normalized_objects":[{"height":"0.60","layers":["top"],"net":null,"type":"rect_pad","width":"0.60","x":"-2.00","y":"0.00"},{"height":"0.60","layers":["top"],"net":1,"type":"rect_pad","width":"0.60","x":"-3.00","y":"0.00"},{"height":"0.60","layers":["top"],"net":1,"type":"rect_pad","width":"0.60","x":"3.00","y":"0.00"},{"height":"0.60","layers":["top"],"net":null,"type":"rect_pad","width":"0.60","x":"4.00","y":"0.00"},{"net":1,"route_segments":[{"layer":"top","x1":"-0.70","x2":"-0.70","y1":"0.00","y2":"1.30"},{"layer":"top","x1":"-0.70","x2":"-3.00","y1":"1.30","y2":"1.30"},{"layer":"top","x1":"-3.00","x2":"-3.00","y1":"1.30","y2":"0.00"},{"layer":"top","x1":"3.00","x2":"-0.70","y1":"0.00","y2":"0.00"}],"type":"trace","vias":[]}]}"`,
  )
})
