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
  const allPoints = circuitJson.flatMap((el) => {
    if (el.type === "pcb_port") {
      return [{ x: el.x, y: el.y }]
    }
    return []
  })

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
