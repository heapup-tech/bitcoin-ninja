/**
 * 标志位: 用于标记一些特殊的状态
 * 初始状态是 0,
 * 设置某个标志位, 就是将对应的位设置为 1
 * 例如:
 * Terms, 0000 0010
 * Turbo, 0000 0100
 * 同时具有 Terms 和 Turbo 两个标志位, 0000 0110
 *
 * 最大支持 128 个标志位
 */
export enum Flag {
  Etching = 0,
  Terms = 1,
  Turbo = 2,
  Cenotaph = 127
}

export class FlagManger {
  private _flags: bigint = 0n

  constructor(flags: bigint) {
    this._flags = flags
  }

  // 获取掩码
  private mask(flag: Flag): bigint {
    return 1n << BigInt(flag)
  }

  /**
   * 设置标志位
   * 例如初始是 Terms 标志位 0000 0010, 追加 Turbo 标志位
   * this.mask(Flag.Turbo) => 0000 0100
   * 按位或运算 0000 0010 | 0000 0100 = 0000 0110
   */
  set(flag: Flag) {
    this._flags |= this.mask(flag)
  }

  /**
   * 判断是否有某个标志位, 并清除该标志位
   * 假设当前标志位是 0000 0110, 判断是否有 Turbo 标志位
   * this.mask(Flag.Turbo) => 0000 0100
   * 按位与运算 0000 0110 & 0000 0100 = 0000 0100 不为 0, 说明有 Turbo 标志位
   * 判断第4位是否为 1, 0000 0110 & 0000 1000 = 0000 0000 为 0, 说明没有第4位
   *
   * ~mask 为取反, 例如 0000 0100 取反为 1111 1011
   * 清除标志位, 0000 0110 & 1111 1011 = 0000 0010  标志位仅剩 Terms
   */
  take(flag: Flag) {
    const mask = this.mask(flag)

    const set = (this._flags & mask) !== 0n

    this._flags &= ~mask

    return set
  }

  get flags() {
    return this._flags
  }
}
