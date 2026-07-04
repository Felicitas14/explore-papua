class PapuaAudioEngine {
    constructor() {
        this.ctx = null;
        this.musicPlaying = false;
        this.ambientPlaying = false;
        this.volume = 0.5;

        // Synth nodes
        this.musicGain = null;
        this.ambientGain = null;
        this.masterGain = null;
        this.analyser = null;

        // Sound loops & LFOs
        this.waveTimer = null;
        this.birdTimer = null;
        this.fluteTimer = null;
        this.droneOscs = [];
        this.droneGain = null;
        
        // Pentatonic scale notes for flute improvisation (Hz) - lowered octave for a calmer feel
        this.scale = [220.00, 246.94, 293.66, 329.63, 392.00, 440.00, 493.88, 587.33]; // A3, B3, D4, E4, G4, A4, B4, D5
        
        // Drone notes for soothing background chords (A2, E3, A3)
        this.droneFreqs = [110.00, 164.81, 220.00]; 
    }

    init() {
        if (this.ctx) return;
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Analyser for oscilloscope visualization
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.masterGain.connect(this.analyser);

        // Sub Gains
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.2, this.ctx.currentTime); // Lower music volume for ambient feel
        this.musicGain.connect(this.masterGain);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGain);
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
        }
    }

    // Force startup on user interaction
    startAutoplay() {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        // Start calming music automatically if not already playing
        if (!this.musicPlaying) {
            this.startFluteImprovisation();
        }
        // Start relaxing nature ambient automatically
        if (!this.ambientPlaying) {
            this.startAmbientSynth();
        }
    }

    toggleMusic() {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        if (this.musicPlaying) {
            this.stopFluteImprovisation();
        } else {
            this.startFluteImprovisation();
        }
        return this.musicPlaying;
    }

    toggleAmbient() {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        if (this.ambientPlaying) {
            this.stopAmbientSynth();
        } else {
            this.startAmbientSynth();
        }
        return this.ambientPlaying;
    }

    // --- NATURE SYNTH: Ocean Waves ---
    createWaveNode() {
        if (!this.ctx) return null;
        
        // Generate white noise
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.value = 0.8;
        filter.frequency.setValueAtTime(280, this.ctx.currentTime); // Lower filter for a softer, calmer sound

        const waveGain = this.ctx.createGain();
        waveGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(waveGain);
        waveGain.connect(this.ambientGain);

        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.09, this.ctx.currentTime); // Slower wave cycles (approx 11s)

        const lfoFilterGain = this.ctx.createGain();
        lfoFilterGain.gain.setValueAtTime(120, this.ctx.currentTime);

        const lfoGainGain = this.ctx.createGain();
        lfoGainGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

        lfo.connect(lfoFilterGain);
        lfoFilterGain.connect(filter.frequency);

        lfo.connect(lfoGainGain);
        lfoGainGain.connect(waveGain.gain);

        lfo.start();
        noise.start();

        return { noise, lfo };
    }

    // --- NATURE SYNTH: Bird Chirps ---
    playBirdChirp() {
        if (!this.ctx || !this.ambientPlaying) return;

        const time = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'sine';
        
        const type = Math.random();
        if (type < 0.4) {
            // Calm double chirp
            osc.frequency.setValueAtTime(2200, time);
            osc.frequency.exponentialRampToValueAtTime(2900, time + 0.12);
            gainNode.gain.setValueAtTime(0.001, time);
            gainNode.gain.linearRampToValueAtTime(0.04, time + 0.04);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
            osc.connect(gainNode);
            gainNode.connect(this.ambientGain);
            osc.start(time);
            osc.stop(time + 0.13);
        } else {
            // Smooth long whistle
            osc.frequency.setValueAtTime(3200, time);
            osc.frequency.linearRampToValueAtTime(2800, time + 0.4);
            gainNode.gain.setValueAtTime(0.001, time);
            gainNode.gain.linearRampToValueAtTime(0.03, time + 0.06);
            gainNode.gain.linearRampToValueAtTime(0.03, time + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
            
            osc.connect(gainNode);
            gainNode.connect(this.ambientGain);
            osc.start(time);
            osc.stop(time + 0.41);
        }
    }

    startAmbientSynth() {
        this.ambientPlaying = true;
        this.waves = this.createWaveNode();

        const triggerBird = () => {
            if (!this.ambientPlaying) return;
            this.playBirdChirp();
            this.birdTimer = setTimeout(triggerBird, 5000 + Math.random() * 10000); // Less frequent chirps for calm
        };
        triggerBird();
    }

    stopAmbientSynth() {
        this.ambientPlaying = false;
        if (this.birdTimer) clearTimeout(this.birdTimer);
        
        if (this.waves) {
            try {
                this.waves.noise.stop();
                this.waves.lfo.stop();
            } catch(e) {}
            this.waves = null;
        }
    }

    // --- MUSIC SYNTH: Soothing Background Drone ---
    startBackgroundDrone() {
        if (!this.ctx) return;
        
        const time = this.ctx.currentTime;
        this.droneGain = this.ctx.createGain();
        this.droneGain.gain.setValueAtTime(0, time);
        // Slow fade in for background drone
        this.droneGain.gain.linearRampToValueAtTime(0.04, time + 3.0);
        this.droneGain.connect(this.musicGain);

        // Lowpass filter for warm drone sound
        const droneFilter = this.ctx.createBiquadFilter();
        droneFilter.type = 'lowpass';
        droneFilter.frequency.setValueAtTime(180, time);
        droneFilter.connect(this.droneGain);

        this.droneOscs = this.droneFreqs.map(freq => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine'; // Pure clean tones
            osc.frequency.setValueAtTime(freq, time);

            // Subtle pitch modulation to make drone feel "alive"
            const lfo = this.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(0.05 + Math.random() * 0.05, time); // Extremely slow LFO

            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(freq * 0.005, time);

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            
            osc.connect(droneFilter);
            
            lfo.start(time);
            osc.start(time);

            return { osc, lfo };
        });
    }

    stopBackgroundDrone() {
        const time = this.ctx.currentTime;
        if (this.droneGain) {
            try {
                this.droneGain.gain.linearRampToValueAtTime(0, time + 1.0);
            } catch (e) {}
        }
        
        setTimeout(() => {
            this.droneOscs.forEach(d => {
                try {
                    d.osc.stop();
                    d.lfo.stop();
                } catch(e) {}
            });
            this.droneOscs = [];
            this.droneGain = null;
        }, 1100);
    }

    // --- MUSIC SYNTH: Pentatonic Flute Improvisation ---
    playFluteNote() {
        if (!this.ctx || !this.musicPlaying) return;

        const time = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        
        const noteIndex = Math.floor(Math.random() * this.scale.length);
        const freq = this.scale[noteIndex];
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        // Add subtle pitch vibrato (LFO)
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.type = 'sine';
        vibrato.frequency.setValueAtTime(4 + Math.random() * 2, time); 
        vibratoGain.gain.setValueAtTime(freq * 0.006, time); 
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibrato.start(time);
        vibrato.stop(time + 4.5);

        // Extremely gentle, long ambient envelope
        const attack = 0.8 + Math.random() * 0.8; // Very slow attack
        const duration = 2.0 + Math.random() * 2.0; 
        const release = 1.5 + Math.random() * 1.5; 

        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.05, time + attack); // Softer volume
        gainNode.gain.setValueAtTime(0.05, time + duration);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration + release);

        // Echo/Delay line
        const delay = this.ctx.createDelay();
        delay.delayTime.setValueAtTime(0.6, time); // Slow delay

        const delayFeedback = this.ctx.createGain();
        delayFeedback.gain.setValueAtTime(0.45, time); // Long echoes

        const delayFilter = this.ctx.createBiquadFilter();
        delayFilter.type = 'lowpass';
        delayFilter.frequency.setValueAtTime(600, time); // Dark echoes for warm space

        osc.connect(gainNode);
        
        gainNode.connect(delay);
        delay.connect(delayFilter);
        delayFilter.connect(delayFeedback);
        delayFeedback.connect(delay); // Loop

        gainNode.connect(this.musicGain);
        delayFilter.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + duration + release + 2.0);
    }

    startFluteImprovisation() {
        this.musicPlaying = true;
        this.startBackgroundDrone();
        
        const triggerNote = () => {
            if (!this.musicPlaying) return;
            this.playFluteNote();
            // Less frequent notes for an "adem" (peaceful) spacing
            this.fluteTimer = setTimeout(triggerNote, 4000 + Math.random() * 5000);
        };
        
        triggerNote();
    }

    stopFluteImprovisation() {
        this.musicPlaying = false;
        this.stopBackgroundDrone();
        if (this.fluteTimer) clearTimeout(this.fluteTimer);
    }
}

const papuaAudio = new PapuaAudioEngine();
export default papuaAudio;
export { papuaAudio };
