import { exportJWK, exportPKCS8, generateKeyPair } from 'jose'

const keys = await generateKeyPair('RS256', {
    extractable: true,
})
const privateKey = await exportPKCS8(keys.privateKey)
const publicKey = await exportJWK(keys.publicKey)
const jwks = JSON.stringify({ keys: [{ use: 'sig', ...publicKey }] })

const ask = (label: string): string => (prompt(`${label} (optional, Enter to skip):`) ?? '').trim()

const defaultSiteUrl = 'http://localhost:3100'
const siteUrl = (prompt('SITE_URL:', defaultSiteUrl) ?? '').trim() || defaultSiteUrl
const googleId = ask('AUTH_GOOGLE_ID')
const googleSecret = ask('AUTH_GOOGLE_SECRET')

const lines: string[] = [`JWT_PRIVATE_KEY="${privateKey.trimEnd().replace(/\n/g, ' ')}"`, `JWKS=${jwks}`]
lines.push(`SITE_URL=${siteUrl}`)
if (googleId) lines.push(`AUTH_GOOGLE_ID=${googleId}`)
if (googleSecret) lines.push(`AUTH_GOOGLE_SECRET=${googleSecret}`)

const output = `${lines.join('\n')}\n`

process.stdout.write('\n')
process.stdout.write(output)

const clipboardCommand: [string, ...string[]] | null =
    process.platform === 'darwin'
        ? ['pbcopy']
        : process.platform === 'linux'
          ? ['xclip', '-selection', 'clipboard']
          : null

if (clipboardCommand && Bun.which(clipboardCommand[0])) {
    const copy = Bun.spawn(clipboardCommand, { stdin: 'pipe', stdout: 'ignore', stderr: 'ignore' })
    copy.stdin.write(output)
    copy.stdin.end()
    const exitCode = await copy.exited
    process.stderr.write(exitCode === 0 ? '\nCopied to clipboard.\n' : '\nCould not copy to clipboard.\n')
}
