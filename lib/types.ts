export interface NormalizedRoutePointWire {
  route_type: "wire"
  x: number
  y: number
  width: number
  layer: number
}

export interface NormalizedRoutePointVia {
  route_type: "via"
  x: number
  y: number
  from_layer: number
  to_layer: number
}

export interface NormalizedRoutePointThroughPad {
  route_type: "through_pad"
  start: { x: number; y: number }
  end: { x: number; y: number }
  width: number
  start_layer: number
  end_layer: number
}

export type NormalizedRoutePoint =
  | NormalizedRoutePointWire
  | NormalizedRoutePointVia
  | NormalizedRoutePointThroughPad

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

export interface NormalizedPad {
  type: "rect_pad"
  net: number | null
  x: string
  y: string
  layers: string[]
  width: string
  height: string
}

export interface NormalizedHole {
  type: "hole"
  net: number | null
  x: string
  y: string
  layers: string[]
  width?: string
  height?: string
  radius: string
}

export interface NormalizedTraceObstacle {
  type: "trace"
  net: number | null
  route_segments: Array<{
    x1: string
    y1: string
    x2: string
    y2: string
    layer: string
  }>
  vias: Array<{
    x: string
    y: string
    layers: string[]
    radius: string
  }>
}

export type NormalizedObject =
  | NormalizedPad
  | NormalizedHole
  | NormalizedTraceObstacle

export type NormalizedAutoroutingJson = {
  allowed_layers: number
  nets_to_route: number[]
  net_properties: Record<number, { trace_thickness: string }>
  sorted_normalized_objects: NormalizedObject[]
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
  defaultTraceThickness?: string
}
