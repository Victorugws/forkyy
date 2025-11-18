# AI Browser Feature

## Overview

The AI Browser is a new feature that provides a web browser with integrated AI assistance, similar to Perplexity's browser. Users can browse the web and interact with an AI assistant that can analyze, summarize, and answer questions about the pages they're viewing.

## Features

### 1. Web Browsing
- **URL Navigation**: Enter any URL or search term in the address bar
- **Browser Controls**: Back, forward, refresh, and home buttons
- **Navigation History**: Track browsing history with back/forward functionality
- **Auto-Protocol**: Automatically adds `https://` to URLs or searches Google if input isn't a URL

### 2. AI Assistant Panel
- **Context-Aware**: AI has access to the current page's URL, title, and content
- **Quick Actions**:
  - **Summarize**: Get a quick summary of the current page
  - **Key Points**: Extract the main points from the page
  - **Explain**: Get an explanation of the main concepts on the page
- **Chat Interface**: Ask custom questions about the page content

### 3. Split-View Layout
- Resizable panels with a draggable handle
- Web content on the left (default 60% width)
- AI assistant on the right (default 40% width)
- Minimum panel sizes prevent UI breaking

## File Structure

```
app/browse/
  └── page.tsx                          # Browser page route

components/browser/
  ├── browser-client.tsx                # Main browser component with state management
  ├── browser-bar.tsx                   # URL bar and navigation controls
  ├── browser-view.tsx                  # Web content iframe viewer
  └── browser-chat.tsx                  # AI chat assistant panel

app/api/browser/
  └── fetch-page/
      └── route.ts                      # API endpoint for fetching page content
```

## Components

### BrowserClient
Main component that orchestrates the browser functionality. Manages state for:
- Current URL
- Page title
- Navigation state (can go back/forward)
- Loading state
- Page content for AI analysis

### BrowserBar
Address bar component with:
- URL input field
- Navigation controls (back, forward, refresh, home)
- Loading indicators
- Smart URL handling (auto-protocol, search fallback)

### BrowserView
Web content viewer that:
- Displays pages in an iframe with security sandbox
- Maintains navigation history
- Handles cross-origin restrictions
- Falls back to API-based content fetching for restricted pages
- Shows helpful error messages for pages that can't be embedded

### BrowserChat
AI assistant panel featuring:
- Quick action buttons for common tasks
- Chat interface for custom questions
- Context-aware responses based on current page
- Loading states and error handling

## API Endpoints

### `/api/browser/fetch-page`
**Method**: POST

**Request Body**:
```json
{
  "url": "https://example.com"
}
```

**Response**:
```json
{
  "title": "Page Title",
  "content": "Extracted text content...",
  "url": "https://example.com"
}
```

**Purpose**: Fetches and extracts content from web pages when cross-origin restrictions prevent iframe access.

## Usage

1. Navigate to `/browse` in the application
2. Enter a URL or search term in the address bar
3. Browse the web using standard browser controls
4. Use quick action buttons or ask custom questions in the AI panel
5. Resize panels as needed using the draggable handle

## Technical Details

### Cross-Origin Handling
Many websites use X-Frame-Options headers to prevent embedding. When this occurs:
1. The iframe shows an error state
2. The API endpoint fetches the page content server-side
3. Content is extracted and passed to the AI for analysis
4. Users can still interact with AI even if the page doesn't display

### Security
- Iframe uses sandbox mode with specific permissions
- API endpoint validates URLs before fetching
- Content size limits prevent memory issues
- User-Agent headers identify the browser appropriately

### Performance
- Content extraction limits text to 15KB to optimize AI processing
- Throttled updates prevent excessive re-renders
- Lazy loading of components

## Future Enhancements

- [ ] Bookmark management
- [ ] Browse history persistence
- [ ] Tab management (multiple pages)
- [ ] Screenshot capture
- [ ] PDF viewer integration
- [ ] Download manager
- [ ] Advanced content extraction (tables, images, etc.)
- [ ] Browser session saving/restoring
- [ ] Privacy mode
- [ ] Ad blocking

## Known Limitations

1. **Cross-Origin Restrictions**: Some websites cannot be embedded due to security policies
2. **AI SDK Compatibility**: Current version has compatibility issues with @ai-sdk/react that need resolution
3. **No Cookie Persistence**: Browser sessions don't persist cookies between navigations
4. **Limited JavaScript**: Iframe sandbox restricts some JavaScript functionality for security

## Integration

The browser is integrated into the main application via:
- Sidebar navigation item with Globe icon
- Route: `/browse`
- Full-screen layout within the application shell
- Consistent with existing UI patterns and styling
