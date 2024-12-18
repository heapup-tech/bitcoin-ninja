export const opcodes = {
  OP_0: '00',
  OP_PUSHBYTES_1: '01',
  OP_PUSHBYTES_2: '02',
  OP_PUSHBYTES_3: '03',
  OP_PUSHBYTES_4: '04',
  OP_PUSHBYTES_5: '05',
  OP_PUSHBYTES_6: '06',
  OP_PUSHBYTES_7: '07',
  OP_PUSHBYTES_8: '08',
  OP_PUSHBYTES_9: '09',
  OP_PUSHBYTES_10: '0a',
  OP_PUSHBYTES_11: '0b',
  OP_PUSHBYTES_12: '0c',
  OP_PUSHBYTES_13: '0d',
  OP_PUSHBYTES_14: '0e',
  OP_PUSHBYTES_15: '0f',
  OP_PUSHBYTES_16: '10',
  OP_PUSHBYTES_17: '11',
  OP_PUSHBYTES_18: '12',
  OP_PUSHBYTES_19: '13',
  OP_PUSHBYTES_20: '14',
  OP_PUSHBYTES_21: '15',
  OP_PUSHBYTES_22: '16',
  OP_PUSHBYTES_23: '17',
  OP_PUSHBYTES_24: '18',
  OP_PUSHBYTES_25: '19',
  OP_PUSHBYTES_26: '1a',
  OP_PUSHBYTES_27: '1b',
  OP_PUSHBYTES_28: '1c',
  OP_PUSHBYTES_29: '1d',
  OP_PUSHBYTES_30: '1e',
  OP_PUSHBYTES_31: '1f',
  OP_PUSHBYTES_32: '20',
  OP_PUSHBYTES_33: '21',
  OP_PUSHBYTES_34: '22',
  OP_PUSHBYTES_35: '23',
  OP_PUSHBYTES_36: '24',
  OP_PUSHBYTES_37: '25',
  OP_PUSHBYTES_38: '26',
  OP_PUSHBYTES_39: '27',
  OP_PUSHBYTES_40: '28',
  OP_PUSHBYTES_41: '29',
  OP_PUSHBYTES_42: '2a',
  OP_PUSHBYTES_43: '2b',
  OP_PUSHBYTES_44: '2c',
  OP_PUSHBYTES_45: '2d',
  OP_PUSHBYTES_46: '2e',
  OP_PUSHBYTES_47: '2f',
  OP_PUSHBYTES_48: '30',
  OP_PUSHBYTES_49: '31',
  OP_PUSHBYTES_50: '32',
  OP_PUSHBYTES_51: '33',
  OP_PUSHBYTES_52: '34',
  OP_PUSHBYTES_53: '35',
  OP_PUSHBYTES_54: '36',
  OP_PUSHBYTES_55: '37',
  OP_PUSHBYTES_56: '38',
  OP_PUSHBYTES_57: '39',
  OP_PUSHBYTES_58: '3a',
  OP_PUSHBYTES_59: '3b',
  OP_PUSHBYTES_60: '3c',
  OP_PUSHBYTES_61: '3d',
  OP_PUSHBYTES_62: '3e',
  OP_PUSHBYTES_63: '3f',
  OP_PUSHBYTES_64: '40',
  OP_PUSHBYTES_65: '41',
  OP_PUSHBYTES_66: '42',
  OP_PUSHBYTES_67: '43',
  OP_PUSHBYTES_68: '44',
  OP_PUSHBYTES_69: '45',
  OP_PUSHBYTES_70: '46',
  OP_PUSHBYTES_71: '47',
  OP_PUSHBYTES_72: '48',
  OP_PUSHBYTES_73: '49',
  OP_PUSHBYTES_74: '4a',
  OP_PUSHBYTES_75: '4b',
  OP_PUSHDATA1: '4c',
  OP_PUSHDATA2: '4d',
  OP_PUSHDATA4: '4e',
  OP_1NEGATE: '4f',
  OP_RESERVED: '50',
  OP_1: '51',
  OP_2: '52',
  OP_3: '53',
  OP_4: '54',
  OP_5: '55',
  OP_6: '56',
  OP_7: '57',
  OP_8: '58',
  OP_9: '59',
  OP_10: '5a',
  OP_11: '5b',
  OP_12: '5c',
  OP_13: '5d',
  OP_14: '5e',
  OP_15: '5f',
  OP_16: '60',

  OP_NOP: '61',
  OP_VER: '62',
  OP_IF: '63',
  OP_NOTIF: '64',
  OP_VERIF: '65',
  OP_VERNOTIF: '66',
  OP_ELSE: '67',
  OP_ENDIF: '68',
  OP_VERIFY: '69',
  OP_RETURN: '6a',

  OP_TOALTSTACK: '6b',
  OP_FROMALTSTACK: '6c',
  OP_2DROP: '6d',
  OP_2DUP: '6e',
  OP_3DUP: '6f',
  OP_2OVER: '70',
  OP_2ROT: '71',
  OP_2SWAP: '72',
  OP_IFDUP: '73',
  OP_DEPTH: '74',
  OP_DROP: '75',
  OP_DUP: '76',
  OP_NIP: '77',
  OP_OVER: '78',
  OP_PICK: '79',
  OP_ROLL: '7a',
  OP_ROT: '7b',
  OP_SWAP: '7c',
  OP_TUCK: '7d',

  OP_CAT: '7e',
  OP_SUBSTR: '7f',
  OP_LEFT: '80',
  OP_RIGHT: '81',
  OP_SIZE: '82',

  OP_INVERT: '83',
  OP_AND: '84',
  OP_OR: '85',
  OP_XOR: '86',
  OP_EQUAL: '87',
  OP_EQUALVERIFY: '88',
  OP_RESERVED1: '89',
  OP_RESERVED2: '8a',

  OP_1ADD: '8b',
  OP_1SUB: '8c',
  OP_2MUL: '8d',
  OP_2DIV: '8e',
  OP_NEGATE: '8f',
  OP_ABS: '90',
  OP_NOT: '91',
  OP_0NOTEQUAL: '92',
  OP_ADD: '93',
  OP_SUB: '94',
  OP_MUL: '95',
  OP_DIV: '96',
  OP_MOD: '97',
  OP_LSHIFT: '98',
  OP_RSHIFT: '99',
  OP_BOOLAND: '9a',
  OP_BOOLOR: '9b',
  OP_NUMEQUAL: '9c',
  OP_NUMEQUALVERIFY: '9d',
  OP_NUMNOTEQUAL: '9e',
  OP_LESSTHAN: '9f',
  OP_GREATERTHAN: 'a0',
  OP_LESSTHANOREQUAL: 'a1',
  OP_GREATERTHANOREQUAL: 'a2',
  OP_MIN: 'a3',
  OP_MAX: 'a4',
  OP_WITHIN: 'a5',

  OP_RIPEMD160: 'a6',
  OP_SHA1: 'a7',
  OP_SHA256: 'a8',
  OP_HASH160: 'a9',
  OP_HASH256: 'aa',
  OP_CODESEPARATOR: 'ab',
  OP_CHECKSIG: 'ac',
  OP_CHECKSIGVERIFY: 'ad',
  OP_CHECKMULTISIG: 'ae',
  OP_CHECKMULTISIGVERIFY: 'af',

  OP_NOP1: 'b0',
  OP_CHECKLOCKTIMEVERIFY: 'b1',
  OP_CHECKSEQUENCEVERIFY: 'b2',
  OP_NOP4: 'b3',
  OP_NOP5: 'b4',
  OP_NOP6: 'b5',
  OP_NOP7: 'b6',
  OP_NOP8: 'b7',
  OP_NOP9: 'b8',
  OP_NOP10: 'b9',
  OP_CHECKSIGADD: 'ba',
  OP_RETURN_187: 'bb',
  OP_RETURN_188: 'bc',
  OP_RETURN_189: 'bd',
  OP_RETURN_190: 'be',
  OP_RETURN_191: 'bf',
  OP_RETURN_192: 'c0',
  OP_RETURN_193: 'c1',
  OP_RETURN_194: 'c2',
  OP_RETURN_195: 'c3',
  OP_RETURN_196: 'c4',
  OP_RETURN_197: 'c5',
  OP_RETURN_198: 'c6',
  OP_RETURN_199: 'c7',
  OP_RETURN_200: 'c8',
  OP_RETURN_201: 'c9',
  OP_RETURN_202: 'ca',
  OP_RETURN_203: 'cb',
  OP_RETURN_204: 'cc',
  OP_RETURN_205: 'cd',
  OP_RETURN_206: 'ce',
  OP_RETURN_207: 'cf',
  OP_RETURN_208: 'd0',
  OP_RETURN_209: 'd1',
  OP_RETURN_210: 'd2',
  OP_RETURN_211: 'd3',
  OP_RETURN_212: 'd4',
  OP_RETURN_213: 'd5',
  OP_RETURN_214: 'd6',
  OP_RETURN_215: 'd7',
  OP_RETURN_216: 'd8',
  OP_RETURN_217: 'd9',
  OP_RETURN_218: 'da',
  OP_RETURN_219: 'db',
  OP_RETURN_220: 'dc',
  OP_RETURN_221: 'dd',
  OP_RETURN_222: 'de',
  OP_RETURN_223: 'df',
  OP_RETURN_224: 'e0',
  OP_RETURN_225: 'e1',
  OP_RETURN_226: 'e2',
  OP_RETURN_227: 'e3',
  OP_RETURN_228: 'e4',
  OP_RETURN_229: 'e5',
  OP_RETURN_230: 'e6',
  OP_RETURN_231: 'e7',
  OP_RETURN_232: 'e8',
  OP_RETURN_233: 'e9',
  OP_RETURN_234: 'ea',
  OP_RETURN_235: 'eb',
  OP_RETURN_236: 'ec',
  OP_RETURN_237: 'ed',
  OP_RETURN_238: 'ee',
  OP_RETURN_239: 'ef',
  OP_RETURN_240: 'f0',
  OP_RETURN_241: 'f1',
  OP_RETURN_242: 'f2',
  OP_RETURN_243: 'f3',
  OP_RETURN_244: 'f4',
  OP_RETURN_245: 'f5',
  OP_RETURN_246: 'f6',
  OP_RETURN_247: 'f7',
  OP_RETURN_248: 'f8',
  OP_RETURN_249: 'f9',
  OP_RETURN_250: 'fa',
  OP_RETURN_251: 'fb',
  OP_RETURN_252: 'fc',
  OP_RETURN_253: 'fd',
  OP_RETURN_254: 'fe',
  OP_INVALIDOPCODE: 'ff'
} as const

