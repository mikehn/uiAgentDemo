import CartdStatus from 'components/BankStatus/CartdStatus.component'
import { Expense } from 'components/BankStatus/ExpenseList.component'

function CartdStatusDemo() {
  const expenses: Expense[] = [
    {
      id: 1,
      description: 'קניות בסופר',
      amount: 250.9,
      billedAt: new Date('2024-07-15'),
      currency: 'ILS'
    },
    {
      id: 2,
      description: 'קפה ומאפה',
      amount: 18.5,
      billedAt: new Date('2024-07-18'),
      currency: 'ILS'
    },
    {
      id: 3,
      description: 'Amazon Online',
      amount: 120.99,
      billedAt: new Date('2024-07-20'),
      currency: 'USD'
    },
    {
      id: 4,
      description: 'תדלוק תחנת דלק',
      amount: 220,
      billedAt: new Date('2024-07-22'),
      currency: 'ILS'
    }
  ]

  return (
    <div className="flex justify-center">
      <CartdStatus
        cardType="gold"
        cardBrand="mastercard"
        last4="4481"
        nextChargeDate={new Date('2024-08-02')}
        creditLimit={12000}
        expenses={expenses}
      />
    </div>
  )
}

export default CartdStatusDemo 