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

export interface NormalizedTrace {
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

export type NormalizedObject = NormalizedPad | NormalizedHole | NormalizedTrace

export type NormalizedAutoroutingJson = {
  allowed_layers: number
  nets_to_route: number[]
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
}
