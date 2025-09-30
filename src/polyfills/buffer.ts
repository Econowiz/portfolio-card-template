/* eslint-disable @typescript-eslint/no-explicit-any */
const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : undefined
const textDecoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : undefined

type BufferEncoding = 'utf8' | 'utf-8' | 'base64' | 'latin1' | 'binary'

type GlobalWithBuffer = typeof globalThis & { Buffer?: any }
const globalScope = globalThis as GlobalWithBuffer

const encodeUtf8 = (input: string): Uint8Array => {
  if (textEncoder) {
    return textEncoder.encode(input)
  }

  const result = new Uint8Array(input.length)
  for (let i = 0; i < input.length; i += 1) {
    result[i] = input.charCodeAt(i) & 0xff
  }
  return result
}

const decodeUtf8 = (bytes: Uint8Array): string => {
  if (textDecoder) {
    return textDecoder.decode(bytes)
  }

  let result = ''
  for (let i = 0; i < bytes.length; i += 1) {
    result += String.fromCharCode(bytes[i])
  }
  return result
}

const decodeBase64 = (input: string): Uint8Array => {
  if (typeof atob === 'function') {
    const normalized = input.replace(/\s+/g, '')
    const binary = atob(normalized)
    const length = binary.length
    const bytes = new Uint8Array(length)
    for (let i = 0; i < length; i += 1) {
      bytes[i] = binary.charCodeAt(i) & 0xff
    }
    return bytes
  }

  if (typeof (globalScope.Buffer) === 'function') {
    const nodeBuffer = globalScope.Buffer.from(input, 'base64') as { buffer: ArrayBuffer; byteOffset: number; byteLength: number }
    return new Uint8Array(nodeBuffer.buffer.slice(nodeBuffer.byteOffset, nodeBuffer.byteOffset + nodeBuffer.byteLength))
  }

  throw new Error('Base64 decoding not supported in this environment')
}

