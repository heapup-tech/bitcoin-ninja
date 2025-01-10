export default interface Terms {
  amount?: bigint
  cap?: bigint
  height: [bigint | undefined, bigint | undefined]
  offset: [bigint | undefined, bigint | undefined]
}
