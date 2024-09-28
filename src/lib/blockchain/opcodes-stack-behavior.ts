import { hash160, hash256, sha256 } from 'bitcoinjs-lib/src/crypto'
import { Opcode } from './opcodes'
import ScriptStack from './script-stack'
import { checkMultiSig, checkSig } from './signature'

export const opcodeStackBehavior: {
  [key in Opcode]?: (stack: ScriptStack, ...args: any[]) => void | Promise<void>
} = {
  OP_0: (stack: ScriptStack) => stack.push('0'),
  OP_1: (stack: ScriptStack) => stack.push('1'),
  OP_2: (stack: ScriptStack) => stack.push('2'),
  OP_3: (stack: ScriptStack) => stack.push('3'),
  OP_4: (stack: ScriptStack) => stack.push('4'),
  OP_5: (stack: ScriptStack) => stack.push('5'),
  OP_6: (stack: ScriptStack) => stack.push('6'),
  OP_7: (stack: ScriptStack) => stack.push('7'),
  OP_8: (stack: ScriptStack) => stack.push('8'),
  OP_9: (stack: ScriptStack) => stack.push('9'),
  OP_10: (stack: ScriptStack) => stack.push('10'),
  OP_11: (stack: ScriptStack) => stack.push('11'),
  OP_12: (stack: ScriptStack) => stack.push('12'),
  OP_13: (stack: ScriptStack) => stack.push('13'),
  OP_14: (stack: ScriptStack) => stack.push('14'),
  OP_15: (stack: ScriptStack) => stack.push('15'),
  OP_16: (stack: ScriptStack) => stack.push('16'),
  OP_DUP: (stack: ScriptStack) => {
    const item = stack.pop()
    if (!item) return
    stack.push(item)
    stack.push(item)
  },
  OP_3DUP: (stack: ScriptStack) => {
    const item1 = stack.pop()
    const item2 = stack.pop()
    const item3 = stack.pop()
    if (!item1 || !item2 || !item3) return
    stack.push(item3)
    stack.push(item2)
    stack.push(item1)
    stack.push(item3)
    stack.push(item2)
    stack.push(item1)
  },
  OP_ADD: (stack: ScriptStack) => {
    const item1 = Number(stack.pop())
    const item2 = Number(stack.pop())
    if (!item1 || !item2) return
    stack.push((item1 + item2).toString())
  },
  OP_HASH160: (stack: ScriptStack) => {
    const item = stack.pop()
    if (!item) return
    stack.push(hash160(Buffer.from(item, 'hex')).toString('hex'))
  },
  OP_HASH256: (stack: ScriptStack) => {
    const item = stack.pop()
    if (!item) return
    stack.push(hash256(Buffer.from(item, 'hex')).toString('hex'))
  },
  OP_SHA256: (stack: ScriptStack) => {
    const item = stack.pop()
    if (!item) return
    stack.push(sha256(Buffer.from(item, 'hex')).toString('hex'))
  },
  OP_EQUAL: (stack: ScriptStack) => {
    const item1 = stack.pop()
    const item2 = stack.pop()
    if (item1 === item2) {
      stack.push('1')
    } else {
      stack.push('0')
    }
  },
  OP_EQUALVERIFY: (stack: ScriptStack) => {
    const item1 = stack.pop()
    const item2 = stack.pop()
    if (item1 !== item2) {
      throw new Error('OP_EQUALVERIFY 失败')
    }
  },
  OP_CHECKSIG: (
    stack: ScriptStack,
    txHex: string,
    inIndex: number,
    prevOutScript: string,
    amount: number
  ) => {
    try {
      const publicKey = stack.pop()
      const signature = stack.pop()
      if (!publicKey || !signature) return

      const isValid = checkSig(
        publicKey,
        signature,
        txHex,
        inIndex,
        prevOutScript,
        amount
      )

      if (isValid) stack.push('1')
      else stack.push('0')
    } catch (error) {
      stack.push('0')
    }
  },
  OP_CHECKMULTISIG: (
    stack: ScriptStack,
    txHex: string,
    inIndex: number,
    prevOutScript: string,
    amount: number
  ) => {
    try {
      const publicKeyCount = Number(stack.pop())
      const publicKeys: string[] = []
      for (let i = 0; i < publicKeyCount; i++) {
        publicKeys.unshift(stack.pop()!)
      }

      const signatureCount = Number(stack.pop())
      const signatures: string[] = []
      for (let i = 0; i < signatureCount; i++) {
        signatures.unshift(stack.pop()!)
      }

      stack.pop()

      const isValid = checkMultiSig(
        signatureCount,
        publicKeys,
        signatures,
        txHex,
        inIndex,
        prevOutScript,
        amount
      )
      if (isValid) stack.push('1')
      else stack.push('0')
    } catch (error) {
      stack.push('0')
    }
  }
}
