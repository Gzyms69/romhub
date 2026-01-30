// ROMHub - Main JavaScript
console.log('ROMHub initializing...');

const ROMHub = {
    // Project state
    state: {
        phase: 0,
        emulatorReady: false,
        romLoaded: false,
        currentRom: null,
        saveStates: {}
    },
    
    // DOM Elements
    elements: {},
    
    // Initialize
    init() {
        console.log('Initializing ROMHub...');
        this.cacheElements();
        this.bindEvents();
        this.updateUI();
        
        // Check for existing saves
        this.loadSaveStates();
        
        // Phase 0: Waiting for emulator verification
        this.showStatus('Phase 0: N64Wasm core verification in progress...');
    },
    
    // Cache DOM elements
    cacheElements() {
        this.elements = {
            phaseIndicator: document.getElementById('phase-indicator'),
            uploadSection: document.getElementById('upload-section'),
            emulatorContainer: document.getElementById('emulator-container'),
            controls: document.getElementById('controls'),
            romFile: document.getElementById('rom-file'),
            loadRomBtn: document.getElementById('load-rom'),
            emulatorCanvas: document.getElementById('emulator-canvas'),
            saveStateBtn: document.getElementById('save-state'),
            loadStateBtn: document.getElementById('load-state'),
            resetBtn: document.getElementById('reset'),
            status: document.getElementById('status')
        };
    },
    
    // Bind event listeners
    bindEvents() {
        if (this.elements.loadRomBtn) {
            this.elements.loadRomBtn.addEventListener('click', () => this.loadROM());
        }
        
        if (this.elements.saveStateBtn) {
            this.elements.saveStateBtn.addEventListener('click', () => this.saveState());
        }
        
        if (this.elements.loadStateBtn) {
            this.elements.loadStateBtn.addEventListener('click', () => this.loadState());
        }
        
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => this.resetEmulator());
        }
    },
    
    // Update UI based on state
    updateUI() {
        const { phase, emulatorReady, romLoaded } = this.state;
        
        // Show/hide sections based on phase
        this.elements.phaseIndicator.textContent = `PHASE ${phase}: ${
            phase === 0 ? 'Core verification...' :
            phase === 1 ? 'Core integration...' :
            'Running'
        }`;
        
        // Show upload section when emulator is ready
        this.elements.uploadSection.classList.toggle('hidden', !emulatorReady);
        
        // Show emulator when ROM is loaded
        this.elements.emulatorContainer.classList.toggle('hidden', !romLoaded);
        this.elements.controls.classList.toggle('hidden', !romLoaded);
    },
    
    // Load ROM from file input
    async loadROM() {
        const file = this.elements.romFile.files[0];
        if (!file) {
            this.showStatus('Please select a ROM file first', 'error');
            return;
        }
        
        this.showStatus(`Loading ${file.name}...`);
        
        try {
            // Read file as ArrayBuffer
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            
            // TODO: Pass to N64Wasm emulator
            console.log('ROM loaded:', file.name, arrayBuffer.byteLength, 'bytes');
            
            // Update state
            this.state.romLoaded = true;
            this.state.currentRom = {
                name: file.name,
                size: arrayBuffer.byteLength,
                data: arrayBuffer,
                hash: await this.hashArrayBuffer(arrayBuffer)
            };
            
            this.updateUI();
            this.showStatus(`ROM loaded: ${file.name}`);
            
        } catch (error) {
            console.error('Failed to load ROM:', error);
            this.showStatus('Failed to load ROM', 'error');
        }
    },
    
    // Read file as ArrayBuffer
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    },
    
    // Simple hash for identifying ROMs
    async hashArrayBuffer(buffer) {
        // Simple hash for now - can be improved
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    },
    
    // Save state
    saveState() {
        this.showStatus('Save state functionality not yet implemented');
        // TODO: Call N64Wasm save function and store in IndexedDB
    },
    
    // Load state
    loadState() {
        this.showStatus('Load state functionality not yet implemented');
        // TODO: Load from IndexedDB and call N64Wasm load function
    },
    
    // Reset emulator
    resetEmulator() {
        this.showStatus('Reset functionality not yet implemented');
        // TODO: Reset N64Wasm emulator
    },
    
    // Load save states from IndexedDB
    async loadSaveStates() {
        // TODO: Implement IndexedDB loading
        console.log('Save state loading not yet implemented');
    },
    
    // Show status message
    showStatus(message, type = 'info') {
        if (this.elements.status) {
            this.elements.status.textContent = message;
            this.elements.status.className = `status-${type}`;
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
        
        // Auto-clear after 5 seconds
        setTimeout(() => {
            if (this.elements.status && this.elements.status.textContent === message) {
                this.elements.status.textContent = '';
            }
        }, 5000);
    },
    
    // Advance to next phase (called when emulator is verified)
    advanceToPhase(phase) {
        this.state.phase = phase;
        if (phase >= 1) {
            this.state.emulatorReady = true;
        }
        this.updateUI();
        this.showStatus(`Advanced to Phase ${phase}`);
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => ROMHub.init());

// Make available globally for debugging
window.ROMHub = ROMHub;
