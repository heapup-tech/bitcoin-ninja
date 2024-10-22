class EllipticCurve {
  constructor(a, b, p) {
    this.a = BigInt(a)
    this.b = BigInt(b)
    this.p = BigInt(p)
  }

  // 检查点是否在曲线上
  isOnCurve(point) {
    if (point === null) return true // 无穷远点
    const [x, y] = point.map(BigInt)
    const left = (y * y) % this.p
    const right =
      (((x * x * x) % this.p) + ((this.a * x) % this.p) + this.b) % this.p
    return (left - right) % this.p === 0n
  }

  // 寻找二次剩余
  isQuadraticResidue(n) {
    n = BigInt(n)
    const power = (this.p - 1n) / 2n
    return this.modPow(n, power, this.p) === 1n
  }

  // 模幂运算
  modPow(base, exponent, modulus) {
    base = BigInt(base)
    exponent = BigInt(exponent)
    modulus = BigInt(modulus)

    if (modulus === 1n) return 0n

    let result = 1n
    base = base % modulus

    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % modulus
      }
      base = (base * base) % modulus
      exponent = exponent / 2n
    }
    return result
  }

  // 扩展欧几里得算法
  extendedGcd(a, b) {
    a = BigInt(a)
    b = BigInt(b)
    let old_r = a,
      r = b
    let old_s = 1n,
      s = 0n
    let old_t = 0n,
      t = 1n

    while (r !== 0n) {
      const quotient = old_r / r
      ;[old_r, r] = [r, old_r - quotient * r]
      ;[old_s, s] = [s, old_s - quotient * s]
      ;[old_t, t] = [t, old_t - quotient * t]
    }

    return [old_r, old_s, old_t]
  }

  // 模逆运算
  modInverse(a) {
    const [gcd, x] = this.extendedGcd(a, this.p)
    if (gcd !== 1n) {
      throw new Error('模逆不存在')
    }
    return ((x % this.p) + this.p) % this.p
  }

  // 点加法
  addPoints(P1, P2) {
    // 处理无穷远点
    if (P1 === null) return P2
    if (P2 === null) return P1

    const [x1, y1] = P1.map(BigInt)
    const [x2, y2] = P2.map(BigInt)

    // P1 + (-P1) = O
    if (x1 === x2 && (y1 + y2) % this.p === 0n) {
      return null
    }

    let lambda
    if (x1 === x2 && y1 === y2) {
      // 点倍运算
      if (y1 === 0n) return null
      lambda = ((3n * x1 * x1 + this.a) * this.modInverse(2n * y1)) % this.p
    } else {
      // 不同点相加
      lambda = ((y2 - y1) * this.modInverse(x2 - x1)) % this.p
    }

    const x3 = (lambda * lambda - x1 - x2) % this.p
    const y3 = (lambda * (x1 - x3) - y1) % this.p

    return [(x3 + this.p) % this.p, (y3 + this.p) % this.p]
  }

  // 点乘法
  multiplyPoint(k, P) {
    k = BigInt(k)
    let result = null // 无穷远点
    let current = P

    while (k > 0n) {
      if (k % 2n === 1n) {
        result = this.addPoints(result, current)
      }
      current = this.addPoints(current, current)
      k = k / 2n
    }
    return result
  }

  // 寻找曲线上的所有点
  findPoints() {
    const points = [null] // 包含无穷远点

    for (let x = 0n; x < this.p; x++) {
      const ySq =
        (((x * x * x) % this.p) + ((this.a * x) % this.p) + this.b) % this.p

      if (this.isQuadraticResidue(ySq)) {
        // 使用平方根
        let y = this.modPow(ySq, (this.p + 1n) / 4n, this.p)
        points.push([Number(x), Number(y)])

        if (y !== 0n) {
          points.push([Number(x), Number(this.p - y)])
        }
      }
    }
    return points
  }
}

// 使用示例
const curve = new EllipticCurve(2, 2, 17)

// 找出曲线上所有点
console.log('曲线上的所有点：')
const points = curve.findPoints()
points.forEach((point) => console.log(point))

// 选择生成点G（第一个非无穷远点）
const G = points.find((point) => point !== null)
console.log('\n生成点 G:', G)

// 演示点运算
console.log('\n点运算示例：')
console.log('2G =', curve.multiplyPoint(2, G))
console.log('3G =', curve.multiplyPoint(3, G))
console.log('4G =', curve.multiplyPoint(4, G))

// 计算生成点的阶
let order = 1
let temp = G
while (temp !== null) {
  temp = curve.addPoints(temp, G)
  order++
  if (order > 100) break // 防止无限循环
}
console.log('\n生成点G的阶为:', order)
