import { test, expect } from "bun:test"

import circuit1 from "./assets/testset1/circuit1.json"
import circuit2 from "./assets/testset1/circuit2.json"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "../lib/convertCircuitJsonToNormalizedAutoroutingJson"

test("testset1", () => {
  const normalizedAutoroutingJson1 =
    convertCircuitJsonToNormalizedAutoroutingJson(circuit1 as any)
  const normalizedAutoroutingJson2 =
    convertCircuitJsonToNormalizedAutoroutingJson(circuit2 as any)

  expect(normalizedAutoroutingJson1).toEqual(normalizedAutoroutingJson2)
})
