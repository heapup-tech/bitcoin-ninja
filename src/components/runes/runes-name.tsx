'use client'
import Rune from '@/lib/blockchain/rune/rune'
import { ChangeEvent, useState } from 'react'
import ContentCard from '../content-card'
import InteractionCard from '../interaction-card'
import { Input } from '../ui/input'

export default function RunesName() {
  const [runesStr, setRunesStr] = useState('AWESOME•BITCOIN•RUNES')
  const [spacer, setSpacer] = useState(8256n)
  const [runesInteger, setRunesInteger] = useState(55808450486346175951254004n)
  const [inputSource, setInputSource] = useState('')
  const [error, setError] = useState('')

  const handleStrChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputSource('string')

    // 只允许输入大写字母A-Z
    if (/^[A-Z•]*$/.test(newValue)) {
      setRunesStr(newValue)
      if (newValue) {
        try {
          let rune = Rune.fromSymbol(newValue)
          setRunesInteger(rune.value)
          setSpacer(rune.spacer)
        } catch (err) {
          setError('转换失败')
        }
      } else {
        setRunesInteger(0n)
      }
    } else {
      setError('只允许输入大写字母A-Z')
    }
  }

  const handleIntegerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputSource('integer')
    setError('')
    try {
      const newValue = BigInt(e.target.value)
      setRunesInteger(newValue)
      setRunesStr(new Rune(newValue).display())
    } catch (err) {
      setError('无效的数字输入')
    }
  }

  const handleSpacerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSpacer(BigInt(newValue))

    const rune = new Rune(runesInteger)

    const s = rune.displayWithSpacers(Number(e.target.value))
    console.log(s)

    setRunesStr(s)
  }
  return (
    <InteractionCard title='Runes 名称编解码'>
      <ContentCard title='Runes 名称'>
        <Input
          onChange={handleStrChange}
          value={runesStr}
          className='bg-white'
        />
      </ContentCard>

      <ContentCard title='Runes 名称整数表示'>
        <Input
          onChange={handleIntegerChange}
          type='number'
          value={runesInteger.toString()}
          className='bg-white'
        />
      </ContentCard>

      <ContentCard title='分割符Spacer'>
        <Input
          onChange={handleSpacerChange}
          type='number'
          value={spacer.toString()}
          className='bg-white'
        />
      </ContentCard>
    </InteractionCard>
  )
}
