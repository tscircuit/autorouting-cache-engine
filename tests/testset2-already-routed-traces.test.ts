import { test, expect } from "bun:test"

import circuit1 from "./assets/testset2/circuit1.json"
import circuit2 from "./assets/testset2/circuit2-has-routes.json"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "../lib/convertCircuitJsonToNormalizedAutoroutingJson"

test("testset2 should be not be equal because of already routed traces", () => {
  const { normalizedAutoroutingJson: normalizedAutoroutingJson1 } =
    convertCircuitJsonToNormalizedAutoroutingJson(circuit1 as any)
  const { normalizedAutoroutingJson: normalizedAutoroutingJson2 } =
    convertCircuitJsonToNormalizedAutoroutingJson(circuit2 as any)

  expect(normalizedAutoroutingJson1).not.toEqual(normalizedAutoroutingJson2)
})
