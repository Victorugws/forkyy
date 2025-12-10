"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EyeTrackingService = void 0;
exports.getEyeTrackingService = getEyeTrackingService;
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
// Platform-specific cursor movement
const isMacOS = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';
class EyeTrackingService {
    constructor() {
        this.config = {
            enabled: false,
            smoothing: 0.7,
            sensitivity: 1.0
        };
        this.lastPosition = null;
        this.isMoving = false;
        // Native cursor control is available on all platforms
        console.log('[EyeTracking] Initialized with native cursor control');
    }
    /**
     * Update eye tracking configuration
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Move cursor to position based on eye gaze
     * @param gazeX - Normalized gaze X (0-1)
     * @param gazeY - Normalized gaze Y (0-1)
     */
    async moveCursorFromGaze(gazeX, gazeY) {
        if (!this.config.enabled)
            return;
        try {
            const display = electron_1.screen.getPrimaryDisplay();
            const { width, height } = display.workAreaSize;
            const { x: offsetX, y: offsetY } = display.workArea;
            // Convert normalized gaze to screen coordinates
            let targetX = offsetX + gazeX * width;
            let targetY = offsetY + gazeY * height;
            // Apply exponential smoothing (better than linear for eye tracking)
            // Higher smoothing = more stable but less responsive
            const effectiveSmoothing = Math.max(0.85, this.config.smoothing); // Minimum 85% smoothing for accuracy
            if (this.lastPosition) {
                // Use exponential moving average for smoother tracking
                const alpha = 1 - effectiveSmoothing;
                targetX = this.lastPosition.x + (targetX - this.lastPosition.x) * alpha;
                targetY = this.lastPosition.y + (targetY - this.lastPosition.y) * alpha;
            }
            // Apply sensitivity with velocity limiting
            if (this.lastPosition) {
                const deltaX = targetX - this.lastPosition.x;
                const deltaY = targetY - this.lastPosition.y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                // Limit maximum movement per update to prevent jumps
                const maxDelta = 100 * this.config.sensitivity; // pixels per update
                if (distance > maxDelta) {
                    const scale = maxDelta / distance;
                    targetX = this.lastPosition.x + deltaX * scale;
                    targetY = this.lastPosition.y + deltaY * scale;
                }
                else {
                    // Apply sensitivity to smaller movements
                    targetX = this.lastPosition.x + deltaX * this.config.sensitivity;
                    targetY = this.lastPosition.y + deltaY * this.config.sensitivity;
                }
            }
            // Clamp to screen bounds
            targetX = Math.max(offsetX, Math.min(offsetX + width, targetX));
            targetY = Math.max(offsetY, Math.min(offsetY + height, targetY));
            // Only move if there's a meaningful change (reduce jitter)
            if (this.lastPosition) {
                const movement = Math.sqrt(Math.pow(targetX - this.lastPosition.x, 2) +
                    Math.pow(targetY - this.lastPosition.y, 2));
                // Don't move if change is less than 2 pixels
                if (movement < 2) {
                    return;
                }
            }
            // Move cursor using platform-specific method
            await this.moveCursorNative(Math.round(targetX), Math.round(targetY));
            // Update last position
            this.lastPosition = { x: targetX, y: targetY };
        }
        catch (error) {
            console.error('[EyeTracking] Error moving cursor:', error);
        }
    }
    async moveCursorNative(x, y) {
        if (isMacOS) {
            // Use AppleScript on macOS
            const script = `tell application "System Events" to set the mouse position to {${x}, ${y}}`;
            await execAsync(`osascript -e '${script}'`);
        }
        else if (isWindows) {
            // Use PowerShell on Windows
            const script = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y})`;
            await execAsync(`powershell -Command "${script}"`);
        }
        else if (isLinux) {
            // Use xdotool on Linux (needs to be installed)
            await execAsync(`xdotool mousemove ${x} ${y}`);
        }
    }
    /**
     * Move cursor to absolute screen position
     */
    async moveCursorTo(x, y) {
        if (!this.config.enabled)
            return;
        try {
            await this.moveCursorNative(x, y);
            this.lastPosition = { x, y };
        }
        catch (error) {
            console.error('[EyeTracking] Error moving cursor to position:', error);
        }
    }
    /**
     * Get current cursor position
     */
    async getCursorPosition() {
        try {
            if (isMacOS) {
                const script = 'tell application "System Events" to get the position of the mouse';
                const { stdout } = await execAsync(`osascript -e '${script}'`);
                const match = stdout.match(/\{(\d+),\s*(\d+)\}/);
                if (match) {
                    return { x: parseInt(match[1]), y: parseInt(match[2]) };
                }
            }
            else if (isWindows) {
                const script = 'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position';
                const { stdout } = await execAsync(`powershell -Command "${script}"`);
                // Parse PowerShell output
                const match = stdout.match(/X[:\s]+(\d+)[,\s]+Y[:\s]+(\d+)/);
                if (match) {
                    return { x: parseInt(match[1]), y: parseInt(match[2]) };
                }
            }
            else if (isLinux) {
                const { stdout } = await execAsync('xdotool getmouselocation --shell');
                const xMatch = stdout.match(/X=(\d+)/);
                const yMatch = stdout.match(/Y=(\d+)/);
                if (xMatch && yMatch) {
                    return { x: parseInt(xMatch[1]), y: parseInt(yMatch[1]) };
                }
            }
            return { x: 0, y: 0 };
        }
        catch (error) {
            console.error('[EyeTracking] Error getting cursor position:', error);
            return { x: 0, y: 0 };
        }
    }
    /**
     * Perform a click at current cursor position
     */
    async click() {
        if (!this.config.enabled)
            return;
        try {
            if (isMacOS) {
                await execAsync('osascript -e \'tell application "System Events" to click\'');
            }
            else if (isWindows) {
                const script = 'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position; [System.Windows.Forms.MouseButtons]::Left';
                await execAsync(`powershell -Command "${script}"`);
                // Use click simulation
                await execAsync('powershell -Command "[System.Windows.Forms.Cursor]::Position"');
            }
            else if (isLinux) {
                await execAsync('xdotool click 1');
            }
        }
        catch (error) {
            console.error('[EyeTracking] Error performing click:', error);
        }
    }
    /**
     * Perform a double click
     */
    async doubleClick() {
        if (!this.config.enabled)
            return;
        try {
            if (isMacOS) {
                await execAsync('osascript -e \'tell application "System Events" to double click\'');
            }
            else if (isWindows) {
                // Double click simulation
                await this.click();
                await new Promise(resolve => setTimeout(resolve, 50));
                await this.click();
            }
            else if (isLinux) {
                await execAsync('xdotool click --repeat 2 1');
            }
        }
        catch (error) {
            console.error('[EyeTracking] Error performing double click:', error);
        }
    }
    /**
     * Enable or disable eye tracking
     */
    setEnabled(enabled) {
        this.config.enabled = enabled;
        if (!enabled) {
            this.lastPosition = null;
        }
    }
    /**
     * Check if eye tracking is enabled
     */
    isEnabled() {
        return this.config.enabled;
    }
    /**
     * Reset calibration and smoothing state
     */
    reset() {
        this.lastPosition = null;
    }
}
exports.EyeTrackingService = EyeTrackingService;
// Singleton instance
let eyeTrackingService = null;
function getEyeTrackingService() {
    if (!eyeTrackingService) {
        eyeTrackingService = new EyeTrackingService();
    }
    return eyeTrackingService;
}
