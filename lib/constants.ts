export const LAYER_NUMBER_TO_NAME: Record<number, string> = {
  1: "top",
  2: "bottom",
  3: "inner1",
  4: "inner2",
  5: "inner3",
  6: "inner4",
  7: "inner5",
  8: "inner6",
}

export const LAYER_NAME_TO_NUMBER = Object.fromEntries(
  Object.entries(LAYER_NUMBER_TO_NAME).map(([k, v]) => [v, parseInt(k)]),
)
