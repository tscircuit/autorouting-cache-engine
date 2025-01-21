import type { CircuitJson } from "circuit-json"
import { getObstaclesFromCircuitJson } from "@tscircuit/infgrid-ijump-astar"

export const generateAutoroutingCacheLongString = (
  circuitJson: CircuitJson,
  options: { subcircuit_id?: string },
) => {
  // TODO filter obstacles by subcircuit_id
  const obstacles = getObstaclesFromCircuitJson(circuitJson)
}
