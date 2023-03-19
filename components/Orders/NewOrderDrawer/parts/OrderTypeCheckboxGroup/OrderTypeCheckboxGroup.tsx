import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material'
import { OrderType } from '@src/types'

type OrderTypeCheckboxGroupProps = {
  form
}

export const OrderTypeCheckboxGroup = ({ form }: OrderTypeCheckboxGroupProps) => {
  const handleSelectOrderType = () => {
    console.log('test')
  }
  const isTypeCheckboxChecked = (name) => {
    return form.type.includes(name)
  }

  return (
    <FormControl>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={isTypeCheckboxChecked(OrderType.BIOLOGY)}
              onChange={handleSelectOrderType}
              name={OrderType.BIOLOGY}
            />
          }
          label="Biologia"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isTypeCheckboxChecked(OrderType.TOXYCOLOGY)}
              onChange={handleSelectOrderType}
              name={OrderType.TOXYCOLOGY}
            />
          }
          label="Toksykologia"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isTypeCheckboxChecked(OrderType.FATHERHOOD)}
              onChange={handleSelectOrderType}
              name={OrderType.FATHERHOOD}
            />
          }
          label="Ustalanie ojcostwa"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isTypeCheckboxChecked(OrderType.PHYSICOCHEMISTRY)}
              onChange={handleSelectOrderType}
              name={OrderType.PHYSICOCHEMISTRY}
            />
          }
          label="Fizykochemia"
        />
      </FormGroup>
    </FormControl>
  )
}
