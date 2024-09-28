import { SidebarNavItem } from '@/types/nav'

export const technicalSidebar: SidebarNavItem[] = [
  {
    title: '基础',
    items: [
      {
        title: '区块链',
        href: '/technical/basic/blockchain'
      },
      {
        title: '节点',
        href: '/technical/basic/node'
      },
      {
        title: '目标值',
        href: '/technical/basic/target'
      },
      {
        title: '交易',
        href: '/technical/basic/transaction'
      },
      {
        title: '脚本',
        href: '/technical/basic/script'
      }
    ]
  },
  {
    title: '区块',
    items: [
      {
        title: '版本',
        href: '/technical/block/version'
      },
      {
        title: '前一个区块',
        href: '/technical/block/previous-block'
      },
      {
        title: '默克尔根',
        href: '/technical/block/merkle-root'
      },
      {
        title: '时间',
        href: '/technical/block/time'
      },
      {
        title: 'Bits',
        href: '/technical/block/bits'
      },
      {
        title: 'Nonce',
        href: '/technical/block/nonce'
      }
    ]
  },
  {
    title: '矿工',
    items: [
      {
        title: '内存池',
        href: '/technical/miner/memory-pool'
      },
      {
        title: 'Coinbase 交易',
        href: '/technical/miner/coinbase-transaction'
      },
      {
        title: '挖矿',
        href: '/technical/miner/mine'
      }
    ]
  },
  {
    title: '秘钥',
    items: [
      {
        title: '私钥和地址',
        href: '/technical/keys/secret'
      },
      {
        title: 'HD 钱包',
        href: '/technical/keys/hd-wallet'
      },
      {
        title: '签名',
        href: '/technical/keys/signature'
      }
    ]
  },
  {
    title: '交易',
    items: [
      {
        title: '输入',
        href: '/technical/transaction/input'
      },
      {
        title: '输出',
        href: '/technical/transaction/output'
      },
      {
        title: 'Witness',
        href: '/technical/transaction/witness'
      },
      {
        title: 'Locktime',
        href: '/technical/transaction/locktime'
      },
      {
        title: '交易费',
        href: '/technical/transaction/fee'
      },
      {
        title: '交易加速',
        href: '/technical/transaction/speed'
      }
    ]
  },
  {
    title: '脚本',
    items: [
      {
        title: 'P2PK',
        href: '/technical/script/p2pk'
      },
      {
        title: 'P2PKH',
        href: '/technical/script/p2pkh'
      },
      {
        title: 'P2MS',
        href: '/technical/script/p2ms'
      },
      {
        title: 'P2SH',
        href: '/technical/script/p2sh'
      },
      {
        title: 'P2WPKH',
        href: '/technical/script/p2wpkh'
      },
      {
        title: 'P2WSH',
        href: '/technical/script/p2wsh'
      },
      {
        title: 'P2TR',
        href: '/technical/script/p2tr'
      },
      {
        title: 'OP_RETURN',
        href: '/technical/script/op-return'
      }
    ]
  }
]
