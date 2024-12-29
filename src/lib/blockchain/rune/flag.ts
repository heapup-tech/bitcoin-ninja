export default class Flag {
  readonly Etching = 0
  readonly Terms = 1
  readonly Turbo = 2
  readonly Cenotaph = 127

  mask() {
    return 1 << 2
  }
  take(flags: bigint) {
    let mask
  }
}
