'use client'

import { binaryToByte, bytesToBinary } from '@/lib/blockchain/bytes'
import { generateEntropy } from '@/lib/blockchain/keys'
import {
  ENT,
  ENTROPYWORDMAP,
  GETCOLORS,
  MNEMONIC_LANGUAGES
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { pbkdf2 } from '@noble/hashes/pbkdf2'
import { sha256 } from '@noble/hashes/sha256'
import { sha512 } from '@noble/hashes/sha512'
import { wordlists } from 'bip39'
import { CircleHelp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fromHex, toHex } from 'uint8array-tools'
import InteractionCard from '../interaction-card'
import RadixViewer from '../radix-viewer'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export default function MnemonicGenerator() {
  const [entropyLength, setEntropyLength] = useState<ENT>(128)
  const [entropy, setEntropy] = useState('')
  const [entropyBits, setEntropyBits] = useState('')
  const [checksumBits, setChecksumBits] = useState('')

  const [language, setLanguage] = useState('english')

  const [groupBits, setGroupBits] = useState<string[]>([])

  const [wordIndexs, setWordIndexs] = useState<number[]>([])
  const [words, setWords] = useState<string[]>([])
  const [password, setPassword] = useState<string>('')
  const [seed, setSeed] = useState<string>('')

  useEffect(() => {
    generateRandomEntropy()
  }, [])

  useEffect(() => {
    generateRandomEntropy()
  }, [entropyLength])

  useEffect(() => {}, [language])

  const generateRandomEntropy = () => {
    setEntropy(generateEntropy(entropyLength).hexadecimal)
  }

  useEffect(() => {
    if (!entropy) return
    calulateMnemonic()
  }, [entropy])

  const calulateMnemonic = () => {
    const entropyBytes = fromHex(entropy)
    const ENT = entropyBytes.length * 8

    const entropyBits = bytesToBinary(Array.from(entropyBytes))
    const checksumBits = bytesToBinary(Array.from(sha256(entropyBytes))).slice(
      0,
      ENT / 32
    )

    setEntropyBits(entropyBits)
    setChecksumBits(checksumBits)

    const bits = entropyBits + checksumBits

    const chunks = bits.match(/(.{1,11})/g)!
    setGroupBits(chunks)
    const wordIndexs = chunks.map((binary: string): number => {
      return binaryToByte(binary)
    })

    setWordIndexs(wordIndexs)
  }

  useEffect(() => {
    if (!wordIndexs.length) return
    const wordlist = wordlists[language]
    const words = wordIndexs.map((index) => wordlist[index])
    setWords(words)
  }, [wordIndexs, language])

  useEffect(() => {
    if (!words.length) return

    const mnemonic = words.join(' ').normalize('NFKD')

    const mnemonicBuffer = Uint8Array.from(Buffer.from(mnemonic, 'utf8'))
    const saltBuffer = Uint8Array.from(
      Buffer.from(`mnemonic${password}`, 'utf8')
    )

    const seedBuffer = pbkdf2(sha512, mnemonicBuffer, saltBuffer, {
      c: 2048,
      dkLen: 64
    })
    setSeed(toHex(seedBuffer))
  }, [words, password])
  return (
    <InteractionCard title='助记词生成器'>
      <div className='flex items-center gap-x-4'>
        <Select
          onValueChange={(v) => {
            setEntropyLength(Number(v) as ENT)
          }}
          value={String(entropyLength)}
        >
          <SelectTrigger className='bg-background text-base truncate w-auto'>
            <SelectValue placeholder='选择长度' />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(ENTROPYWORDMAP) as unknown as ENT[]).map(
              (key, index) => {
                return (
                  <SelectItem
                    key={key + ENTROPYWORDMAP[key]}
                    value={String(key)}
                  >
                    {/* {toHex(reverseBytes(txin.hash))} - {txin.index} */}
                    {`${key}位 - ${key / 8}字节 - ${ENTROPYWORDMAP[key]} 单词`}
                  </SelectItem>
                )
              }
            )}
          </SelectContent>
        </Select>

        <Button
          onClick={generateRandomEntropy}
          size='sm'
        >
          随机生成Entropy
        </Button>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>
        <Label>Entropy</Label>
        <RadixViewer
          radix={{
            binary: entropyBits,
            hexadecimal: entropy
          }}
          perfer='binary'
        />
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>
        <Label className='flex items-center gap-x-1.5'>
          <span>CheckSum</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleHelp className='w-4' />
            </TooltipTrigger>
            <TooltipContent>
              取 SHA256(entropy) 的前 ENT/32 比特位
            </TooltipContent>
          </Tooltip>
        </Label>
        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
          <span className={cn(GETCOLORS(0))}>{checksumBits}</span>
        </div>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>
        <Label>Entropy + CheckSum</Label>
        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
          <span className={cn(GETCOLORS(1))}>{entropyBits}</span>
          <span className={cn(GETCOLORS(0))}>{checksumBits}</span>
        </div>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>
        <Label className='flex items-center gap-x-1.5'>
          <span>分组</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleHelp className='w-4' />
            </TooltipTrigger>
            <TooltipContent>每 11 比特位转成10进制作为索引</TooltipContent>
          </Tooltip>
        </Label>
        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
          <span className={cn(GETCOLORS(1))}>
            {groupBits.map((bits, index) => {
              if (index !== groupBits.length - 1) {
                return (
                  <span key={bits + index}>
                    {bits} <span className='text-foreground'>-</span>{' '}
                  </span>
                )
              } else {
                return (
                  <span key={bits + index}>
                    <span>{bits.slice(0, 11 - checksumBits.length)}</span>
                    <span className={cn(GETCOLORS(0))}>
                      {bits.slice(11 - checksumBits.length)}
                    </span>
                  </span>
                )
              }
            })}
          </span>
        </div>

        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9 mt-2'>
          <span className={cn(GETCOLORS(2))}>
            {groupBits.map((bits, index) => {
              return (
                <span key={bits + index}>
                  <span>{parseInt(bits, 2)}</span>
                  {index !== groupBits.length - 1 && (
                    <span className='text-foreground'> - </span>
                  )}
                </span>
              )
            })}
          </span>
        </div>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>
        <div className='flex items-center gap-x-1.5'>
          <span>助记词</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleHelp className='w-4' />
            </TooltipTrigger>
            <TooltipContent>
              根据索引从单词表中提取单词作为助记词
            </TooltipContent>
          </Tooltip>
          <Select
            onValueChange={(v) => {
              setLanguage(v)
            }}
            value={String(language)}
          >
            <SelectTrigger className='bg-background truncate w-auto h-8 rounded-md px-3 text-xs'>
              <SelectValue placeholder='选择语言' />
            </SelectTrigger>
            <SelectContent>
              {MNEMONIC_LANGUAGES.map((item) => {
                return (
                  <SelectItem
                    key={item.name}
                    value={item.value}
                  >
                    {item.name}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9 mt-0.5'>
          {words.map((word, index) => (
            <span
              className={cn(GETCOLORS(index))}
              key={word + index}
            >
              {word}
              {index < words.length - 1 && <span> </span>}
            </span>
          ))}
        </div>

        <div className='text-sm font-medium mt-4 mb-0.5'>
          <Label className='flex items-center gap-x-1.5'>
            <span>Seed</span>
            <Input
              placeholder='密码(可选)'
              className='bg-background w-40 h-8 rounded-md px-3 text-xs'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </Label>
          <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9  mt-0.5'>
            <span className={cn(GETCOLORS(3))}>{seed}</span>
          </div>
        </div>
      </div>
    </InteractionCard>
  )
}
