export enum Flag {
  Etching = 0,
  Terms = 1,
  Turbo = 2,
  Cenotaph = 127
}

export const FlagUtil = {
  mask(flag: number) {
    return BigInt(1 << flag)
  },
  take(type: Flag, flags: bigint) {
    let mask = this.mask(type)

    console.log(`mask: ${mask}`)

    let set = (flags & mask) !== 0n

    console.log(`set: ${set}`)

    // flags &= !mask

    return set
  }
}
