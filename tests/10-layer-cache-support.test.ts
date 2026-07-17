import { expect, test } from "bun:test"
import type { CircuitJson, PcbTrace } from "circuit-json"
import { LAYER_NAME_TO_NUMBER, LAYER_NUMBER_TO_NAME } from "../lib/constants"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "../lib/convertCircuitJsonToNormalizedAutoroutingJson"
import { denormalizeTraces } from "../lib/denormalizeTraces"
import { generateCacheKey } from "../lib/generateCacheKey"
import { normalizePcbTraces } from "../lib/normalizePcbTraces"
import circuit1Json from "./assets/testset1/circuit1.json"

const makeCircuitWithLayerCount = (numLayers: 2 | 10): CircuitJson => {
  const circuitJson = structuredClone(circuit1Json) as CircuitJson
  const board = circuitJson.find((el) => el.type === "pcb_board")
  if (!board) throw new Error("test circuit is missing its pcb_board")
  board.num_layers = numLayers
  return circuitJson
}

test("maps all 10 copper layers to normalized layer numbers", () => {
  expect(LAYER_NUMBER_TO_NAME).toEqual({
    1: "top",
    2: "bottom",
    3: "inner1",
    4: "inner2",
    5: "inner3",
    6: "inner4",
    7: "inner5",
    8: "inner6",
    9: "inner7",
    10: "inner8",
  })
  expect(LAYER_NAME_TO_NUMBER.inner7).toBe(9)
  expect(LAYER_NAME_TO_NUMBER.inner8).toBe(10)
})

test("10-layer routes round-trip through the normalized cache format", () => {
  const circuitJson = makeCircuitWithLayerCount(10)
  const routedTrace = circuitJson.find(
    (el): el is PcbTrace => el.type === "pcb_trace",
  )
  if (!routedTrace) throw new Error("test circuit is missing its pcb_trace")

  routedTrace.route = [
    {
      route_type: "wire",
      x: 5.5,
      y: 0,
      width: 0.16,
      layer: "inner7",
    },
    {
      route_type: "through_pad",
      start: { x: 1.8, y: 0 },
      end: { x: 1.2, y: 0 },
      width: 0.16,
      start_layer: "inner7",
      end_layer: "inner8",
    },
    {
      route_type: "via",
      x: 0,
      y: 0,
      from_layer: "inner8",
      to_layer: "inner7",
    },
    {
      route_type: "wire",
      x: -0.5,
      y: 0,
      width: 0.16,
      layer: "inner8",
    },
  ]

  const unroutedCircuitJson = circuitJson.filter(
    (el) => el.type !== "pcb_trace",
  )
  const { normalizedAutoroutingJson, normalizationTransform } =
    convertCircuitJsonToNormalizedAutoroutingJson(unroutedCircuitJson)
  const normalizedTraces = normalizePcbTraces({
    normalizationTransform,
    circuitJson,
    pcbTraceIds: [routedTrace.pcb_trace_id],
  })

  expect(normalizedAutoroutingJson.allowed_layers).toBe(10)
  expect(normalizedTraces[0]?.route).toEqual([
    expect.objectContaining({ route_type: "wire", layer: 9 }),
    expect.objectContaining({
      route_type: "through_pad",
      start_layer: 9,
      end_layer: 10,
    }),
    expect.objectContaining({ route_type: "via", from_layer: 10, to_layer: 9 }),
    expect.objectContaining({ route_type: "wire", layer: 10 }),
  ])

  const [denormalizedTrace] = denormalizeTraces({
    normalizationTransform,
    circuitJson: unroutedCircuitJson,
    normalizedTraces,
  })
  expect(denormalizedTrace.route).toEqual([
    expect.objectContaining({ route_type: "wire", layer: "inner7" }),
    expect.objectContaining({
      route_type: "through_pad",
      start_layer: "inner7",
      end_layer: "inner8",
    }),
    expect.objectContaining({
      route_type: "via",
      from_layer: "inner8",
      to_layer: "inner7",
    }),
    expect.objectContaining({ route_type: "wire", layer: "inner8" }),
  ])
})

test("layer count is included in the cache key", () => {
  const twoLayerResult = generateCacheKey(makeCircuitWithLayerCount(2))
  const tenLayerResult = generateCacheKey(makeCircuitWithLayerCount(10))

  expect(twoLayerResult.normalizedAutoroutingJson.allowed_layers).toBe(2)
  expect(tenLayerResult.normalizedAutoroutingJson.allowed_layers).toBe(10)
  expect(twoLayerResult.cacheKey).not.toBe(tenLayerResult.cacheKey)
})
