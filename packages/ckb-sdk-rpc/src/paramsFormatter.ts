declare module CkbRPC {
  export module Params {
    export interface Transaction {
      hash: CKBComponents.Hash256
      version: CKBComponents.Version
      deps: CKBComponents.Hash[]
      inputs: any

      outputs: { lock: CKBComponents.Script; data: string; capacity: CKBComponents.Capacity }[]
    }
  }
}

const formatters = {
  toHash: (hash: any, length?: number): CKBComponents.Hash => {
    if (typeof hash !== 'string') {
      throw new Error('Hash String Required')
    }
    if (length !== undefined && hash.length !== length) {
      throw new Error('Hash of wrong length')
    }
    return hash
  },
  toOutPoint: (outPoint: any): CKBComponents.OutPoint => {
    if (typeof outPoint !== 'object') {
      throw new Error('Invalid OutPoint')
    }
    if (!outPoint.hash) {
      throw new Error('Invalid Hash in OutPoint')
    }
    if (outPoint.index === undefined) {
      throw new Error('Invalid Index in OutPoint')
    }
    return {
      hash: outPoint.hash,
      index: outPoint.index,
    }
  },
  toNumber: (number: string | number): number => +number,
  toTx: ({ hash = '', version = 0, deps = [], inputs = [], outputs = [] }): CkbRPC.Params.Transaction => {
    const fmtInputs = inputs.map(({ previousOutput, args, since }: CKBComponents.CellInput) => ({
      previous_output: previousOutput,
      args,
      since,
    }))
    const fmtOutputs = outputs.map(({ capacity, data, lock }: CKBComponents.CellOutput) => ({
      capacity,
      data,
      lock: {
        code_hash: lock.codeHash || [],
        args: lock.args || [],
      },
    }))
    const tx = {
      hash,
      version,
      deps,
      inputs: fmtInputs,
      outputs: fmtOutputs,
    }
    return tx
  },
}
export default formatters
