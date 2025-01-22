import type { CircuitJson, PcbTrace } from "circuit-json"
import type { CacheSpaceTransform } from "./convertCircuitJsonToNormalizedAutoroutingJson"
import type { NormalizedAutoroutingTrace } from "./NormalizedAutoroutingTrace"

export const denormalizeTraces = ({
  cacheSpaceTransform,
  circuitJson,
  normalizedTraces,
}: {
  cacheSpaceTransform: CacheSpaceTransform
  circuitJson: CircuitJson
  normalizedTraces: NormalizedAutoroutingTrace[]
}): PcbTrace[] => {
  const { offsetX: targetOffsetX, offsetY: targetOffsetY } = cacheSpaceTransform
  const sourceOffsetX = 0 // Cache space is always centered at 0,0
  const sourceOffsetY = 0

  return normalizedTraces.map((trace) => ({
    ...trace,
    route: trace.route.map((routePoint) => ({
      ...routePoint,
      x: routePoint.x - sourceOffsetX + targetOffsetX,
      y: routePoint.y - sourceOffsetY + targetOffsetY,
    })),
  }))
}
