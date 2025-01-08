export const hashPassword = async (password: string) => {
    // Encrypt password using SHA-512 algorithm
    // Returning a base64 string from buffer(binary)
    const arrayBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password))
    return Buffer.from(arrayBuffer).toString("base64")
}