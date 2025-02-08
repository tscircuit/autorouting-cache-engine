import { getAncestorSubcircuitIds } from "../lib/circuit-json-utils/getAncestorSubcircuitIds"
import { test, expect } from "bun:test"
import circuit2 from "./assets/testset2/circuit2-has-routes.json"

test("getAncestorSubcircuitIds", () => {
  const subcircuitIds = getAncestorSubcircuitIds(
    circuit2 as any,
    "subcircuit_source_group_3",
  )

  expect(subcircuitIds).toMatchInlineSnapshot(`
    [
      "subcircuit_source_group_0",
      "subcircuit_source_group_1",
      "subcircuit_source_group_2",
    ]
  `)
})
