import { test, expect } from "bun:test"

import circuit1 from "./assets/testset1/circuit1.json"
import circuit2 from "./assets/testset1/circuit2.json"
import { convertCircuitJsonToNormalizedAutoroutingJson } from "../lib/convertCircuitJsonToNormalizedAutoroutingJson"
import { normalizePcbTraces } from "../lib/normalizePcbTraces"
import { denormalizeTraces } from "../lib/denormalizeTraces"

test("testset1 should be able to apply cached traces to circuit1 and have it match", () => {
  const cacheRes1 = convertCircuitJsonToNormalizedAutoroutingJson(
    circuit1.filter((el) => el.type !== "pcb_trace") as any,
  )
  const cacheRes2 = convertCircuitJsonToNormalizedAutoroutingJson(
    circuit2 as any,
  )

  const normalizedTraces = normalizePcbTraces({
    normalizationTransform: cacheRes2.normalizationTransform,
    circuitJson: circuit2 as any,
    pcbTraceIds: circuit2
      .filter((el) => el.type === "pcb_trace")
      .map((el) => el.pcb_trace_id!),
  })

  const circuit1SpaceTraces = denormalizeTraces({
    normalizationTransform: cacheRes1.normalizationTransform,
    circuitJson: circuit1.filter((el) => el.type !== "pcb_trace") as any,
    normalizedTraces,
  })

  expect(
    circuit1.filter((el) => el.type === "pcb_trace") as any,
  ).toMatchInlineSnapshot(`
[
  {
    "pcb_trace_id": "pcb_trace_0",
    "route": [
      {
        "layer": "top",
        "route_type": "wire",
        "start_pcb_port_id": "pcb_port_0",
        "width": 0.16,
        "x": 5.5,
        "y": 0,
      },
      {
        "layer": "top",
        "route_type": "wire",
        "width": 0.16,
        "x": 1.7999999999999998,
        "y": 0,
      },
      {
        "layer": "top",
        "route_type": "wire",
        "width": 0.16,
        "x": 1.7999999999999998,
        "y": 1.3,
      },
      {
        "layer": "top",
        "route_type": "wire",
        "width": 0.16,
        "x": -0.5,
        "y": 1.3,
      },
      {
        "end_pcb_port_id": "pcb_port_2",
        "layer": "top",
        "route_type": "wire",
        "width": 0.16,
        "x": -0.5,
        "y": 0,
      },
    ],
    "source_trace_id": "source_trace_0",
    "type": "pcb_trace",
  },
]
`)

  expect(circuit1SpaceTraces).toMatchInlineSnapshot(`
    [
      {
        "pcb_trace_id": "pcb_trace_0",
        "route": [
          {
            "layer": "top",
            "route_type": "wire",
            "start_pcb_port_id": "pcb_port_0",
            "width": 0.16,
            "x": 5.5,
            "y": 0,
          },
          {
            "layer": "top",
            "route_type": "wire",
            "width": 0.16,
            "x": 1.7999999999999998,
            "y": 0,
          },
          {
            "layer": "top",
            "route_type": "wire",
            "width": 0.16,
            "x": 1.7999999999999998,
            "y": 1.3,
          },
          {
            "layer": "top",
            "route_type": "wire",
            "width": 0.16,
            "x": -0.5,
            "y": 1.3,
          },
          {
            "end_pcb_port_id": "pcb_port_2",
            "layer": "top",
            "route_type": "wire",
            "width": 0.16,
            "x": -0.5,
            "y": 0,
          },
        ],
        "source_trace_id": "source_trace_0",
        "type": "pcb_trace",
      },
    ]
  `)

  expect(circuit1SpaceTraces).toEqual(
    circuit1.filter((el) => el.type === "pcb_trace") as any,
  )
})
