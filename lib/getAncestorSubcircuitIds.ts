import type { CircuitJson, SourceGroup } from "circuit-json"

export const getAncestorSubcircuitIdsFromSubcircuitList = (
  subcircuitList: SourceGroup[],
  parentSubcircuitId: string,
): string[] => {
  const subcircuitIdsWithParentId = subcircuitList
    .filter(
      (subcircuit) => subcircuit.parent_subcircuit_id === parentSubcircuitId,
    )
    .map((subcircuit) => subcircuit.subcircuit_id!)

  return [
    ...subcircuitIdsWithParentId,
    ...subcircuitIdsWithParentId.flatMap((subcircuitId) =>
      getAncestorSubcircuitIdsFromSubcircuitList(subcircuitList, subcircuitId),
    ),
  ]
}

export const getAncestorSubcircuitIds = (
  circuitJson: CircuitJson,
  parentSubcircuitId: string,
): string[] => {
  return getAncestorSubcircuitIdsFromSubcircuitList(
    circuitJson.filter(
      (elm) => elm.type === "source_group" && elm.is_subcircuit,
    ) as SourceGroup[],
    parentSubcircuitId,
  )
}
