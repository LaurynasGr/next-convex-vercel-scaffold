/** Hands the browser a file to save: a blob URL behind a click on a throwaway link. */
export function downloadFile({ fileName, bytes, type }: DownloadFileParams) {
    const url = URL.createObjectURL(new Blob([bytes], { type }))
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    // Revoked on the next tick: the click has started the download by then, but not necessarily read the blob yet.
    setTimeout(() => URL.revokeObjectURL(url), 0)
}

interface DownloadFileParams {
    fileName: string
    bytes: ArrayBuffer
    /** The MIME type ('application/pdf'). */
    type: string
}
