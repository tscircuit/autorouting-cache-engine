import { test, expect } from "bun:test"

import circuit1 from "./assets/testset1/circuit1.json"
import circuit2 from "./assets/testset1/circuit2.json"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "../lib/convertCircuitJsonToNormalizedAutoroutingJson"

test("testset1 should be able to apply cached traces to circuit1 and have it match", () => {
  const cacheRes1 = convertCircuitJsonToNormalizedAutoroutingJson(
    circuit1.filter((el) => el.type !== "pcb_trace") as any,
  )
  const cacheRes2 = convertCircuitJsonToNormalizedAutoroutingJson(
    circuit2 as any,
  )

  const cacheSpaceTraces = applyCacheSpaceTransformToTraces({
    cacheSpaceTransform: cacheRes2.cacheSpaceTransform,
    circuitJson: circuit2,
    pcbTraceIds: circuit2
      .filter((el) => el.type === "pcb_trace")
      .map((el) => el.pcb_trace_id!),
  })

  const circuit1SpaceTraces = reverseCacheSpaceTransformToTraces({
    cacheSpaceTransform: cacheRes1.cacheSpaceTransform,
    circuitJson: circuit1.filter((el) => el.type !== "pcb_trace") as any,
    cacheSpaceTraces,
  })

  expect(circuit1SpaceTraces).toMatchInlineSnapshot()

  expect(circuit1SpaceTraces).toEqual(
    circuit1.filter((el) => el.type !== "pcb_trace") as any,
  )
})
