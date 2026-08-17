import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import sharp from 'sharp'
import { AppError } from '../../errors/app-error.js'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile, rm } from 'node:fs/promises'

const AVATAR_SIZE = 256
const MAX_INPUT_PIXELS = 4096 * 4096

const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'webp'])

const AVATAR_URL_PREFIX = '/api/avatar/'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function avatarUrl(key: string): string {
  return `${AVATAR_URL_PREFIX}${key}`
}

export function avatarKeyFromUrl(url: string | null): string | null {
  if (url === null || !url.startsWith(AVATAR_URL_PREFIX)) {
    return null
  }

  const key = url.slice(AVATAR_URL_PREFIX.length)

  return UUID_PATTERN.test(key) ? key : null
}

export async function readAvatar(avatarKey: string, avatarDir: string): Promise<Uint8Array | null> {
  try {
    return await readFile(join(avatarDir, `${avatarKey}.webp`))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null
    }

    throw error
  }
}

export async function processAvatar(input: Uint8Array): Promise<Buffer> {
  try {
    const image = sharp(input, {
      limitInputPixels: MAX_INPUT_PIXELS,
      animated: false,
    })

    const metadata = await image.metadata()

    if (metadata.format == undefined || !ALLOWED_FORMATS.has(metadata.format)) {
      throw new AppError('UNSUPPORTED_AVATAR_TYPE', 415, 'Unsupported avatar image type')
    }

    return await image
      .autoOrient()
      .resize(AVATAR_SIZE, AVATAR_SIZE, {
        fit: 'cover',
      })
      .webp({
        quality: 80,
      })
      .toBuffer()
  } catch (err) {
    if (err instanceof AppError) {
      throw err
    }

    throw new AppError('INVALID_AVATAR', 400, 'Invalid image')
  }
}

export async function storeAvatar(input: Uint8Array, avatarDir: string): Promise<string> {
  const output = await processAvatar(input)

  const key = randomUUID()

  await mkdir(avatarDir, {
    recursive: true,
  })

  await writeFile(join(avatarDir, `${key}.webp`), output, {
    flag: 'wx',
  })

  return key
}

export async function removeAvatar(key: string, avatarDir: string): Promise<void> {
  await rm(join(avatarDir, `${key}.webp`), {
    force: true,
  })
}
