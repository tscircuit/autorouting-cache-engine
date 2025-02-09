import type {
  CircuitJson,
  LayerRef,
  PcbTrace,
  PcbTraceRoutePoint,
} from "circuit-json"
import type {
  NormalizationTransform,
  NormalizedAutoroutingTrace,
} from "./types"
import { LAYER_NAME_TO_NUMBER, LAYER_NUMBER_TO_NAME } from "./constants"
import { su } from "@tscircuit/soup-util"
import { addPcbPortIdsToTraces } from "./addPcbPortIdsToTraces"

export const denormalizeTraces = ({
  normalizationTransform,
  circuitJson,
  normalizedTraces,
  subcircuitId,
}: {
  normalizationTransform: NormalizationTransform
  circuitJson: CircuitJson
  normalizedTraces: NormalizedAutoroutingTrace[]
  subcircuitId?: string
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
  }, -1)

  for (const normalizedTrace of normalizedTraces) {
    const { sourceTraceIds, sourceNetIds } =
      normalizationTransform.netInfo[normalizedTrace.net]

    // TODO handling for multiple trace ids or source nets etc.

    const sourceTrace = su(circuitJson).source_trace.get(sourceTraceIds[0])

    const denormalizedRoute: PcbTraceRoutePoint[] = []

    for (const normalizedRoutePoint of normalizedTrace.route) {
      const denormalizedPosition = {
        x: normalizedRoutePoint.x + normalizationTransform.offsetX,
        y: normalizedRoutePoint.y + normalizationTransform.offsetY,
      }

      if (normalizedRoutePoint.route_type === "via") {
        const from_layer =
          LAYER_NUMBER_TO_NAME[normalizedRoutePoint.from_layer!]!
        const to_layer = LAYER_NUMBER_TO_NAME[normalizedRoutePoint.to_layer!]!

        denormalizedRoute.push({
          ...denormalizedPosition,
          route_type: "via",
          from_layer,
          to_layer,
        })
      } else if (normalizedRoutePoint.route_type === "wire") {
        denormalizedRoute.push({
          ...denormalizedPosition,
          route_type: "wire",
          layer: LAYER_NUMBER_TO_NAME[normalizedRoutePoint.layer!] as LayerRef,
          width: normalizedRoutePoint.width!,
        })
      }
    }

    const denormalizedTrace: PcbTrace = {
      type: "pcb_trace",
      source_trace_id: sourceTrace?.source_trace_id,
      pcb_trace_id: `pcb_trace_${++highestPcbTraceIdNumber}${
        subcircuitId ? `_${subcircuitId}` : ""
      }`,
      route: denormalizedRoute,
    }

    denormalizedTraces.push(denormalizedTrace)
  }

  // Not a required step, but improves the output to add the start_pcb_port_id
  // and end_pcb_port_id to the traces
  addPcbPortIdsToTraces(circuitJson, denormalizedTraces)

  return denormalizedTraces
}
