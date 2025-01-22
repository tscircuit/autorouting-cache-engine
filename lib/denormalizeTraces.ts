import type {
  CircuitJson,
  LayerRef,
  PcbTrace,
  PcbTraceRoutePoint,
} from "circuit-json"
import type { NormalizationTransform } from "./convertCircuitJsonToNormalizedAutoroutingJson"
import type { NormalizedAutoroutingTrace } from "./NormalizedAutoroutingTrace"
import { LAYER_NAME_TO_NUMBER, LAYER_NUMBER_TO_NAME } from "./constants"
import { su } from "@tscircuit/soup-util"

export const denormalizeTraces = ({
  normalizationTransform,
  circuitJson,
  normalizedTraces,
}: {
  normalizationTransform: NormalizationTransform
  circuitJson: CircuitJson
  normalizedTraces: NormalizedAutoroutingTrace[]
}): PcbTrace[] => {
  const { offsetX: targetOffsetX, offsetY: targetOffsetY } =
    normalizationTransform

  const denormalizedTraces: PcbTrace[] = []

  let highestPcbTraceIdNumber = circuitJson.reduce((acc, el) => {
    if (el.type !== "pcb_trace") return acc
    if (!el.pcb_trace_id) return acc

    const pcbTraceIdNumber = parseInt(el.pcb_trace_id.split("_").pop()!)
    if (Number.isNaN(pcbTraceIdNumber)) return acc
    return Math.max(acc, pcbTraceIdNumber)
  }, 0)

  for (const normalizedTrace of normalizedTraces) {
    const { sourceTraceIds, sourceNetIds } =
      normalizationTransform.netInfo[normalizedTrace.net]

    // TODO handling for multiple trace ids or source nets etc.

    const sourceTrace = su(circuitJson).source_trace.get(sourceTraceIds[0])

    const denormalizedRoute: PcbTraceRoutePoint[] = []

    for (const normalizedRoutePoint of normalizedTrace.route) {
      if (normalizedRoutePoint.route_type === "via") {
        const from_layer =
          LAYER_NUMBER_TO_NAME[normalizedRoutePoint.from_layer!]!
        const to_layer = LAYER_NUMBER_TO_NAME[normalizedRoutePoint.to_layer!]!

        denormalizedRoute.push({
          route_type: "via",
          from_layer,
          to_layer,
          x: normalizedRoutePoint.x - normalizationTransform.offsetX,
          y: normalizedRoutePoint.y - normalizationTransform.offsetY,
        })
      } else if (normalizedRoutePoint.route_type === "wire") {
        denormalizedRoute.push({
          route_type: "wire",
          layer: LAYER_NUMBER_TO_NAME[normalizedRoutePoint.layer!] as LayerRef,
          x: normalizedRoutePoint.x - normalizationTransform.offsetX,
          y: normalizedRoutePoint.y - normalizationTransform.offsetY,
          width: normalizedRoutePoint.width,
        })
      }
    }

    const denormalizedTrace: PcbTrace = {
      type: "pcb_trace",
      pcb_trace_id: `pcb_trace_${++highestPcbTraceIdNumber}`,
      route: denormalizedRoute,
    }

    denormalizedTraces.push(denormalizedTrace)
  }

  return denormalizedTraces
}
