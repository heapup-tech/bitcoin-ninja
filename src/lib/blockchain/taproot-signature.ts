import ecc from '@bitcoinerlab/secp256k1'
import { networks, type Signer } from 'bitcoinjs-lib'
import { taggedHash } from 'bitcoinjs-lib/src/crypto'
import ECPair from './ecpair'

function toXOnly(pubkey: Buffer): Buffer {
  return pubkey.subarray(1, 33)
}

function tapTweakHash(pubKey: Buffer, h: Buffer | undefined): Buffer {
  return taggedHash('TapTweak', Buffer.concat(h ? [pubKey, h] : [pubKey]))
}

export const tweakSigner = (
  signer: Signer,
  network = networks.testnet,
  opts: any = {}
) => {
  // @ts-ignore
  let privateKey: Uint8Array | undefined = signer.privateKey!
  if (!privateKey) {
    throw new Error('Private key is required for tweaking signer!')
  }
  if (signer.publicKey[0] === 3) {
    privateKey = ecc.privateNegate(privateKey)
  }

  const tweak = tapTweakHash(toXOnly(signer.publicKey), opts.tweakHash)
  const tweakedPrivateKey = ecc.privateAdd(privateKey, tweak)
  if (!tweakedPrivateKey) {
    throw new Error('Invalid tweaked private key!')
  }

  return {
    tweak,
    tweakedPrivateKey: tweakedPrivateKey,
    tweakedSigner: ECPair.fromPrivateKey(Buffer.from(tweakedPrivateKey), {
      network
    })
  }
}
