export class AudioService {
  private audioContext: AudioContext | null = null;
  private mainGain: GainNode | null = null;

  constructor() {
    // Lazy initialization of AudioContext on user interaction
  }

  public init(): void {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.mainGain = this.audioContext.createGain();
        this.mainGain.gain.value = 0.3; // Lower volume to not be annoying
        this.mainGain.connect(this.audioContext.destination);
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
      }
    }
  }

  private playNote(frequency: number, duration: number, startTime?: number): void {
    if (!this.audioContext || !this.mainGain) return;

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine'; // A clean, simple sound
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    const gainNode = this.audioContext.createGain();
    // Start with a volume and quickly fade out to prevent clicks
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.mainGain);

    const start = startTime || this.audioContext.currentTime;
    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  public playSwapSound(): void {
    this.playNote(200, 0.1);
  }

  public playPassCompleteSound(): void {
    this.playNote(440, 0.08);
  }

  public playSortedSound(index: number, total: number): void {
    const baseFrequency = 300;
    const maxFrequency = 900;
    // Creates a rising tone as the index increases
    const frequency = baseFrequency + (index / (total - 1)) * (maxFrequency - baseFrequency);
    this.playNote(frequency, 0.1);
  }
}