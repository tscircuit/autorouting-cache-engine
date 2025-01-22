import type { PcbTrace, PcbTraceRoutePoint } from "circuit-json"

interface NormalizedRoutePoint {
  route_type: "wire" | "via"
  x: number
  y: number
  width: number
  from_layer?: string
  to_layer?: string
}

/**
 * Cache-space traces are traces that have been transformed to the cache space
 *
 * They cannot be used with Circuit JSON until you reverse the cache space
 * transform on them.
 *
 * They different from pcb_traces in that they use the net numbers from the
 * NormalizedAutoroutingJson
 */
export interface NormalizedAutoroutingTrace {
  net: number
  route: NormalizedRoutePoint[]
}
