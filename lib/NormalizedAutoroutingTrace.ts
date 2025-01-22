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
 * Normalized-space traces are traces that have been transformed to the
 * normalized space, the X/Y coordinates are relative to the "Region of Interest"
 * and they reference net numbers instead of source traces and source nets.
 *
 * They cannot be used with Circuit JSON until you reverse the normalized space
 * transform on them.
 *
 * They different from pcb_traces in that they use the net numbers from the
 * NormalizedAutoroutingJson
 */
export interface NormalizedAutoroutingTrace {
  net: number
  route: NormalizedRoutePoint[]
}
