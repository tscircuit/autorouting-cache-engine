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
  // Collect all trace points from source traces and their connected ports
  const allPoints = circuitJson.flatMap((el) => {
    if (el.type === "pcb_trace") {
      return el.route.map((point) => ({ x: point.x, y: point.y }))
    }
    if (el.type === "pcb_port") {
      return [{ x: el.x, y: el.y }]
    }
    if (el.type === "pcb_smtpad") {
      if (el.shape === "rect") {
        return [
          { x: el.x - el.width / 2, y: el.y - el.height / 2 },
          { x: el.x + el.width / 2, y: el.y - el.height / 2 },
          { x: el.x - el.width / 2, y: el.y + el.height / 2 },
          { x: el.x + el.width / 2, y: el.y + el.height / 2 },
        ]
      } else if (el.shape === "circle") {
        return [
          { x: el.x - el.radius, y: el.y - el.radius },
          { x: el.x - el.radius, y: el.y + el.radius },
          { x: el.x + el.radius, y: el.y - el.radius },
          { x: el.x + el.radius, y: el.y + el.radius },
        ]
      } else if (el.shape === "pill") {
        return [
          { x: el.x - el.width / 2, y: el.y - el.height / 2 },
          { x: el.x + el.width / 2, y: el.y - el.height / 2 },
          { x: el.x - el.width / 2, y: el.y + el.height / 2 },
          { x: el.x + el.width / 2, y: el.y + el.height / 2 },
        ]
      }
      return [{ x: el.x, y: el.y }]
    }
    if (el.type === "pcb_plated_hole") {
      if (el.shape === "circle") {
        return [
          { x: el.x - el.outer_diameter / 2, y: el.y - el.outer_diameter / 2 },
          { x: el.x - el.outer_diameter / 2, y: el.y + el.outer_diameter / 2 },
          { x: el.x + el.outer_diameter / 2, y: el.y - el.outer_diameter / 2 },
          { x: el.x + el.outer_diameter / 2, y: el.y + el.outer_diameter / 2 },
        ]
      } else if (el.shape === "pill") {
        return [
          { x: el.x - el.outer_width / 2, y: el.y - el.outer_height / 2 },
          { x: el.x + el.outer_width / 2, y: el.y - el.outer_height / 2 },
          { x: el.x - el.outer_width / 2, y: el.y + el.outer_height / 2 },
          { x: el.x + el.outer_width / 2, y: el.y + el.outer_height / 2 },
        ]
      } else if (el.shape === "circular_hole_with_rect_pad") {
        return [
          { x: el.x - el.rect_pad_width / 2, y: el.y - el.rect_pad_height / 2 },
          { x: el.x + el.rect_pad_width / 2, y: el.y - el.rect_pad_height / 2 },
          { x: el.x - el.rect_pad_width / 2, y: el.y + el.rect_pad_height / 2 },
          { x: el.x + el.rect_pad_width / 2, y: el.y + el.rect_pad_height / 2 },
        ]
      } else if (el.shape === "oval") {
        return [
          { x: el.x - el.outer_width / 2, y: el.y - el.outer_height / 2 },
          { x: el.x + el.outer_width / 2, y: el.y - el.outer_height / 2 },
          { x: el.x - el.outer_width / 2, y: el.y + el.outer_height / 2 },
          { x: el.x + el.outer_width / 2, y: el.y + el.outer_height / 2 },
        ]
      }
      return [{ x: el.x, y: el.y }]
    }
    if (el.type === "pcb_hole") {
      if (el.hole_shape === "circle") {
        return [
          { x: el.x - el.hole_diameter / 2, y: el.y - el.hole_diameter / 2 },
          { x: el.x - el.hole_diameter / 2, y: el.y + el.hole_diameter / 2 },
          { x: el.x + el.hole_diameter / 2, y: el.y - el.hole_diameter / 2 },
          { x: el.x + el.hole_diameter / 2, y: el.y + el.hole_diameter / 2 },
        ]
      } else if (el.hole_shape === "oval") {
        return [
          { x: el.x - el.hole_width / 2, y: el.y - el.hole_height / 2 },
          { x: el.x + el.hole_width / 2, y: el.y - el.hole_height / 2 },
          { x: el.x - el.hole_width / 2, y: el.y + el.hole_height / 2 },
          { x: el.x + el.hole_width / 2, y: el.y + el.hole_height / 2 },
        ]
      }
      return [{ x: el.x, y: el.y }]
    }
    if (el.type === "pcb_via") {
      return [
        { x: el.x - el.hole_diameter / 2, y: el.y - el.hole_diameter / 2 },
        { x: el.x + el.hole_diameter / 2, y: el.y - el.hole_diameter / 2 },
        { x: el.x - el.hole_diameter / 2, y: el.y + el.hole_diameter / 2 },
        { x: el.x + el.hole_diameter / 2, y: el.y + el.hole_diameter / 2 },
      ]
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
