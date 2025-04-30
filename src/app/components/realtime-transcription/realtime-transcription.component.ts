import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-realtime-transcription',
  standalone: true,
  templateUrl: './realtime-transcription.component.html',
  styleUrls: ['./realtime-transcription.component.scss'],
  imports: [NgIf, NgClass]
})
export class RealtimeTranscriptionComponent implements OnInit, OnDestroy {
  status: string = 'Not Connected';
  fullTranscript: string = '';
  interimTranscript: string = '';
  isRecording: boolean = false;
  mediaRecorder: MediaRecorder | null = null;
  stream: MediaStream | null = null;
  socket: WebSocket | null = null;

  // Audio recording and playback
  audioChunks: Blob[] = [];
  audioBlob: Blob | null = null;
  audioUrl: string = '';
  isAudioAvailable: boolean = false;
  isPlaying: boolean = false;
  audioElement: HTMLAudioElement | null = null;

  // Child-friendly paragraph
  readonly childParagraph: string = 'The big dog only jumps high when he sees a bright red ball.';
  similarityScore: number = 0; // Percentage similarity
  transcriptColor: 'green' | 'red' | '' = ''; // Color based on match

  // Deepgram API configuration
  private readonly DEEPGRAM_API_KEY = 'e7538de8622ddba64e85f3dd9315574a76c8c367';
  private readonly DEEPGRAM_OPTIONS = {
    punctuate: true,
    interim_results: true,
    endpointing: 'true',
    vad_turnoff: 500
  };

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.audioElement = new Audio();
    this.audioElement.onplay = () => {
      this.zone.run(() => {
        this.isPlaying = true;
        this.cdr.detectChanges();
      });
    };
    this.audioElement.onpause = () => {
      this.zone.run(() => {
        this.isPlaying = false;
        this.cdr.detectChanges();
      });
    };
    this.audioElement.onended = () => {
      this.zone.run(() => {
        this.isPlaying = false;
        this.cdr.detectChanges();
      });
    };
  }

  ngOnDestroy(): void {
    this.stopRecording();
    this.cleanupAudio();
  }

  startRecording(): void {
    if (this.isRecording) return;

    // Reset previous data
    this.cleanupAudio();
    this.audioChunks = [];
    this.fullTranscript = '';
    this.interimTranscript = '';
    this.transcriptColor = '';
    this.similarityScore = 0;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.stream = stream;
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          alert('Browser not supported');
          return;
        }

        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        const queryParams = new URLSearchParams(this.DEEPGRAM_OPTIONS as any).toString();
        const socketUrl = `wss://api.deepgram.com/v1/listen?${queryParams}`;

        this.socket = new WebSocket(socketUrl, ['token', this.DEEPGRAM_API_KEY]);

        this.socket.onopen = () => {
          this.zone.run(() => {
            this.status = 'Connected';
            this.isRecording = true;
            console.log({ event: 'onopen' });

            this.mediaRecorder?.addEventListener('dataavailable', async (event) => {
              if (event.data.size > 0) {
                this.audioChunks.push(event.data);
                if (this.socket && this.socket.readyState === 1) {
                  this.socket.send(event.data);
                }
              }
            });

            this.mediaRecorder?.start(250);
          });
        };

        this.socket.onmessage = (message) => {
          const received = JSON.parse(message.data);
          const transcript = received.channel.alternatives[0].transcript;

          if (transcript) {
            this.zone.run(() => {
              if (received.is_final) {
                console.log('Final:', transcript);
                this.fullTranscript += transcript + ' ';
                this.interimTranscript = '';
                // Calculate similarity when final transcript is received
                this.similarityScore = this.calculateSimilarity(
                  this.fullTranscript.trim(),
                  this.childParagraph
                );
                this.transcriptColor = this.similarityScore >= 70 ? 'green' : 'red';
              } else {
                console.log('Interim:', transcript);
                this.interimTranscript = transcript;
              }
              this.cdr.detectChanges();
            });
          }
        };

        this.socket.onclose = () => {
          this.zone.run(() => {
            console.log({ event: 'onclose' });
            this.isRecording = false;
            this.status = 'Disconnected';
            if (this.interimTranscript) {
              this.fullTranscript += this.interimTranscript + ' ';
              this.interimTranscript = '';
              this.similarityScore = this.calculateSimilarity(
                this.fullTranscript.trim(),
                this.childParagraph
              );
              this.transcriptColor = this.similarityScore >= 70 ? 'green' : 'red';
            }
            this.cdr.detectChanges();
          });
        };

        this.socket.onerror = (error) => {
          this.zone.run(() => {
            console.log({ event: 'onerror', error });
            this.status = 'Error';
            this.cdr.detectChanges();
          });
        };
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
        this.status = 'Error: ' + error.message;
        this.cdr.detectChanges();
      });
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        this.processAudio();
      };
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.mediaRecorder = null;
    this.isRecording = false;
    this.status = 'Not Connected';

    if (this.interimTranscript) {
      this.fullTranscript += this.interimTranscript + ' ';
      this.interimTranscript = '';
      this.similarityScore = this.calculateSimilarity(this.fullTranscript.trim(), this.childParagraph);
      this.transcriptColor = this.similarityScore >= 70 ? 'green' : 'red';
    }
    this.cdr.detectChanges();
  }

  processAudio(): void {
    if (this.audioChunks.length) {
      this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.audioUrl = URL.createObjectURL(this.audioBlob);
      if (this.audioElement) {
        this.audioElement.src = this.audioUrl;
      }
      this.isAudioAvailable = true;
      this.cdr.detectChanges();
    }
  }

  cleanupAudio(): void {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }
    this.audioUrl = '';
    this.audioBlob = null;
    this.isAudioAvailable = false;
    this.isPlaying = false;
  }

  playAudio(): void {
    if (this.audioElement && this.audioUrl) {
      if (this.isPlaying) {
        this.audioElement.pause();
      } else {
        this.audioElement.play();
      }
    }
  }

  clearTranscript(): void {
    this.fullTranscript = '';
    this.interimTranscript = '';
    this.transcriptColor = '';
    this.similarityScore = 0;
    this.cdr.detectChanges();
  }

  get completeTranscript(): string {
    return this.fullTranscript + (this.interimTranscript ? this.interimTranscript : '');
  }

  saveTranscript(): void {
    const text = this.completeTranscript;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  saveAudio(): void {
    if (!this.audioBlob) return;
    this.convertToMp3(this.audioBlob).then(mp3Blob => {
      const url = URL.createObjectURL(mp3Blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${timestamp}.mp3`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }).catch(error => {
      console.error('Error converting to MP3:', error);
      alert('Could not convert to MP3. Downloading as WebM instead.');
      this.downloadWebmAudio();
    });
  }

  downloadWebmAudio(): void {
    if (!this.audioBlob) return;
    const url = URL.createObjectURL(this.audioBlob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${timestamp}.webm`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async convertToMp3(webmBlob: Blob): Promise<Blob> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(webmBlob); // Placeholder
      }, 500);
    });
  }

  saveBoth(): void {
    this.saveTranscript();
    this.saveAudio();
  }

  // Calculate similarity between two strings using Levenshtein distance
  calculateSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;

    // Normalize strings: lowercase and remove punctuation
    const normalize = (s: string) =>
      s.toLowerCase().replace(/[.,!?]/g, '').trim();

    str1 = normalize(str1);
    str2 = normalize(str2);

    // Levenshtein distance implementation
    const matrix: number[][] = Array(str2.length + 1)
      .fill(0)
      .map(() => Array(str1.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // Deletion
          matrix[j - 1][i] + 1, // Insertion
          matrix[j - 1][i - 1] + indicator // Substitution
        );
      }
    }

    const distance = matrix[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;
    return Math.round(similarity * 10) / 10; // Round to 1 decimal place
  }
}
