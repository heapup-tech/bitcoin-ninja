<p align="center">
  <a href="https://bitcoin.heapup.tech">
    <img alt="Bitcoin Ninja Logo" width="100" src="https://bitcoin.heapup.tech/bitcoin-ninja.svg">
  </a>
</p>

<p align="center">
  <a href="https://github.com/heapup-tech/bitcoin-ninja/blob/main/LICENSE">
    <img src="https://badgen.net/github/license/heapup-tech/bitcoin-ninja?color=green" alt="License">
  </a>
  <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" />
    <img src="https://visitor-badge.laobi.icu/badge?page_id=heapup-tech.bitcoin-ninja" alt="visitors" />
</p>

---

## Bitcoin Ninja

`Bitcoin Ninja` 是一个开源的比特币教程。

通过可视化的方式, 渐进式的学习比特币相关内容。包括区块组成、挖矿原理、交易结构、脚本执行模拟、私钥和地址生成、签名计算与验证等。

## 主页

访问 [Bitcoin Ninja](https://bitcoin.heapup.tech) 查看更多详细内容。

## 结构

- 所有的教程内容在 `content` 目录下, 以 `.mdx` 格式编写
- 比特币内容相关组件在 `src/components/blockchain` 目录
- 比特币内容相关工具函数在 `src/lib/blockchain` 目录
- 客户端组件的比特币 `RPC` 请求使用服务端行为, 在 `src/server-actions` 目录

## 本地运行

复制 `.env.local.sample` 到 `.env.local`, 修改 `BITCOIN_RPC_ENDPOINT` 为你的比特币 `RPC` 节点地址, 接着运行下面命令:

```shell
pnpm i

pnpm run dev
```

# License

Licensed under the [MIT license](https://github.com/heapup-tech/bitcoin-ninja/blob/main/LICENSE).
