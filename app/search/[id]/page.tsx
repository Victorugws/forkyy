import { Chat } from '@/components/chat'
import { getChat } from '@/lib/actions/chat'
import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { getModels } from '@/lib/config/models'
import { convertToUIMessages } from '@/lib/utils'
import { notFound, redirect } from 'next/navigation'
import { ExtendedCoreMessage, SearchResults } from '@/lib/types'

export const maxDuration = 60

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const enableSaveChatHistory = process.env.ENABLE_SAVE_CHAT_HISTORY === 'true'

  // If chat history is disabled, return basic metadata
  if (!enableSaveChatHistory) {
    return { title: 'Search' }
  }

  const { id } = await props.params;
  const userId = await getCurrentUserId();
  const chat = await getChat(id, userId || 'anonymous');

  let metadata: { title: string; openGraph?: { images?: { url: string; width?: number; height?: number }[] } } = {
    title: chat?.title?.toString().slice(0, 50) || 'Search',
  };

  if (chat && chat.messages) {
    const dataMessage = chat.messages.find(
      (msg: ExtendedCoreMessage) => msg.role === 'data'
    );

    if (dataMessage && dataMessage.content) {
      const searchData = dataMessage.content as SearchResults;
      if (searchData.images && searchData.images.length > 0) {
        const firstImage = searchData.images[0];
        let imageUrl: string | undefined = undefined;

        if (typeof firstImage === 'string') {
          imageUrl = firstImage;
        } else if (typeof firstImage === 'object' && firstImage.url) {
          imageUrl = firstImage.url;
        }

        if (imageUrl) {
          metadata.openGraph = {
            images: [{ url: imageUrl, width: 1200, height: 630 }],
          };
        }
      }
    }
  }
  return metadata;
}

export default async function SearchPage(props: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const enableSaveChatHistory = process.env.ENABLE_SAVE_CHAT_HISTORY === 'true'
  const userId = await getCurrentUserId()
  const { id } = await props.params
  const { q } = await props.searchParams

  // If chat history is disabled, still allow new chats with query parameter
  if (!enableSaveChatHistory && !q) {
    redirect('/')
  }

  const chat = await getChat(id, userId)
  const messages = convertToUIMessages(chat?.messages || [])

  // If no existing chat and no query, redirect to home
  if (!chat && !q) {
    redirect('/')
  }

  // If chat exists but user doesn't have permission, show not found
  if (chat && chat?.userId !== userId && chat?.userId !== 'anonymous') {
    notFound()
  }

  const models = await getModels()
  return <Chat id={id} savedMessages={messages} query={q} models={models} />
}
