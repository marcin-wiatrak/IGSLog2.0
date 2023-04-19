import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material'
import { OrderType } from '@src/types'
import { useDispatch, useSelector } from 'react-redux'
import { ordersActions, ordersSelectors } from '@src/store'
import { toggleValueInArray } from '@src/utils'

export const OrderTypeCheckboxGroup = () => {
  const dispatch = useDispatch()
  const { type } = useSelector(ordersSelectors.selectOrderForm)

  const handleSelectOrderType = ({ target }) => {
    dispatch(ordersActions.setCreateOrder({ type: toggleValueInArray(type, target.name) }))
  }
  const isTypeCheckboxChecked = (name) => {
    return type.includes(name)
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
