# Option 3: Hybrid TOR Integration - Detailed Breakdown

## What Option 3 Entails

Option 3 is a **hybrid approach** where TOR becomes an **optional feature** that users can enable/disable per-tab or globally. This allows users to choose when to use anonymous browsing while keeping normal browsing available.

---

## Technical Implementation Details

### Architecture Changes

```
┌─────────────────────────────────────────────────┐
│          Electron Main Process                  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │   TOR Manager Service                     │  │
│  │   - Start/stop TOR daemon                 │  │
│  │   - Monitor circuit status                │  │
│  │   - Handle TOR errors                     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │   Session Manager                         │  │
│  │   - Default session (no TOR)              │  │
│  │   - TOR session (socks5://127.0.0.1:9050) │  │
│  │   - Per-tab session assignment            │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
         │                    │
         │                    │
    ┌────▼────┐          ┌────▼────┐
    │  Tab 1  │          │  Tab 2  │
    │ (Normal)│          │  (TOR)  │
    │ Session │          │ Session │
    └─────────┘          └─────────┘
```

### 1. TOR Manager Service

**File: `electron/tor-manager.ts`** (New file)

This service handles:
- Starting/stopping TOR daemon process
- Monitoring TOR circuit status
- Handling TOR connection errors
- Managing TOR configuration

```typescript
// Simplified version - full implementation would be more robust
export class TorManager {
  private torProcess: ChildProcess | null = null
  private torDataDir: string
  private isRunning: boolean = false
  private circuitStatus: 'starting' | 'connected' | 'disconnected' | 'error' = 'disconnected'

  async start(): Promise<boolean> {
    // Spawn TOR daemon
    // Wait for circuit to establish
    // Set isRunning = true
  }

  stop() {
    // Kill TOR process
    // Cleanup
  }

  getCircuitStatus(): string {
    // Query TOR control port for circuit status
    return this.circuitStatus
  }

  async requestNewCircuit(): Promise<void> {
    // Send NEWNYM command to TOR control port
  }
}
```

### 2. Per-Tab Session Management

**File: `electron/main.ts`** (Modifications)

Instead of using a single default session, create isolated sessions per tab:

```typescript
// Create sessions
const defaultSession = session.defaultSession // Normal browsing
const torSession = session.fromPartition('tor-partition') // TOR browsing

// Configure TOR session proxy
torSession.setProxy({
  proxyRules: 'socks5://127.0.0.1:9050',
  proxyBypassRules: 'localhost,127.0.0.1,*.local'
})

// Store session mapping per tab
const tabSessions = new Map<string, Session>()
```

**File: `components/browser/WebViewBrowser.tsx`** (Modifications)

Each tab gets assigned a partition:

```typescript
interface Tab {
  id: string
  url: string
  // ... existing fields
  useTor: boolean  // NEW: TOR toggle per tab
}

// When creating webview
<webview
  partition={tab.useTor ? 'tor-partition' : 'persist:main'}
  // ... other props
/>
```

### 3. UI Components

**File: `components/tor/tor-toggle.tsx`** (New)

Toggle button for enabling TOR per tab:

```typescript
export function TorToggle({ tabId, enabled, onToggle }: Props) {
  return (
    <button onClick={() => onToggle(tabId)}>
      {enabled ? '🔒 TOR Enabled' : '🔓 TOR Disabled'}
    </button>
  )
}
```

**File: `components/tor/tor-status-indicator.tsx`** (New)

Visual indicator showing TOR circuit status:

```typescript
export function TorStatusIndicator({ status }: Props) {
  // Show: "Connecting...", "Connected", "Disconnected", "Error"
  // With appropriate colors and icons
}
```

### 4. IPC Communication

**File: `electron/preload.ts`** (Modifications)

Add TOR control methods:

```typescript
contextBridge.exposeInMainWorld('tor', {
  setEnabled: (tabId: string, enabled: boolean): Promise<void> =>
    ipcRenderer.invoke('tor:set-enabled', tabId, enabled),
  
  getStatus: (): Promise<string> =>
    ipcRenderer.invoke('tor:get-status'),
  
  requestNewCircuit: (): Promise<void> =>
    ipcRenderer.invoke('tor:new-circuit'),
  
  onStatusChange: (callback: (status: string) => void) => {
    // Event listener for TOR status changes
  }
})
```

### 5. Build System Updates

**File: `package.json`** (Modifications)

Add scripts to bundle TOR binaries:

```json
{
  "scripts": {
    "electron:build": "npm run build && npm run electron:compile && npm run bundle-tor",
    "bundle-tor": "node scripts/bundle-tor-binaries.js"
  }
}
```

**File: `scripts/bundle-tor-binaries.js`** (New)

Downloads platform-specific TOR binaries for bundling.

---

## What This Means for User Anonymity

### ✅ What TOR DOES Provide

#### 1. **IP Address Anonymity**
- Your real IP address is hidden from websites
- Websites see the IP of a TOR exit node instead
- Your ISP cannot see which websites you're visiting
- **Anonymity Level:** High (if used correctly)