const encodeBase64 = (bytes: Uint8Array): string => {
  if (typeof btoa === 'function') {
    let binary = ''
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  if (typeof (globalScope.Buffer) === 'function') {
    return globalScope.Buffer.from(bytes).toString('base64')
  }

  throw new Error('Base64 encoding not supported in this environment')
}

const createPolyfill = (): any => {
  class BufferPolyfill extends Uint8Array {
    constructor(input: ArrayBuffer | ArrayLike<number> | string | number, encoding: BufferEncoding = 'utf8') {
      if (typeof input === 'number') {
        super(input)
        return
      }

      if (typeof input === 'string') {
        const source = encoding === 'base64' ? decodeBase64(input) : encodeUtf8(input)
        super(source.length)
        this.set(source, 0)
        return
      }

      if (input instanceof ArrayBuffer) {
        const source = new Uint8Array(input)
        super(source.length)
        this.set(source, 0)
        return
      }

      if (ArrayBuffer.isView(input)) {
        const view = input as ArrayBufferView
        const source = new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
        super(source.length)
        this.set(source, 0)
        return
      }

      const source = new Uint8Array(Array.from(input))
      super(source.length)
      this.set(source, 0)
    }

    static from(input: string, encoding?: BufferEncoding): BufferPolyfill
    static from(arrayBuffer: ArrayBufferLike, byteOffset?: number, length?: number): BufferPolyfill
    static from(arrayLike: ArrayLike<number>): BufferPolyfill
    static from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): BufferPolyfill
    static from(elements: Iterable<number>): BufferPolyfill
    static from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): BufferPolyfill
    static from(
      input: string | ArrayBufferLike | ArrayLike<number> | Iterable<number>,
      arg1?: BufferEncoding | number | ((v: any, k: number) => number),
      arg2?: number | ((v: any, k: number) => number),
      arg3?: unknown
    ): BufferPolyfill {
      if (typeof input === 'string') {
        return new BufferPolyfill(input, (arg1 as BufferEncoding) ?? 'utf8')
      }

      if (input instanceof ArrayBuffer) {
        const byteOffset = typeof arg1 === 'number' ? arg1 : 0
        const length = typeof arg2 === 'number' ? arg2 : undefined
        const view = length === undefined ? new Uint8Array(input, byteOffset) : new Uint8Array(input, byteOffset, length)
        return new BufferPolyfill(view)
      }

      if (ArrayBuffer.isView(input)) {
        const view = input as ArrayBufferView
        const typed = new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
        return new BufferPolyfill(typed)
      }

      if (typeof arg1 === 'function') {
        return super.from(input as ArrayLike<number>, arg1, arg2) as BufferPolyfill
      }

      if (typeof arg2 === 'function') {
        return super.from(input as Iterable<number>, arg2, arg3) as BufferPolyfill
      }

      if (Symbol.iterator in Object(input)) {
        return super.from(input as Iterable<number>) as BufferPolyfill
      }

      return super.from(input as ArrayLike<number>) as BufferPolyfill
    }

    static isBuffer(value: unknown): boolean {
      return value instanceof BufferPolyfill
    }

    static alloc(size: number, fill?: number | string, encoding: BufferEncoding = 'utf8'): BufferPolyfill {
      const buffer = new BufferPolyfill(size)
      if (fill === undefined) {
        buffer.fill(0)
        return buffer
      }

      if (typeof fill === 'string') {
        const source = new BufferPolyfill(fill, encoding)
        for (let i = 0; i < size; i += 1) {
          buffer[i] = source[i % source.length]
        }
        return buffer
      }

      buffer.fill(fill)
      return buffer
    }

    static allocUnsafe(size: number): BufferPolyfill {
      return new BufferPolyfill(size)
    }

    static allocUnsafeSlow(size: number): BufferPolyfill {
      return new BufferPolyfill(size)
    }

    static byteLength(input: string | ArrayBuffer | ArrayBufferView, encoding: BufferEncoding = 'utf8'): number {
      if (typeof input === 'string') {
        if (encoding === 'base64') {
          return decodeBase64(input).length
        }
        return encodeUtf8(input).length
      }

      if (input instanceof ArrayBuffer) {
        return input.byteLength
      }

      if (ArrayBuffer.isView(input)) {
        return input.byteLength
      }

      return 0
    }

    static concat(list: ArrayLike<Uint8Array>, totalLength?: number): BufferPolyfill {
      const buffers = Array.from(list)
      if (buffers.length === 0) {
        return new BufferPolyfill(0)
      }

      const length = totalLength ?? buffers.reduce((sum, item) => sum + item.length, 0)
      const result = new BufferPolyfill(length)
      let offset = 0
      buffers.forEach((item) => {
        result.set(item, offset)
        offset += item.length
      })
      return result
    }

    static compare(a: Uint8Array, b: Uint8Array): number {
      const length = Math.min(a.length, b.length)
      for (let i = 0; i < length; i += 1) {
        if (a[i] !== b[i]) return a[i] - b[i]
      }
      return a.length - b.length
    }

    toString(encoding: BufferEncoding = 'utf8'): string {
      if (encoding === 'base64') {
        return encodeBase64(this)
      }
      if (encoding === 'utf8' || encoding === 'utf-8') {
        return decodeUtf8(this)
      }
      if (encoding === 'latin1' || encoding === 'binary') {
        let result = ''
        for (let i = 0; i < this.length; i += 1) {
          result += String.fromCharCode(this[i])
        }
        return result
      }

      throw new Error(`Unsupported encoding: ${encoding}`)
    }
  }

  return BufferPolyfill as any
}

const BufferImpl: any = globalScope.Buffer ?? createPolyfill()

if (!globalScope.Buffer) {
  globalScope.Buffer = BufferImpl
}

export default { Buffer: BufferImpl }
export const Buffer = BufferImpl
