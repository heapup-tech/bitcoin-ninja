// 定义点的类型
export type Point = {
  x: number
  y: number
} | null // null 表示无穷远点

const mod = (a: number, b: number) => {
  let r = a % b
  return r >= 0 ? r : b + r
}

export default class EllipticCurve {
  constructor(
    public a: number,
    public b: number,
    public p: number
  ) {
    this.a = a
    this.b = b
    this.p = p
  }

  // 寻找曲线上的所有点
  findPoints() {
    const points: Array<{ x: number; y: number }> = []
    for (let x = 0; x < this.p; x++) {
      for (let y = 0; y < this.p; y++) {
        if (
          Math.pow(y, 2) % this.p ===
          (Math.pow(x, 3) + this.a * x + this.b) % this.p
        ) {
          points.push({ x, y })
        }
      }
    }
    return points
  }

  // 检查点是否在曲线上
  isOnCurve(P: Point): boolean {
    if (P === null) return true // 无穷远点总是在曲线上

    const { x, y } = P
    const left = (y * y) % this.p
    const right = (x * x * x + this.a * x + this.b) % this.p
    return left === right
  }

  // 模逆元计算 (扩展欧几里得算法)
  public modInverse(a: number, m: number): number {
    // 确保 a 是正数且在模数范围内
    a = ((a % m) + m) % m

    let [old_r, r] = [a, m]
    let [old_s, s] = [1, 0]
    let [old_t, t] = [0, 1]

    while (r !== 0) {
      const quotient = Math.floor(old_r / r)
      ;[old_r, r] = [r, old_r - quotient * r]
      ;[old_s, s] = [s, old_s - quotient * s]
      ;[old_t, t] = [t, old_t - quotient * t]
    }

    if (old_r !== 1) {
      throw new Error(
        `Modular multiplicative inverse does not exist (${a} and ${m} are not coprime)`
      )
    }

    return ((old_s % m) + m) % m
  }

  addPoints(P: Point, Q: Point): Point | null {
    if (!this.isOnCurve(P) || !this.isOnCurve(Q)) return null
    if (P === null) return Q
    if (Q === null) return P

    if (P.x === Q.x && P.y === (-Q.y + this.p) % this.p) return null

    let lambda: number // 斜率

    if (P.x === Q.x && P.y === Q.y) {
      // 倍乘

      // 计算斜率
      const numerator = (3 * P.x * P.x + this.a) % this.p
      const denominator = (2 * P.y) % this.p

      lambda = (numerator * this.modInverse(denominator, this.p)) % this.p
    } else {
      // 点加
      // 计算斜率, + this.p 确保结果是正数
      const numerator = (Q.y - P.y + this.p) % this.p
      const denominator = (Q.x - P.x + this.p) % this.p

      lambda = (numerator * this.modInverse(denominator, this.p)) % this.p
    }
    const x = mod(lambda * lambda - P.x - Q.x + this.p * 2, this.p)
    const y = mod(lambda * (P.x - x) - P.y, this.p)

    return { x, y }
  }

  multiplyPoint(P: Point, n: number): Point {
    if (n === 0) return null
    if (n === 1) return P

    if (P === null) return null

    // 将 n 转换为二进制
    const binaryN = n.toString(2)
    let Q: Point | null = P

    for (let i = 1; i < binaryN.length; i++) {
      // 1. 倍点（Double）
      Q = this.addPoints(Q, Q)

      if (Q === null) return null

      // 2. 如果当前二进制位为 1，则加上 P（Add）
      if (binaryN[i] === '1') {
        Q = this.addPoints(Q, P)
      }
    }

    return Q
  }

  getOrders(P: Point): Point[] {
    if (P === null || !this.isOnCurve(P)) throw new Error('Invalid point')

    let Q: Point | null = P
    let n = 1

    let points: Array<Point> = [P]
    while (Q !== null) {
      Q = this.addPoints(Q, P)
      points.push(Q)
      n++
    }

    return points
  }
}

// // 使用示例
// const curve = new EllipticCurve(2, 3, 17)
