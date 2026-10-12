import React, { useState, useRef, useEffect, useId } from 'react';
import {
  Mic,
  Square,
  Upload,
  Copy,
  Check,
  Search,
  MessageSquare,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface VoiceTranscriberProps {
  onSearchTranscript: (text: string) => void;
  onSendToChat: (text: string) => void;
}

export const VoiceTranscriber: React.FC<VoiceTranscriberProps> = ({
  onSearchTranscript,
  onSendToChat,
}) => {
  const audioFileInputId = useId();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === 'recording'
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4',
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });
        await processAndTranscribe(audioBlob, mediaRecorder.mimeType || 'audio/webm');
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err?.message ||
          'Microphone permission denied or not available. Please allow mic access.'
      );
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    processAndTranscribe(file, file.type || 'audio/mp3');
  };

  const processAndTranscribe = async (blob: Blob, mimeType: string) => {
    setTranscribing(true);
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;

        const res = await fetch('/api/gemini/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64data,
            mimeType: mimeType || 'audio/webm',
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to transcribe audio.');
        }

        const data = await res.json();
        setTranscript(data.transcript || 'No speech detected.');
        setTranscribing(false);
      };
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Error sending audio to Gemini transcribe.');
      setTranscribing(false);
    }
  };

  const copyTranscript = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section id="voice-transcribe" className="py-16 border-t border-slate-700/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3 mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Transcription</span>
            <span aria-hidden="true">·</span>
            <span>gemini-3.5-transcribe</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            Voice Memo & Strategy Transcriber
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Record publisher notes, client campaign requirements, or questions aloud. Model <span className="font-mono text-amber-300">gemini-3.5-transcribe</span> transcribes your audio instantaneously to search the guide or feed the AI strategist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recorder Controls */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-700 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="text-center space-y-4 py-4">
              <div className="relative inline-block">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping pointer-events-none" />
                )}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                      : 'bg-amber-600/20 border border-amber-500/40 text-amber-400'
                  }`}
                >
                  <Mic className="w-9 h-9" />
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {isRecording ? 'Listening to voice...' : 'Microphone Ready'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRecording
                    ? `Recording duration: ${formatSeconds(recordingSeconds)}`
                    : 'Click below to capture voice audio'}
                </p>
              </div>

              <div className="flex justify-center gap-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={transcribing}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop & Transcribe</span>
                  </button>
                )}
              </div>
            </div>

            {/* Alternative: Audio file upload */}
            <div className="pt-4 border-t border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Or upload pre-recorded audio:</span>
                <label
                  htmlFor={audioFileInputId}
                  className="cursor-pointer text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse audio file</span>
                </label>
                <input
                  id={audioFileInputId}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Supports .webm, .wav, .mp3, .m4a audio recordings up to 25MB.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Transcript Output Box */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-700 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl min-h-[290px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Transcription Output</span>
                </span>
                {transcript && (
                  <button
                    onClick={copyTranscript}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {transcribing ? (
                <div className="py-12 text-center space-y-3">
                  <Loader2 className="w-7 h-7 text-amber-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-300">
                    Transcribing speech with gemini-3.5-transcribe...
                  </p>
                </div>
              ) : transcript ? (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-700 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap min-h-[120px]">
                  {transcript}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-700 rounded-xl">
                  Transcribed voice audio will appear here in real-time.
                </div>
              )}
            </div>

            {/* Transcript Actions */}
            {transcript && (
              <div className="pt-4 border-t border-slate-700 flex flex-wrap gap-2.5">
                <button
                  onClick={() => onSearchTranscript(transcript)}
                  className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Search Guide for this Text</span>
                </button>
                <button
                  onClick={() => onSendToChat(transcript)}
                  className="px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant with Transcript</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
