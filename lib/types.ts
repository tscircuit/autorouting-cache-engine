export interface NormalizedRoutePoint {
  route_type: "wire" | "via"
  x: number
  y: number
  width?: number
  from_layer?: number
  to_layer?: number
  layer?: number
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

export type NormalizedAutoroutingJson = {
  allowed_layers: number
  nets_to_route: number[]
  sorted_normalized_objects: Array<{
    net: number | null
    x: string
    y: string
    layers: string[]
    width?: string
    height?: string
    radius?: string
    type?: "pad" | "hole"
  }>
}

export type NormalizationTransform = {
  offsetX: number
  offsetY: number
  netInfo: Record<
    number,
    {
      sourceTraceIds: string[]
      sourceNetIds: string[]
    }
  >
}

export interface NormalizationOptions {
  subcircuitId?: string
  marginOutsideOfRegionOfInterest?: number
}