export type Opcode = keyof typeof opcodes
export type OpcodeByte = (typeof opcodes)[keyof typeof opcodes]

export const opcodeGroups: Array<{
  title: string
  opcodes: Array<Opcode>
}> = [
  {
    title: '入栈',
    opcodes: [
      'OP_0',
      'OP_PUSHBYTES_1',
      'OP_PUSHBYTES_2',
      'OP_PUSHBYTES_3',
      'OP_PUSHBYTES_4',
      'OP_PUSHBYTES_5',
      'OP_PUSHBYTES_6',
      'OP_PUSHBYTES_7',
      'OP_PUSHBYTES_8',
      'OP_PUSHBYTES_9',
      'OP_PUSHBYTES_10',
      'OP_PUSHBYTES_11',
      'OP_PUSHBYTES_12',
      'OP_PUSHBYTES_13',
      'OP_PUSHBYTES_14',
      'OP_PUSHBYTES_15',
      'OP_PUSHBYTES_16',
      'OP_PUSHBYTES_17',
      'OP_PUSHBYTES_18',
      'OP_PUSHBYTES_19',
      'OP_PUSHBYTES_20',
      'OP_PUSHBYTES_21',
      'OP_PUSHBYTES_22',
      'OP_PUSHBYTES_23',
      'OP_PUSHBYTES_24',
      'OP_PUSHBYTES_25',
      'OP_PUSHBYTES_26',
      'OP_PUSHBYTES_27',
      'OP_PUSHBYTES_28',
      'OP_PUSHBYTES_29',
      'OP_PUSHBYTES_30',
      'OP_PUSHBYTES_31',
      'OP_PUSHBYTES_32',
      'OP_PUSHBYTES_33',
      'OP_PUSHBYTES_34',
      'OP_PUSHBYTES_35',
      'OP_PUSHBYTES_36',
      'OP_PUSHBYTES_37',
      'OP_PUSHBYTES_38',
      'OP_PUSHBYTES_39',
      'OP_PUSHBYTES_40',
      'OP_PUSHBYTES_41',
      'OP_PUSHBYTES_42',
      'OP_PUSHBYTES_43',
      'OP_PUSHBYTES_44',
      'OP_PUSHBYTES_45',
      'OP_PUSHBYTES_46',
      'OP_PUSHBYTES_47',
      'OP_PUSHBYTES_48',
      'OP_PUSHBYTES_49',
      'OP_PUSHBYTES_50',
      'OP_PUSHBYTES_51',
      'OP_PUSHBYTES_52',
      'OP_PUSHBYTES_53',
      'OP_PUSHBYTES_54',
      'OP_PUSHBYTES_55',
      'OP_PUSHBYTES_56',
      'OP_PUSHBYTES_57',
      'OP_PUSHBYTES_58',
      'OP_PUSHBYTES_59',
      'OP_PUSHBYTES_60',
      'OP_PUSHBYTES_61',
      'OP_PUSHBYTES_62',
      'OP_PUSHBYTES_63',
      'OP_PUSHBYTES_64',
      'OP_PUSHBYTES_65',
      'OP_PUSHBYTES_66',
      'OP_PUSHBYTES_67',
      'OP_PUSHBYTES_68',
      'OP_PUSHBYTES_69',
      'OP_PUSHBYTES_70',
      'OP_PUSHBYTES_71',
      'OP_PUSHBYTES_72',
      'OP_PUSHBYTES_73',
      'OP_PUSHBYTES_74',
      'OP_PUSHBYTES_75',
      'OP_PUSHDATA1',
      'OP_PUSHDATA2',
      'OP_PUSHDATA4',
      'OP_1NEGATE',
      'OP_RESERVED',
      'OP_1',
      'OP_2',
      'OP_3',
      'OP_4',
      'OP_5',
      'OP_6',
      'OP_7',
      'OP_8',
      'OP_9',
      'OP_10',
      'OP_11',
      'OP_12',
      'OP_13',
      'OP_14',
      'OP_15',
      'OP_16'
    ]
  },
  {
    title: '流程控制',
    opcodes: [
      'OP_NOP',
      'OP_VER',
      'OP_IF',
      'OP_NOTIF',
      'OP_VERIF',
      'OP_VERNOTIF',
      'OP_ELSE',
      'OP_ENDIF',
      'OP_VERIFY',
      'OP_RETURN'
    ]
  },
  {
    title: '栈操作',
    opcodes: [
      'OP_TOALTSTACK',
      'OP_FROMALTSTACK',
      'OP_2DROP',
      'OP_2DUP',
      'OP_3DUP',
      'OP_2OVER',
      'OP_2ROT',
      'OP_2SWAP',
      'OP_IFDUP',
      'OP_DEPTH',
      'OP_DROP',
      'OP_DUP',
      'OP_NIP',
      'OP_OVER',
      'OP_PICK',
      'OP_ROLL',
      'OP_ROT',
      'OP_SWAP',
      'OP_TUCK'
    ]
  },
  {
    title: '字符串',
    opcodes: ['OP_CAT', 'OP_SUBSTR', 'OP_LEFT', 'OP_RIGHT', 'OP_SIZE']
  },
  {
    title: '位运算',
    opcodes: [
      'OP_INVERT',
      'OP_AND',
      'OP_OR',
      'OP_XOR',
      'OP_EQUAL',
      'OP_EQUALVERIFY',
      'OP_RESERVED1',
      'OP_RESERVED2'
    ]
  },
  {
    title: '数学',
    opcodes: [
      'OP_1ADD',
      'OP_1SUB',
      'OP_2MUL',
      'OP_2DIV',
      'OP_NEGATE',
      'OP_ABS',
      'OP_NOT',
      'OP_0NOTEQUAL',
      'OP_ADD',
      'OP_SUB',
      'OP_MUL',
      'OP_DIV',
      'OP_MOD',
      'OP_LSHIFT',
      'OP_RSHIFT',
      'OP_BOOLAND',
      'OP_BOOLOR',
      'OP_NUMEQUAL',
      'OP_NUMEQUALVERIFY',
      'OP_NUMNOTEQUAL',
      'OP_LESSTHAN',
      'OP_GREATERTHAN',
      'OP_LESSTHANOREQUAL',
      'OP_GREATERTHANOREQUAL',
      'OP_MIN',
      'OP_MAX',
      'OP_WITHIN'
    ]
  },
  {
    title: '密码学',
    opcodes: [
      'OP_RIPEMD160',
      'OP_SHA1',
      'OP_SHA256',
      'OP_HASH160',
      'OP_HASH256',
      'OP_CODESEPARATOR',
      'OP_CHECKSIG',
      'OP_CHECKSIGVERIFY',
      'OP_CHECKMULTISIG',
      'OP_CHECKMULTISIGVERIFY'
    ]
  },
  {
    title: '其他',
    opcodes: [
      'OP_NOP1',
      'OP_CHECKLOCKTIMEVERIFY',
      'OP_CHECKSEQUENCEVERIFY',
      'OP_NOP4',
      'OP_NOP5',
      'OP_NOP6',
      'OP_NOP7',
      'OP_NOP8',
      'OP_NOP9',
      'OP_NOP10',
      'OP_CHECKSIGADD',
      'OP_RETURN_187',
      'OP_RETURN_188',
      'OP_RETURN_189',
      'OP_RETURN_190',
      'OP_RETURN_191',
      'OP_RETURN_192',
      'OP_RETURN_193',
      'OP_RETURN_194',
      'OP_RETURN_195',
      'OP_RETURN_196',
      'OP_RETURN_197',
      'OP_RETURN_198',
      'OP_RETURN_199',
      'OP_RETURN_200',
      'OP_RETURN_201',
      'OP_RETURN_202',
      'OP_RETURN_203',
      'OP_RETURN_204',
      'OP_RETURN_205',
      'OP_RETURN_206',
      'OP_RETURN_207',
      'OP_RETURN_208',
      'OP_RETURN_209',
      'OP_RETURN_210',
      'OP_RETURN_211',
      'OP_RETURN_212',
      'OP_RETURN_213',
      'OP_RETURN_214',
      'OP_RETURN_215',
      'OP_RETURN_216',
      'OP_RETURN_217',
      'OP_RETURN_218',
      'OP_RETURN_219',
      'OP_RETURN_220',
      'OP_RETURN_221',
      'OP_RETURN_222',
      'OP_RETURN_223',
      'OP_RETURN_224',
      'OP_RETURN_225',
      'OP_RETURN_226',
      'OP_RETURN_227',
      'OP_RETURN_228',
      'OP_RETURN_229',
      'OP_RETURN_230',
      'OP_RETURN_231',
      'OP_RETURN_232',
      'OP_RETURN_233',
      'OP_RETURN_234',
      'OP_RETURN_235',
      'OP_RETURN_236',
      'OP_RETURN_237',
      'OP_RETURN_238',
      'OP_RETURN_239',
      'OP_RETURN_240',
      'OP_RETURN_241',
      'OP_RETURN_242',
      'OP_RETURN_243',
      'OP_RETURN_244',
      'OP_RETURN_245',
      'OP_RETURN_246',
      'OP_RETURN_247',
      'OP_RETURN_248',
      'OP_RETURN_249',
      'OP_RETURN_250',
      'OP_RETURN_251',
      'OP_RETURN_252',
      'OP_RETURN_253',
      'OP_RETURN_254',
      'OP_INVALIDOPCODE'
    ]
  }
]

export const disabledOpcodes: Array<Opcode> = [
  'OP_CAT',
  'OP_SUBSTR',
  'OP_LEFT',
  'OP_RIGHT',
  'OP_INVERT',
  'OP_RESERVED',
  'OP_VER',
  'OP_VERIF',
  'OP_VERNOTIF',
  'OP_RESERVED1',
  'OP_RESERVED2',
  'OP_NOP1',
  'OP_NOP4',
  'OP_NOP5',
  'OP_NOP6',
  'OP_NOP7',
  'OP_NOP8',
  'OP_NOP9',
  'OP_NOP10',
  'OP_AND',
  'OP_OR',
  'OP_XOR',
  'OP_2MUL',
  'OP_2DIV',
  'OP_MUL',
  'OP_DIV',
  'OP_MOD',
  'OP_LSHIFT',
  'OP_RSHIFT'
]

export const isOpcode = (name: string): name is Opcode => {
  return name.startsWith('OP_')
}
