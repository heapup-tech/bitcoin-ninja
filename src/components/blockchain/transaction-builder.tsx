'use client'

import { useState } from 'react'
import InteractionCard from '../interaction-card'

export default function TransactionBuilder() {
  const [inputs, setInputs] = useState<TransactionInput[]>([])
  const [outputs, setOutputs] = useState<TransactionOutput[]>([])
  const [fee, setFee] = useState('0')
  const [rawTransaction, setRawTransaction] = useState('')
  const [isError, setIsError] = useState(false)
  const [isErrorRawTransaction, setIsErrorRawTransaction] = useState(false)

  return <InteractionCard title='Segwit 交易构造器'></InteractionCard>
}
