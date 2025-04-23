import {Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-realtime-transcription',
  standalone: true,
  templateUrl: './realtime-transcription.component.html',
  imports: [
    NgIf,
    NgClass
  ],
  styleUrls: ['./realtime-transcription.component.scss']
})
export class RealtimeTranscriptionComponent implements OnInit, OnDestroy {
  status: string = 'Not Connected';
  fullTranscript: string = '';
  interimTranscript: string = '';
  isRecording: boolean = false;
  mediaRecorder: MediaRecorder | null = null;
  stream: MediaStream | null = null;
  socket: WebSocket | null = null;

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
  }

  ngOnDestroy(): void {
    this.stopRecording();
  }

  startRecording(): void {
    if (this.isRecording) return;

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

            this.mediaRecorder?.addEventListener('dataavailable', async (event) => {
              if (event.data.size > 0 && this.socket && this.socket.readyState === 1) {
                this.socket.send(event.data);
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
}
