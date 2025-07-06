import CartdStatus from 'components/BankStatus/CartdStatus.component'
import { Expense } from 'components/BankStatus/ExpenseList.component'

function CartdStatusDemo() {
  const expenses: Expense[] = [
    {
      id: 1,
      description: 'קניות בסופר',
      amount: 250.9,
      billedAt: new Date('2024-07-15'),
      currency: 'ILS',
      creditId: 'credit-card-4481'
    },
    {
      id: 2,
      description: 'קפה ומאפה',
      amount: 18.5,
      billedAt: new Date('2024-07-18'),
      currency: 'ILS',
      creditId: 'credit-card-4481'
    },
    {
      id: 3,
      description: 'Amazon Online',
      amount: 120.99,
      billedAt: new Date('2024-07-20'),
      currency: 'USD',
      creditId: 'credit-card-4481'
    },
    {
      id: 4,
      description: 'תדלוק תחנת דלק',
      amount: 220,
      billedAt: new Date('2024-07-22'),
      currency: 'ILS',
      creditId: 'credit-card-4481'
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
        fromDate={new Date('2024-07-01')}
        toDate={new Date('2024-07-31')}
        creditId="credit-card-4481"
      />
    </div>
  )
}

export default CartdStatusDemo 