console.log('=== TEST PAGE SCRIPT STARTING ===');

// Check extension context
const extensionContextEl = document.getElementById('extensionContext');
const browserAPIEl = document.getElementById('browserAPI');
const backgroundScriptEl = document.getElementById('backgroundScript');
const storageAPIEl = document.getElementById('storageAPI');
const tabsAPIEl = document.getElementById('tabsAPI');

console.log('Elements found:', {
  extensionContextEl: !!extensionContextEl,
  browserAPIEl: !!browserAPIEl,
  backgroundScriptEl: !!backgroundScriptEl,
  storageAPIEl: !!storageAPIEl,
  tabsAPIEl: !!tabsAPIEl
});

// Check if we're in extension context
console.log('Browser object:', typeof browser, browser);

// Update status immediately
if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.id) {
  console.log('Extension context available!');
  if (extensionContextEl) {
    extensionContextEl.textContent = '✅ Available';
    extensionContextEl.className = 'status-value success';
  }
  
  // Check browser API
  if (browser.tabs && browser.storage && browser.runtime) {
    console.log('Browser APIs available!');
    if (browserAPIEl) {
      browserAPIEl.textContent = '✅ Available';
      browserAPIEl.className = 'status-value success';
    }

    // Test background script communication
    testBackgroundScript();
    
    // Test storage
    testStorageAPI();
    
    // Test tabs API
    testTabsAPI();
  } else {
    console.log('Missing browser APIs');
    if (browserAPIEl) {
      browserAPIEl.textContent = '❌ Missing APIs';
      browserAPIEl.className = 'status-value error';
    }
  }
} else {
  console.log('Extension context NOT available');
  if (extensionContextEl) {
    extensionContextEl.textContent = '❌ Not Available';
    extensionContextEl.className = 'status-value error';
  }
  if (browserAPIEl) {
    browserAPIEl.textContent = '❌ Not Available';
    browserAPIEl.className = 'status-value error';
  }
}

async function testBackgroundScript() {
  if (!backgroundScriptEl) return;
  try {
    console.log('Testing background script...');
    const response = await browser.runtime.sendMessage({ action: 'getTabs', query: {} });
    console.log('Background script response:', response);
    if (response && response.success) {
      backgroundScriptEl.textContent = '✅ Connected';
      backgroundScriptEl.className = 'status-value success';
    } else {
      backgroundScriptEl.textContent = '⚠️ No Response';
      backgroundScriptEl.className = 'status-value error';
    }
  } catch (error) {
    console.error('Background script error:', error);
    backgroundScriptEl.textContent = '❌ Error: ' + error.message;
    backgroundScriptEl.className = 'status-value error';
  }
}

async function testStorageAPI() {
  if (!storageAPIEl) return;
  try {
    console.log('Testing storage API...');
    await browser.storage.local.set({ test: 'value' });
    const result = await browser.storage.local.get('test');
    console.log('Storage test result:', result);
    if (result.test === 'value') {
      storageAPIEl.textContent = '✅ Working';
      storageAPIEl.className = 'status-value success';
      await browser.storage.local.remove('test');
    } else {
      storageAPIEl.textContent = '❌ Failed';
      storageAPIEl.className = 'status-value error';
    }
  } catch (error) {
    console.error('Storage API error:', error);
    storageAPIEl.textContent = '❌ Error: ' + error.message;
    storageAPIEl.className = 'status-value error';
  }
}

async function testTabsAPI() {
  if (!tabsAPIEl) return;
  try {
    console.log('Testing tabs API...');
    const tabs = await browser.tabs.query({});
    console.log('Tabs API result:', tabs);
    if (Array.isArray(tabs)) {
      tabsAPIEl.textContent = `✅ ${tabs.length} tabs`;
      tabsAPIEl.className = 'status-value success';
    } else {
      tabsAPIEl.textContent = '❌ Invalid Response';
      tabsAPIEl.className = 'status-value error';
    }
  } catch (error) {
    console.error('Tabs API error:', error);
    tabsAPIEl.textContent = '❌ Error: ' + error.message;
    tabsAPIEl.className = 'status-value error';
  }
}

// Make functions available globally
window.testCreateTab = async function() {
  try {
    const response = await browser.runtime.sendMessage({ 
      action: 'createTab', 
      url: 'https://example.com',
      active: false 
    });
    if (response && response.success) {
      alert('Tab created successfully!');
      testGetTabs();
    } else {
      alert('Failed to create tab: ' + (response?.error || 'Unknown error'));
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

window.testGetTabs = async function() {
  try {
    const response = await browser.runtime.sendMessage({ action: 'getTabs', query: {} });
    const tabsList = document.getElementById('tabsList');
    
    if (response && response.success && Array.isArray(response.data)) {
      const tabs = response.data;
      tabsList.innerHTML = '<h3 style="margin-bottom: 1rem;">Open Tabs (' + tabs.length + ')</h3>';
      
      tabs.forEach(tab => {
        const tabItem = document.createElement('div');
        tabItem.className = 'tab-item';
        tabItem.innerHTML = `
          <div style="flex: 1;">
            <div class="tab-title">${tab.title || 'Untitled'}</div>
            <div class="tab-url">${tab.url || ''}</div>
          </div>
          <div style="margin-left: 1rem; opacity: 0.7;">
            ${tab.active ? '⭐ Active' : ''}
          </div>
        `;
        tabsList.appendChild(tabItem);
      });
    } else {
      tabsList.innerHTML = '<p style="text-align: center; opacity: 0.7;">Failed to load tabs</p>';
    }
  } catch (error) {
    const tabsList = document.getElementById('tabsList');
    tabsList.innerHTML = '<p style="text-align: center; color: #f87171;">Error: ' + error.message + '</p>';
  }
};

window.testStorage = async function() {
  try {
    const testData = { 
      timestamp: Date.now(),
      test: 'Forkyy Extension Test'
    };
    
    await browser.runtime.sendMessage({ 
      action: 'setStorage', 
      data: testData 
    });
    
    const response = await browser.runtime.sendMessage({ 
      action: 'getStorage', 
      keys: Object.keys(testData) 
    });
    
    if (response && response.success) {
      alert('Storage test successful!\n\nData stored and retrieved:\n' + JSON.stringify(response.data, null, 2));
    } else {
      alert('Storage test failed');
    }
  } catch (error) {
    alert('Storage error: ' + error.message);
  }
};

// Load tabs on page load
setTimeout(function() {
  if (typeof window.testGetTabs === 'function') {
    window.testGetTabs();
  }
}, 1000);

