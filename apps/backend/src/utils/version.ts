import { readFileSync } from 'fs'
import path from 'path'

let cachedVersion: string = ''

export function getApiVersion(): string {
  if (cachedVersion) {
    return cachedVersion
  }

  try {
    const packageJson = JSON.parse(
      readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')
    )
    cachedVersion = packageJson.version || '0.0.0'
    return cachedVersion
  } catch {
    cachedVersion = '0.0.0'
    return cachedVersion
  }
}

