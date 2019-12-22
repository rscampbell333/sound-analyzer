
export class FrequencyAnalyzer {
  constructor () {
    this.init = this.init.bind(this);
    this.getFrequency = this.getFrequency.bind(this);
  }

  indexOfGreatest (nums) {
    let greatestIndex = 0;

    for (let i = 1; i < nums.length; i++) {
      if (nums[i] > nums[greatestIndex]) {
        greatestIndex = i;
      }
    }

    return greatestIndex;
  }

  async init () {
    this.audioContext = new window.AudioContext();
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = Math.pow(2, 15);

    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const stream = this.audioContext.createMediaStreamSource(audioStream);
    stream.connect(this.analyzer);
    return stream;
  };

  getFrequency () {
    const frequencyData = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(frequencyData);

    const frequency = this.indexOfGreatest(frequencyData) * this.audioContext.sampleRate / this.analyzer.fftSize;
    return frequency;
  }
}