#### 2. **Network-Level Privacy**
- Traffic between you and the TOR network is encrypted
- Your ISP sees encrypted TOR traffic, not destination websites
- Traffic is routed through 3+ relays (entry → middle → exit)
- **Anonymity Level:** Medium-High

#### 3. **Traffic Analysis Resistance**
- Harder for adversaries to correlate traffic patterns
- Circuit isolation (different path per connection)
- **Anonymity Level:** Medium (depending on threat model)

### ❌ What TOR Does NOT Provide

#### 1. **Protection Against Browser Fingerprinting**
- **Still vulnerable:** Browser can be identified by:
  - Canvas fingerprinting
  - WebGL fingerprinting
  - Screen resolution/DPI
  - Installed fonts
  - Timezone
  - Language settings
- **Your Implementation:** Electron webviews use Chromium, which is highly fingerprintable
- **Recommendation:** Would need additional anti-fingerprinting measures

#### 2. **Protection Against JavaScript Tracking**
- **Still vulnerable:** Sites can use:
  - localStorage/sessionStorage
  - Cookies (though cookies are isolated per session)
  - JavaScript-based tracking scripts
  - Browser history analysis (within the session)
- **Your Implementation:** Webviews still execute all page JavaScript normally

#### 3. **Protection Against Behavioral Analysis**
- **Still vulnerable:** Sites can identify you by:
  - Typing patterns
  - Mouse movement patterns
  - Scroll behavior
  - Time spent on pages
  - Click patterns
- **Your Implementation:** Your app already tracks cursor position - this would still be visible to websites

#### 4. **Protection If You Log In**
- **Not anonymous:** Once you log into a website, you're identified
- TOR protects your IP, but not your identity after login
- **Your App:** Users authenticated via Supabase are still identifiable

#### 5. **Protection Against Local Threats**
- **Not protected:**
  - Keyloggers on your computer
  - Malware
  - Screen recording
  - Your app's own logging/debugging
- **Your Implementation:** Electron app logs could potentially expose user activity

#### 6. **Perfect Anonymity**
- **Not guaranteed:** Advanced adversaries (state-level) may be able to:
  - Correlate traffic timing
  - Monitor entry and exit nodes simultaneously
  - Exploit TOR vulnerabilities
  - Use traffic analysis

### ⚠️ Specific Limitations in Your App

#### 1. **Your Next.js App (localhost:3000)**
When users navigate to `http://localhost:3000/search/...`, this traffic:
- **Does NOT go through TOR** (localhost bypass)
- Is completely visible to your app
- Your app can log/search history
- **If users want anonymity from YOUR app:** TOR wouldn't help - you control the server

#### 2. **Supabase Authentication**
- Authentication requests to Supabase would go through TOR if enabled
- But once authenticated, Supabase knows who the user is
- Session tokens/cookies are stored locally
- **Anonymity:** Broken after login

#### 3. **Eye Tracking & Cursor Data**
- Your app tracks cursor position via IPC
- This data stays local to your app
- **However:** If websites use JavaScript to track cursor movement, TOR doesn't prevent this
- **Your Implementation:** Cursor tracking events in `WebViewBrowser.tsx` are forwarded to pages - websites can receive this data

#### 4. **Webview Isolation**
- Each webview gets its own partition/session
- TOR-enabled tabs have isolated cookies/storage from normal tabs
- **Good:** Prevents cross-tab tracking
- **Limited:** Doesn't prevent fingerprinting within a tab

#### 5. **DNS Leaks**
- **Risk:** If DNS resolution doesn't go through TOR, your ISP can see domain lookups
- **Electron:** Need to ensure DNS goes through TOR proxy
- **Configuration:** Must set `proxyBypassRules` correctly

---

## Real-World Anonymity Scenarios

### Scenario 1: Anonymous Browsing ✅
**User wants to:** Browse news sites without their ISP knowing
- **TOR helps:** ✅ Yes - ISP sees TOR traffic, not destination sites
- **Website sees:** TOR exit node IP, not user's real IP
- **Anonymity level:** High

