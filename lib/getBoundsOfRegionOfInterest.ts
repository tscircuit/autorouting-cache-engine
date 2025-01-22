import type { CircuitJson } from "circuit-json"

export const getBoundsOfRegionOfInterest = (
  circuitJson: CircuitJson,
): {
  minX: number
  maxX: number
  minY: number
  maxY: number
  centerX: number
  centerY: number
} => {
  // Collect all trace points from source traces and their connected ports
  const allPoints = circuitJson
    .filter((el) => el.type === "source_trace")
    .flatMap((trace) =>
      trace.connected_source_port_ids.flatMap((portId) =>
        circuitJson.filter(
          (el) => el.type === "pcb_port" && el.source_port_id === portId,
        ),
      ),
    )
    .map((port: any) => ({ x: port.x, y: port.y }))

  // Calculate bounds
  const minX = Math.min(...allPoints.map((p) => p.x))
  const maxX = Math.max(...allPoints.map((p) => p.x))
  const minY = Math.min(...allPoints.map((p) => p.y))
  const maxY = Math.max(...allPoints.map((p) => p.y))

  return {
    minX,
    maxX,
    minY,
    maxY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  }
}
