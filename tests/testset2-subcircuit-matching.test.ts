import { test, expect } from "bun:test"

import circuit1 from "./assets/testset2/circuit1.json"
import circuit2 from "./assets/testset2/circuit2-has-routes.json"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "../lib/convertCircuitJsonToNormalizedAutoroutingJson"

test("testset2 should be equal because subcircuits are the same just translated", () => {
  const { normalizedAutoroutingJson: normalizedAutoroutingJson1 } =
    convertCircuitJsonToNormalizedAutoroutingJson(circuit1 as any, {
      subcircuitId: "subcircuit_source_group_0",
    })
  const { normalizedAutoroutingJson: normalizedAutoroutingJson2 } =
    convertCircuitJsonToNormalizedAutoroutingJson(circuit2 as any, {
      subcircuitId: "subcircuit_source_group_1",
    })

  expect(normalizedAutoroutingJson1.sorted_normalized_objects.length).toEqual(
    36,
  )

  expect(normalizedAutoroutingJson1).toEqual(normalizedAutoroutingJson2)
})
