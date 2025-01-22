import type { CircuitJson, PcbTrace } from "circuit-json"
import type { CacheSpaceTransform } from "./convertCircuitJsonToNormalizedAutoroutingJson"

export const denormalizeTraces = ({
  cacheSpaceTransform,
  circuitJson,
  cacheSpaceTraces,
}: {
  cacheSpaceTransform: CacheSpaceTransform
  circuitJson: CircuitJson
  cacheSpaceTraces: PcbTrace[]
}): PcbTrace[] => {
  const { offsetX: targetOffsetX, offsetY: targetOffsetY } = cacheSpaceTransform
  const sourceOffsetX = 0 // Cache space is always centered at 0,0
  const sourceOffsetY = 0

  return cacheSpaceTraces.map((trace) => ({
    ...trace,
    route: trace.route.map((routePoint) => ({
      ...routePoint,
      x: routePoint.x - sourceOffsetX + targetOffsetX,
      y: routePoint.y - sourceOffsetY + targetOffsetY,
    })),
  }))
}
