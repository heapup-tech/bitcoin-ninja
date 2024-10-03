import ecc from '@bitcoinerlab/secp256k1'
import { initEccLib, script, Transaction } from 'bitcoinjs-lib'
import { ECPairFactory } from 'ecpair'
import { compileP2PKH, isP2TR, isP2WPKH, isP2WSH } from './script-utils'
const ECPair = ECPairFactory(ecc)

initEccLib(ecc)

export const checkSig = (
  pubkey: string,
  signature: string,
  txHex: string,
  inIndex: number,
  prevOutScript: string,
  amount: number
): boolean => {
  if (!txHex) return false
  const tx = Transaction.fromHex(txHex)

  const keypair = ECPair.fromPublicKey(Buffer.from(pubkey, 'hex'))

  const signatureBuffer = Buffer.from(signature, 'hex')
  const { signature: decodedSignature, hashType } =
    script.signature.decode(signatureBuffer)

  const prevOutScriptBuffer = Buffer.from(prevOutScript, 'hex')
  let signatureHash: Buffer | null = null

  if (tx.hasWitnesses()) {
    if (isP2WPKH(prevOutScript)) {
      let pubkeyHash = script.toASM(prevOutScriptBuffer).split(' ')[1]
      const outScript = compileP2PKH(pubkeyHash)
      signatureHash = tx.hashForWitnessV0(
        inIndex,
        Buffer.from(outScript, 'hex'),
        amount,
        hashType
      )
    } else if (isP2TR(prevOutScript)) {
      signatureHash = tx.hashForWitnessV1(
        inIndex,
        [prevOutScriptBuffer],
        [amount],
        hashType
      )
    }
  } else {
    signatureHash = tx.hashForSignature(inIndex, prevOutScriptBuffer, hashType)
  }

  if (!signatureHash) return false

  let isValid = false

  if (isP2TR(prevOutScript)) {
    isValid = keypair.verifySchnorr(signatureHash, decodedSignature)
  } else {
    isValid = keypair.verify(signatureHash, decodedSignature)
  }

  return isValid
}

export const checkMultiSig = (
  m: number,
  pubkeys: string[],
  signatures: string[],
  txHex: string,
  inIndex: number,
  prevOutScript: string,
  amount: number
): boolean => {
  if (!txHex) return false

  const tx = Transaction.fromHex(txHex)

  let sigIndex = 0
  let pubkeyIndex = 0

  while (sigIndex < m && pubkeyIndex < pubkeys.length) {
    const signature = Buffer.from(signatures[sigIndex], 'hex')
    const pubkey = Buffer.from(pubkeys[pubkeyIndex], 'hex')
    const { signature: decodedSignature, hashType } =
      script.signature.decode(signature)

    let signatureHash: Buffer | null = null

    if (tx.hasWitnesses()) {
      if (isP2WSH(prevOutScript)) {
        const inIndexWitness = tx.ins[inIndex].witness
        signatureHash = tx.hashForWitnessV0(
          inIndex,
          inIndexWitness[inIndexWitness.length - 1], // 赎回脚本
          amount,
          hashType
        )
      }
    } else {
      signatureHash = tx.hashForSignature(
        inIndex,
        Buffer.from(prevOutScript, 'hex'),
        hashType
      )
    }

    if (!signatureHash) return false
    const keypair = ECPair.fromPublicKey(pubkey)
    if (keypair.verify(signatureHash, decodedSignature)) {
      sigIndex++
    }
    pubkeyIndex++
  }

  const isValid = sigIndex === m

  return isValid
}

// checkSig(
//   '03f6755a6ee93c7be8d15bf0e324c7db1890fdd951b77668ffd9575a061afef477',
//   '30440220303d5b5da4fb983de3a536f66f9d603f4de348b6a3d263e9ffc32a42309cd28602204aea9cf60eb52f8fc017cd0bb6b8326146b9f4215a73649093203cbd098fdc7101',
//   '02000000000101df664a001d86687b0c60809ba2876a895f2dbf7d379c3573821e44209ed03e6d0100000000fdffffff019186e7040000000017a9140ad75d75b40799d5441eaafcc242af51fdbf6f2387024730440220303d5b5da4fb983de3a536f66f9d603f4de348b6a3d263e9ffc32a42309cd28602204aea9cf60eb52f8fc017cd0bb6b8326146b9f4215a73649093203cbd098fdc71012103f6755a6ee93c7be8d15bf0e324c7db1890fdd951b77668ffd9575a061afef477ff270d00',
//   0,
//   'p2wpkh',
//   82285459
// )

