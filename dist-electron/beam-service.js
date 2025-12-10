"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeamService = void 0;
exports.getBeamService = getBeamService;
const child_process_1 = require("child_process");
const path_1 = require("path");
const events_1 = require("events");
class BeamService extends events_1.EventEmitter {
    constructor() {
        super();
        this.pythonProcess = null;
        this.requestId = 0;
        this.pendingRequests = new Map();
        this.isConnected = false;
        this.isTracking = false;
        this.gazeInterval = null;
    }
    /**
     * Start the Python bridge service
     */
    async start() {
        if (this.pythonProcess) {
            return true;
        }
        try {
            const bridgePath = (0, path_1.join)(__dirname, 'beam-bridge.py');
            // Try to use python3, fallback to python
            const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
            this.pythonProcess = (0, child_process_1.spawn)(pythonCmd, [bridgePath], {
                stdio: ['pipe', 'pipe', 'pipe'],
                cwd: __dirname
            });
            this.pythonProcess.stdout?.on('data', (data) => {
                const lines = data.toString().split('\n').filter(line => line.trim());
                for (const line of lines) {
                    try {
                        const response = JSON.parse(line);
                        this.handleResponse(response);
                    }
                    catch (e) {
                        console.error('[BeamService] Failed to parse response:', line, e);
                    }
                }
            });
            this.pythonProcess.stderr?.on('data', (data) => {
                console.error('[BeamService] Python stderr:', data.toString());
            });
            this.pythonProcess.on('exit', (code) => {
                console.log('[BeamService] Python process exited with code:', code);
                this.pythonProcess = null;
                this.isConnected = false;
                this.isTracking = false;
                this.emit('disconnected');
            });
            // Wait a bit for initialization
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Check if Beam is available
            const status = await this.isAvailable();
            return status.available;
        }
        catch (error) {
            console.error('[BeamService] Failed to start Python bridge:', error);
            return false;
        }
    }
    /**
     * Stop the Python bridge service
     */
    stop() {
        if (this.gazeInterval) {
            clearInterval(this.gazeInterval);
            this.gazeInterval = null;
        }
        if (this.pythonProcess) {
            this.pythonProcess.kill();
            this.pythonProcess = null;
        }
        this.isConnected = false;
        this.isTracking = false;
    }
    /**
     * Send a JSON-RPC request to Python bridge
     */
    async sendRequest(method, params = {}) {
        if (!this.pythonProcess || !this.pythonProcess.stdin) {
            throw new Error('Python bridge not started');
        }
        const id = ++this.requestId;
        const request = {
            jsonrpc: '2.0',
            id,
            method,
            params
        };
        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, { resolve, reject });
            try {
                this.pythonProcess.stdin.write(JSON.stringify(request) + '\n');
            }
            catch (error) {
                this.pendingRequests.delete(id);
                reject(error);
            }
            // Timeout after 5 seconds
            setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error(`Request timeout: ${method}`));
                }
            }, 5000);
        });
    }
    /**
     * Handle JSON-RPC response from Python bridge
     */
    handleResponse(response) {
        if (response.id !== undefined && this.pendingRequests.has(response.id)) {
            const { resolve, reject } = this.pendingRequests.get(response.id);
            this.pendingRequests.delete(response.id);
            if (response.error) {
                reject(new Error(response.error.message || 'Unknown error'));
            }
            else {
                resolve(response.result);
            }
        }
        else if (response.method === 'init') {
            // Initial status message
            this.emit('status', response.result);
        }
    }
    /**
     * Check if Beam SDK is available
     */
    async isAvailable() {
        try {
            return await this.sendRequest('is_available');
        }
        catch (error) {
            console.error('[BeamService] Error checking availability:', error);
            return { available: false, connected: false, tracking: false };
        }
    }
    /**
     * Connect to Beam Eye Tracker
     */
    async connect() {
        try {
            const result = await this.sendRequest('connect');
            if (result.success) {
                this.isConnected = true;
                this.emit('connected');
                return true;
            }
            else {
                throw new Error(result.error || 'Failed to connect');
            }
        }
        catch (error) {
            console.error('[BeamService] Connection error:', error);
            this.emit('error', error);
            return false;
        }
    }
    /**
     * Disconnect from Beam Eye Tracker
     */
    async disconnect() {
        try {
            await this.sendRequest('disconnect');
            this.isConnected = false;
            this.isTracking = false;
            this.emit('disconnected');
        }
        catch (error) {
            console.error('[BeamService] Disconnect error:', error);
        }
    }
    /**
     * Start eye tracking
     */
    async startTracking() {
        try {
            const result = await this.sendRequest('start_tracking');
            if (result.success) {
                this.isTracking = true;
                this.startGazePolling();
                this.emit('tracking_started');
                return true;
            }
            else {
                throw new Error(result.error || 'Failed to start tracking');
            }
        }
        catch (error) {
            console.error('[BeamService] Start tracking error:', error);
            this.emit('error', error);
            return false;
        }
    }
    /**
     * Stop eye tracking
     */
    async stopTracking() {
        try {
            await this.sendRequest('stop_tracking');
            this.isTracking = false;
            this.stopGazePolling();
            this.emit('tracking_stopped');
        }
        catch (error) {
            console.error('[BeamService] Stop tracking error:', error);
        }
    }
    /**
     * Start polling for gaze data
     */
    startGazePolling() {
        if (this.gazeInterval) {
            return;
        }
        // Poll at ~60Hz (every ~16ms)
        this.gazeInterval = setInterval(async () => {
            try {
                const gazeData = await this.getGazeData();
                if (gazeData && gazeData.valid) {
                    this.emit('gaze', gazeData);
                }
            }
            catch (error) {
                // Silently handle errors during polling
            }
        }, 16);
    }
    /**
     * Stop polling for gaze data
     */
    stopGazePolling() {
        if (this.gazeInterval) {
            clearInterval(this.gazeInterval);
            this.gazeInterval = null;
        }
    }
    /**
     * Get current gaze data
     */
    async getGazeData() {
        try {
            return await this.sendRequest('get_gaze_data');
        }
        catch (error) {
            console.error('[BeamService] Error getting gaze data:', error);
            return null;
        }
    }
    /**
     * Get head pose data
     */
    async getHeadPose() {
        try {
            return await this.sendRequest('get_head_pose');
        }
        catch (error) {
            console.error('[BeamService] Error getting head pose:', error);
            return null;
        }
    }
    /**
     * Start calibration
     */
    async calibrate() {
        try {
            const result = await this.sendRequest('calibrate');
            return result.success || false;
        }
        catch (error) {
            console.error('[BeamService] Calibration error:', error);
            return false;
        }
    }
}
exports.BeamService = BeamService;
// Singleton instance
let beamService = null;
function getBeamService() {
    if (!beamService) {
        beamService = new BeamService();
    }
    return beamService;
}
