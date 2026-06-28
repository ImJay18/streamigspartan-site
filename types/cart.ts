export interface CartItem {
  platformId:   string
  platformName: string
  logoUrl:      string
  screens:      number
  unitPrice:    number
}

export interface AppliedCombo {
  comboId:        string
  comboName:      string
  platformNames:  string[]
  platformLogos:  string[]
  comboPrice:     number
  savedAmount:    number
}

export interface CartState {
  items:         CartItem[]
  appliedCombos: AppliedCombo[]
  total:         number
}