// checkMultiSig(
//   2,
//   [
//     '03348ac32a74b4d29fca6d5fe19ec0bbc024c18e3a36344a1e709f3f53fa06d3b8',
//     '02f772bdcf1406e59c492a2eb49b95e5cfbf103b8d1a375779f19c6d3c155a752f',
//     '02da69f954a5c304c4429b43fecaf4114fae573d2ba6189d8ef6a4a67c9473ed2c'
//   ],
//   [
//     '3045022100adb72e46a74e31f763e56b9b59ae9705f13e3d9347771cd12e2297edb50c64ef02205c67ad3cacbaeb345e3e795a3ed77772a90f8626497c5faa2ec632ac2cad8fe401',
//     '304502210090bf186062bed9be0a465f766b55751b50e0a4df640f08d9d6575af61b2a96ea0220788933538950f5157de6f92b867a33f78aab6893e941dc777b4a7fe1f27c404a01'
//   ],
//   '010000000001012cbe1cef2f10a34e2f155342e35b35179955542e093b823d7de6c41b15cd4c9f0100000000fdffffff0298ea240000000000220020ae7ca40ea2f10255ffae6c0893489f26677e43c4f5e967cb43a5f243ccbb4ec467e72c00000000002200207bb8f5802ae446be4e5f7dde387ca1624faee09a8643a8c16ff87df4235e25840400483045022100adb72e46a74e31f763e56b9b59ae9705f13e3d9347771cd12e2297edb50c64ef02205c67ad3cacbaeb345e3e795a3ed77772a90f8626497c5faa2ec632ac2cad8fe40148304502210090bf186062bed9be0a465f766b55751b50e0a4df640f08d9d6575af61b2a96ea0220788933538950f5157de6f92b867a33f78aab6893e941dc777b4a7fe1f27c404a0169522103348ac32a74b4d29fca6d5fe19ec0bbc024c18e3a36344a1e709f3f53fa06d3b82102f772bdcf1406e59c492a2eb49b95e5cfbf103b8d1a375779f19c6d3c155a752f2102da69f954a5c304c4429b43fecaf4114fae573d2ba6189d8ef6a4a67c9473ed2c53ae00000000',
//   0,
//   '0020758c229ce3fa5a3db9963baf485b7a7dec6faeed35cfc28395fd8095dde3115e',
//   5392475
// )

// const verifyP2TR = () => {
//   const tx = Transaction.fromHex(
//     '02000000000101c1d468b687c165337bcf3ca07194b142f09d4f74e244044a6a8fee9d5539f0ab0200000000ffffffff025798000000000000160014f90371a81f05e7f13091c523ac4ab2f438f9e30272003000000000002251203cb650a3809269365cfea9874982c00b2f61951203a6f3b3686848f1e1b08d460140ad06bd890367e518991fa7337b834032d824586b61d95cf84c0a53ee2c58cb37b53e324c8f85609da8f90da48f35af10121420f112dfc91ea6ed5fccfa0c5f8a00000000'
//   )

//   const utxo = {
//     script: Buffer.from(
//       '51203cb650a3809269365cfea9874982c00b2f61951203a6f3b3686848f1e1b08d46',
//       'hex'
//     ),
//     amount: 3185699
//   }

//   const taprootPubkey = utxo.script.subarray(2)

//   console.log('taprootPubkey', toHex(taprootPubkey))

//   const sigHash = tx.hashForWitnessV1(
//     0,
//     [utxo.script],
//     [utxo.amount],
//     Transaction.SIGHASH_DEFAULT
//   )

//   const signature = tx.ins[0].witness[0]

//   const isValid = verifySchnorr(sigHash, taprootPubkey, signature)

//   console.log(`isValid: ${isValid}`)
// }

// verifyP2TR()
