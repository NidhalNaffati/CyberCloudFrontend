import {Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-realtime-transcription',
  standalone: true,
  templateUrl: './realtime-transcription.component.html',
  styleUrls: ['./realtime-transcription.component.scss'],
  imports: [
    NgIf,
    NgClass
  ]
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

  // Deepgram API configuration
  private readonly DEEPGRAM_API_KEY = 'e7538de8622ddba64e85f3dd9315574a76c8c367';
  private readonly DEEPGRAM_OPTIONS = {
    punctuate: true,
    interim_results: true,
    endpointing: 'true',
    vad_turnoff: 500
  };

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    // Create audio element for playback
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

    // Reset audio data from previous recordings
    this.cleanupAudio();
    this.audioChunks = [];

    navigator.mediaDevices.getUserMedia({audio: true})
      .then((stream) => {
        this.stream = stream;

        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          alert('Browser not supported');
          return;
        }

        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
        });

        // Create URL with query parameters for Deepgram configuration
        const queryParams = new URLSearchParams(this.DEEPGRAM_OPTIONS as any).toString();
        const socketUrl = `wss://api.deepgram.com/v1/listen?${queryParams}`;

        this.socket = new WebSocket(socketUrl, [
          'token',
          this.DEEPGRAM_API_KEY,
        ]);

        this.socket.onopen = () => {
          this.zone.run(() => {
            this.status = 'Connected';
            this.isRecording = true;
            console.log({event: 'onopen'});

            // Collect audio data for playback
            this.mediaRecorder?.addEventListener('dataavailable', async (event) => {
              if (event.data.size > 0) {
                // Store audio chunk for playback
                this.audioChunks.push(event.data);

                // Send data to Deepgram for transcription
                if (this.socket && this.socket.readyState === 1) {
                  this.socket.send(event.data);
                }
              }
            });

            this.mediaRecorder?.start(250); // Smaller chunks for more frequent updates
          });
        };

        this.socket.onmessage = (message) => {
          const received = JSON.parse(message.data);
          const transcript = received.channel.alternatives[0].transcript;

          if (transcript) {
            this.zone.run(() => {
              // If final, add to full transcript
              if (received.is_final) {
                console.log('Final:', transcript);
                this.fullTranscript += transcript + ' ';
                this.interimTranscript = '';
              } else {
                // For interim results, update interim display
                console.log('Interim:', transcript);
                this.interimTranscript = transcript;
              }
              this.cdr.detectChanges();
            });
          }
        };

        this.socket.onclose = () => {
          this.zone.run(() => {
            console.log({event: 'onclose'});
            this.isRecording = false;
            this.status = 'Disconnected';
            // Add any remaining interim transcript to the full transcript
            if (this.interimTranscript) {
              this.fullTranscript += this.interimTranscript + ' ';
              this.interimTranscript = '';
            }
          });
        };

        this.socket.onerror = (error) => {
          this.zone.run(() => {
            console.log({event: 'onerror', error});
            this.status = 'Error';
          });
        };
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
        this.status = 'Error: ' + error.message;
      });
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();

      // Process audio data when recording stops
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

    // Add any remaining interim transcript to the full transcript
    if (this.interimTranscript) {
      this.fullTranscript += this.interimTranscript + ' ';
      this.interimTranscript = '';
    }
  }

  processAudio(): void {
    // Create blob from audio chunks
    if (this.audioChunks.length) {
      this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

      // Create URL for audio playback
      this.audioUrl = URL.createObjectURL(this.audioBlob);
      if (this.audioElement) {
        this.audioElement.src = this.audioUrl;
      }

      this.isAudioAvailable = true;
      this.cdr.detectChanges();
    }
  }

  cleanupAudio(): void {
    // Revoke previous audio URL to prevent memory leaks
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
  }

  // Function to get the complete transcript (both final and interim parts)
  get completeTranscript(): string {
    return this.fullTranscript + (this.interimTranscript ? this.interimTranscript : '');
  }

  // Function to save transcript to file
  saveTranscript(): void {
    const text = this.completeTranscript;
    const blob = new Blob([text], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);

    // Create a download link and trigger it
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `transcript-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Function to save audio as MP3
  saveAudio(): void {
    if (!this.audioBlob) return;

    // Convert audio to MP3 format
    this.convertToMp3(this.audioBlob).then(mp3Blob => {
      const url = URL.createObjectURL(mp3Blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${timestamp}.mp3`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }).catch(error => {
      console.error('Error converting to MP3:', error);
      alert('Could not convert to MP3. Downloading as WebM instead.');

      // Fallback to WebM if MP3 conversion fails
      this.downloadWebmAudio();
    });
  }

  // Fallback download as WebM
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

  // Convert WebM to MP3 using Web Audio API
  async convertToMp3(webmBlob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // For simplicity, we're using FFmpeg.wasm or similar libraries
      // This is a placeholder implementation - in production, you would use a proper audio conversion library
      console.log('Converting to MP3...');

      // Since we can't directly convert to MP3 in the browser without additional libraries,
      // we'll implement a placeholder for now and return the original blob
      // In a real implementation, you would use a library like FFmpeg.wasm or a server-side conversion

      // Placeholder example - would need to be replaced with actual conversion logic
      setTimeout(() => {
        resolve(webmBlob); // Return original blob as placeholder
      }, 500);
    });
  }

  // Save both transcript and audio
  saveBoth(): void {
    this.saveTranscript();
    this.saveAudio();
  }
}