### Scenario 2: Access Blocked Content ✅
**User wants to:** Access sites blocked in their country
- **TOR helps:** ✅ Yes - Can bypass geographic restrictions
- **Anonymity level:** Medium (depends on what's being blocked)

### Scenario 3: Prevent Tracking by Websites ⚠️
**User wants to:** Prevent websites from tracking them
- **TOR helps:** ⚠️ Partially - Hides IP, but fingerprinting still works
- **Website can still:** Track via cookies, localStorage, fingerprinting
- **Anonymity level:** Medium (better than nothing, but not complete)

### Scenario 4: Anonymous Search ⚠️
**User wants to:** Search without being tracked
- **Using your app's search (`localhost:3000/search`):** ❌ Not anonymous from your app
- **Using external search engines via TOR:** ✅ Partially anonymous (IP hidden, but fingerprinting remains)
- **Anonymity level:** Medium-Low (depends on search engine)

### Scenario 5: Complete Anonymity ❌
**User wants to:** Be completely untraceable
- **TOR alone:** ❌ Not sufficient
- **Would need:** TOR + VPN + anti-fingerprinting + no JavaScript + no logins + behavioral changes
- **Reality:** Perfect anonymity is extremely difficult

---

## Implementation Checklist

### Phase 1: Core TOR Integration
- [ ] Create `electron/tor-manager.ts`
- [ ] Add TOR binary bundling scripts
- [ ] Configure TOR session in `electron/main.ts`
- [ ] Test TOR daemon startup/shutdown
- [ ] Verify SOCKS proxy configuration

### Phase 2: Per-Tab TOR Support
- [ ] Add `useTor` field to Tab interface
- [ ] Create isolated sessions per tab
- [ ] Update webview partition assignment
- [ ] Implement tab session switching
- [ ] Test multiple tabs (some TOR, some normal)

### Phase 3: UI Components
- [ ] Create TOR toggle button component
- [ ] Create TOR status indicator
- [ ] Add TOR status to browser bar
- [ ] Add circuit information display
- [ ] Handle TOR errors gracefully

### Phase 4: IPC & Communication
- [ ] Add TOR methods to `electron/preload.ts`
- [ ] Implement TOR IPC handlers in main process
- [ ] Add event listeners for status changes
- [ ] Test IPC communication

### Phase 5: Advanced Features
- [ ] New circuit button (NEWNYM command)
- [ ] TOR circuit information display
- [ ] Connection quality indicators
- [ ] Settings for TOR configuration
- [ ] Warning dialogs about TOR limitations

### Phase 6: Security Hardening
- [ ] Prevent DNS leaks
- [ ] Ensure all webview traffic uses proxy
- [ ] Test with TOR check websites (check.torproject.org)
- [ ] Validate proxy bypass rules
- [ ] Add security warnings in UI

### Phase 7: Testing & Documentation
- [ ] Test on all platforms (macOS, Windows, Linux)
- [ ] Test TOR connection failures
- [ ] Test circuit renewal during browsing
- [ ] Performance testing
- [ ] User documentation about TOR limitations

---

## User-Facing Features

### Global TOR Toggle
```
[🔓 TOR Disabled]  ← Click to enable for all new tabs
```

### Per-Tab TOR Toggle
```
Tab 1: example.com  [🔒]  ← TOR enabled
Tab 2: google.com   [🔓]  ← TOR disabled
```

### TOR Status Indicator
```
🔒 TOR Connected (Circuit: Entry→Middle→Exit)
   Exit Node: 185.220.101.x (Germany)
   [New Circuit] button
```

### Settings Panel
```
TOR Settings
├── Enable TOR by default for new tabs: [ ]
├── Show TOR status indicator: [✓]
├── Auto-request new circuit every: [10 minutes]
└── TOR Configuration
    ├── SOCKS Port: 9050
    ├── Control Port: 9051
    └── Data Directory: ~/AppData/Forkyy/tor-data
```

---

## Performance Impact

### Latency
- **Normal browsing:** 50-200ms per request
- **TOR browsing:** 2-5 seconds per request
- **Impact:** 10-25x slower page loads

### Bandwidth
- **TOR overhead:** ~20-30% additional bandwidth
- **Circuit establishment:** Initial connection takes 5-10 seconds

### CPU/Memory
- **TOR daemon:** ~50-100MB RAM
- **Additional CPU:** Minimal (mostly network I/O)

---

## Legal & Ethical Considerations

### Legal Status
- TOR is legal in most countries
- Some countries restrict/ban TOR (check local laws)
- Using TOR for illegal activities is still illegal

### Ethical Considerations
- **Your responsibility:** Make it clear TOR doesn't provide perfect anonymity
- **User education:** Explain limitations and risks
- **Transparency:** Document what TOR does and doesn't protect

### App Store Policies
- **macOS App Store:** May have restrictions on TOR bundling
- **Windows Store:** Generally allows TOR
- **Linux:** No restrictions

---

## Conclusion: Realistic Anonymity Expectations

### What Users CAN Expect ✅
1. **IP address hidden** from websites
2. **ISP cannot see** which websites visited
3. **Bypass geographic restrictions**
4. **Some protection** against basic tracking

### What Users CANNOT Expect ❌
1. **Complete anonymity** from determined adversaries
2. **Protection from fingerprinting**
3. **Anonymity after logging in** to websites
4. **Perfect privacy** (no such thing)
5. **Anonymity from YOUR app** (you control localhost:3000)

### Best Practice Recommendation
**Position TOR as a privacy tool, not an anonymity tool:**
- Marketing: "Browse with increased privacy"
- NOT: "Browse completely anonymously"
- Clear documentation about limitations
- User education about threat models

**The reality:** TOR significantly improves privacy for most users, but it's not a magic anonymity button. Users who need strong anonymity should understand the limitations and use additional measures (anti-fingerprinting extensions, behavioral changes, etc.).

