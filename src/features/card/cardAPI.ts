export type UnoNumberType = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type UnoColorType = "red" | "blue" | "green" | "yellow"

export type UnoActionCardType = {
  label: "skip" | "draw2" | "draw4" | "wild" | "reverse";
  color: UnoColorType;
}

export type UnoNumberCardType = {
  label: "number";
  number: UnoNumberType;
  color: UnoColorType;
};

export type UnoCardType = UnoActionCardType | UnoNumberCardType

export function unoCardToPostBody(card: UnoCardType) {
  if ('number' in card) {
    return {
      name: card.label,
      color: card.color,
      num: parseInt(card.number)
    }
  } else {
    return {
      name: card.label,
      color: card.color,
      num: 0
    }
  }

}

export const isUnoActionCardLabel = (label: string) => {
  switch (label) {
    case "skip":
    case "draw2":
    case "draw4":
    case "wild":
    case "reverse":
      return true
    default:
      return false;
  }
}

export const unoNumberCardSet = (color: UnoColorType) => [...Array(10).keys()].map(n => {
  return { label: "number", color, number: n.toString() } as UnoNumberCardType
})