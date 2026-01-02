/**
 * Stub for server actions in extension context
 * Server actions are not available in browser
 */

export const clearChats = async () => {
  console.warn('clearChats: Server actions are not available in extension context')
  return { error: 'Server actions are not available in extension context' }
}

export const getChatsPage = async () => {
  console.warn('getChatsPage: Server actions are not available in extension context')
  return { chats: [], nextOffset: null }
}

export const getChat = async () => {
  console.warn('getChat: Server actions are not available in extension context')
  return null
}

export const deleteChat = async () => {
  console.warn('deleteChat: Server actions are not available in extension context')
  return { success: false, error: 'Not available in extension' }
}

