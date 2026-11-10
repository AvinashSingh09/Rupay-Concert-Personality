import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Camera, Upload, Sparkles, AlertCircle, Download, Share2 } from 'lucide-react';
import { PERSONALITIES } from './data/personalities';
import {
  RuPayHeaderLogo,
  RuPayPhotoWatermark,
  ConcertPersonalityTitle,
  BackButton,
  StepIcons,
} from './components/BrandElements';
import {
  generateConcertAvatar,
  createBrandedDownloadDataUrl,
} from './services/openaiImageService';
import {
  uploadAvatarToCloudinary,
  downloadPhotoToDevice,
} from './services/cloudinaryService';

/**
 * Guest Mobile Landing Page (opened when scanning the QR code on a user's phone)
 * URL format: /?photo=<cloudinary_secure_url>&vibe=<personality_id>
 */
function GuestPhotoDownloadView({ photoUrl, personalityId }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const matchedPersonality =
    PERSONALITIES.find((p) => p.id === personalityId) || PERSONALITIES[4];

  const filename = `RuPay-Concert-Avatar-${matchedPersonality.id}.png`;

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadPhotoToDevice(photoUrl, filename);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    try {
      const response = await fetch(photoUrl, { mode: 'cors' });
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type || 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My RuPay Concert Personality Avatar',
          text: `Check out my ${matchedPersonality.name} Concert Avatar! #RuPay #OwnTheEdge`,
          files: [file],
        });
        return;
      }
      if (navigator.share) {
        await navigator.share({
          title: 'My RuPay Concert Personality Avatar',
          url: window.location.href,
        });
      }
    } catch {
      // User cancelled share sheet
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between w-full h-full max-w-[920px] mx-auto px-[6vw] pt-[3.5vh] pb-[4.5vh] text-center select-none animate-fadeIn">
      {/* Top Branding & Brush Title */}
      <div className="flex flex-col items-center w-full">
        <RuPayHeaderLogo compact />
        <ConcertPersonalityTitle compact />

        <div className="mt-[1vh] flex flex-col items-center">
          <p className="text-[clamp(14px,2.5vw,28px)] font-extrabold uppercase tracking-[0.06em] text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            YOUR CONCERT AVATAR
          </p>
          <p className="font-brush text-[clamp(24px,4.4vw,48px)] uppercase tracking-wider text-gradient-personality leading-tight -rotate-1">
            IS READY!
          </p>
        </div>
      </div>

      {/* Personality Badge + Framed Image Preview */}
      <div className="w-full flex flex-col items-center my-[1.5vh]">
        <div className="photobooth-glass rounded-full px-[5vw] py-[1vh] mb-[2vh] text-center">
          <span className="text-[clamp(11px,1.8vw,20px)] text-purple-200/90 font-medium mr-2">
            Vibe:
          </span>
          <span className="text-[clamp(13px,2.2vw,24px)] font-extrabold uppercase tracking-wider text-white">
            {matchedPersonality.name}
          </span>
        </div>

        <div className="relative w-[94%] max-h-[44vh] aspect-[1.22/1] rounded-[6px] overflow-hidden border-[2px] border-purple-400/80 shadow-[0_0_35px_rgba(244,102,181,0.4)] bg-[#12072b]">
          <img
            src={photoUrl}
            alt="Your RuPay Concert Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Download & Share Action Buttons */}
      <div className="w-full flex flex-col items-center gap-[1.8vh] mt-[1vh]">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-[88%] py-[2.2vh] px-6 rounded-full bg-rupay-pill text-[#160836] font-extrabold text-[clamp(14px,2.7vw,28px)] tracking-[0.06em] uppercase flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-60"
        >
          <Download className="w-[clamp(18px,3vw,32px)] h-[clamp(18px,3vw,32px)] stroke-[2.5]" />
          <span>{isDownloading ? 'DOWNLOADING...' : 'DOWNLOAD PHOTO'}</span>
        </button>

        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-[70%] py-[1.5vh] px-5 rounded-full photobooth-glass hover:border-pink-400/70 text-white font-bold text-[clamp(12px,2.1vw,22px)] tracking-wider uppercase flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Share2 className="w-[clamp(15px,2.5vw,26px)] h-[clamp(15px,2.5vw,26px)] text-pink-300" />
            <span>SHARE PHOTO</span>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Step 1: Welcome / Start Experience
 */
function WelcomeView({ onStart }) {
  const steps = [
    {
      icon: <StepIcons.Personality />,
      label: 'CHOOSE\nYOUR\nPERSONALITY',
    },
    {
      icon: <StepIcons.Selfie />,
      label: 'TAKE\nA SELFIE',
    },
    {
      icon: <StepIcons.Wand />,
      label: 'CREATE\nYOUR CONCERT\nAVATAR',
    },
    {
      icon: <StepIcons.Share />,
      label: 'DOWNLOAD\nAND\nSHARE',
    },
  ];

  return (
    <div className="relative z-10 flex flex-col items-center justify-between w-full h-full max-w-[920px] mx-auto px-[6vw] pt-[5vh] pb-[5vh] text-center select-none animate-fadeIn">
      {/* Top Branding & Brush Title */}
      <div className="flex flex-col items-center w-full mt-[1vh]">
        <RuPayHeaderLogo />
        <div className="mt-[1.5vh]">
          <ConcertPersonalityTitle />
        </div>
      </div>

      {/* Center spacer so concert stage & lasers remain visible */}
      <div className="flex-1" />

      {/* Bottom 4-step box + Start CTA */}
      <div className="w-full flex flex-col items-center gap-[2.6vh]">
        <div className="w-full photobooth-glass rounded-[6px] py-[2.2vh] px-[1.5vw] grid grid-cols-4 divide-x divide-purple-400/35">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-start px-[1.5vw] text-center"
            >
              <div className="flex items-center justify-center mb-[1.2vh] opacity-95">
                {step.icon}
              </div>
              <p className="text-[clamp(8.5px,1.65vw,18px)] leading-[1.3] font-bold tracking-[0.04em] text-purple-100/95 uppercase whitespace-pre-line">
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="w-[88%] py-[2.2vh] px-6 rounded-full bg-rupay-pill text-[#160836] font-extrabold text-[clamp(14px,2.8vw,30px)] tracking-[0.06em] uppercase flex items-center justify-center gap-3 transition-transform active:scale-95"
        >
          <span>START EXPERIENCE</span>
          <span className="text-[1.2em] leading-none font-bold">→</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Step 2: Choose Your Vibe / Personality Selection
 */
function PersonalityView({
  selectedPersonality,
  onSelectPersonality,
  onBack,
  onContinue,
}) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-between w-full h-full max-w-[920px] mx-auto px-[6vw] pt-[3.2vh] pb-[4.5vh] select-none animate-fadeIn">
      {/* Top Back Button & Fullscreen Logo Toggle */}
      <div className="w-full flex items-center justify-between">
        <BackButton onClick={onBack} />
        <RuPayHeaderLogo compact />
        <div className="w-[clamp(38px,6.5vw,64px)]" aria-hidden="true" />
      </div>

      {/* Section Title */}
      <h2 className="text-[clamp(12.5px,2.4vw,26px)] font-extrabold tracking-[0.08em] uppercase text-white text-center my-[1vh] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
        CHOOSE YOUR VIBE. OWN THE EDGE.
      </h2>

      {/* 6 Personality Cards */}
      <div className="w-[88%] flex-1 flex flex-col justify-center gap-[1.3vh] my-[0.5vh]">
        {PERSONALITIES.map((item) => {
          const isSelected = selectedPersonality?.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPersonality(item)}
              className={`w-full py-[1.6vh] px-[3vw] rounded-[5px] text-center transition-all duration-200 ${
                isSelected
                  ? 'photobooth-glass-active scale-[1.02]'
                  : 'photobooth-glass hover:border-purple-300/80 hover:bg-[#271352]/80'
              }`}
            >
              <div className="text-[clamp(11.5px,2.2vw,24px)] font-extrabold uppercase tracking-[0.05em] text-white leading-tight">
                {item.name}
              </div>
              <div className="text-[clamp(10px,1.85vw,20px)] font-medium text-purple-200/90 leading-[1.28] mt-[0.3vh] whitespace-pre-line">
                {item.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full flex justify-center mt-[1vh]">
        <button
          type="button"
          onClick={onContinue}
          className="w-[90%] py-[2.2vh] px-6 rounded-full bg-rupay-pill text-[#160836] font-extrabold text-[clamp(14px,2.7vw,28px)] tracking-[0.05em] uppercase flex items-center justify-center gap-3 transition-transform active:scale-95"
        >
          <span>CONTINUE TO CAMERA</span>
          <span className="text-[1.2em] leading-none font-bold">→</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Step 3: Camera / Selfie Capture
 */
function CameraView({
  selectedPersonality,
  capturedSelfie,
  onCaptureSelfie,
  onRetake,
  onSubmit,
  onBack,
  isGenerating,
  generationStepText,
  errorMsg,
}) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cameraAttempt, setCameraAttempt] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || capturedSelfie) return;

    let active = true;
    let stream;
    setCameraReady(false);
    setCameraError('');
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false,
        });
        if (active) {
          video.srcObject = stream;
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch {
        if (active)
          setCameraError(
            'Camera unavailable. Upload a well-lit, front-facing selfie of one person.'
          );
      }
    };
    startCamera();

    return () => {
      active = false;
      stream?.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    };
  }, [capturedSelfie, cameraAttempt]);

  const handleShutterClick = () => {
    if (isGenerating) return;

    const video = videoRef.current;
    if (!cameraReady || !video?.videoWidth || !video.videoHeight || video.readyState < 2) {
      fileInputRef.current?.click();
      return;
    }

    const previewRatio = video.clientWidth / video.clientHeight;
    const cropWidth = Math.min(video.videoWidth, video.videoHeight * previewRatio);
    const cropHeight = Math.min(video.videoHeight, video.videoWidth / previewRatio);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(cropWidth);
    canvas.height = Math.round(cropHeight);
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      video,
      (video.videoWidth - cropWidth) / 2,
      (video.videoHeight - cropHeight) / 2,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 180);
    onCaptureSelfie(canvas.toDataURL('image/jpeg', 0.94));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onCaptureSelfie(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between w-full h-full max-w-[920px] mx-auto px-[6vw] pt-[3.2vh] pb-[4.2vh] select-none animate-fadeIn">
      {/* Top Back Button & Fullscreen Logo Toggle */}
      <div className="w-full flex items-center justify-between">
        <BackButton onClick={onBack} disabled={isGenerating} />
        <RuPayHeaderLogo compact />
        <div className="w-[clamp(38px,6.5vw,64px)]" aria-hidden="true" />
      </div>

      {/* Selected Personality Pill */}
      <div className="photobooth-glass rounded-full px-[7vw] py-[1.3vh] text-center min-w-[52%]">
        <div className="text-[clamp(11px,1.9vw,20px)] font-medium text-purple-200/90 leading-tight">
          Selected Personality:
        </div>
        <div className="text-[clamp(15px,2.8vw,30px)] font-extrabold uppercase tracking-[0.04em] text-white leading-snug mt-0.5">
          {selectedPersonality?.name || 'FOODIE'}
        </div>
      </div>

      {/* Center Black Square/Portrait Viewfinder Frame */}
      <div className="relative w-[90%] max-h-[55vh] aspect-[1/1.08] bg-black rounded-[4px] overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.85)] border border-purple-500/30 flex items-center justify-center my-[1vh]">
        {!capturedSelfie && (
          <video
            ref={videoRef}
            onCanPlay={() => setCameraReady(true)}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${
              cameraReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {capturedSelfie && (
          <img
            src={capturedSelfie}
            alt="Captured Selfie"
            className="w-full h-full object-cover"
          />
        )}

        {!capturedSelfie && !cameraReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black">
            <div className="w-[clamp(56px,10vw,96px)] h-[clamp(56px,10vw,96px)] rounded-full bg-purple-950/60 border border-purple-500/40 flex items-center justify-center mb-4 text-purple-300">
              <Camera className="w-[45%] h-[45%]" />
            </div>
            <p className="text-[clamp(12px,2vw,20px)] text-purple-200/80 font-medium max-w-[75%] mb-4">
              {cameraError || 'Center your face and look toward the camera.'}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-[4vw] py-[1.2vh] rounded-full bg-purple-900/70 hover:bg-purple-800/80 border border-purple-400/50 text-[clamp(12px,2vw,20px)] font-bold uppercase tracking-wider text-purple-100 flex items-center gap-2 transition"
            >
              <Upload className="w-[clamp(14px,2.2vw,22px)] h-[clamp(14px,2.2vw,22px)]" />
              <span>Upload Photo</span>
            </button>
          </div>
        )}

        {!capturedSelfie && cameraReady && (
          <div className="absolute inset-0 pointer-events-none">
            <p className="absolute top-3 inset-x-4 text-center text-[clamp(11px,1.8vw,18px)] text-white bg-black/65 rounded-full px-3 py-1">
              Fit one face inside the oval and face the light.
            </p>
            <div
              aria-hidden="true"
              className="absolute top-[19%] inset-x-[27%] h-[55%] rounded-[50%] border-2 border-dashed border-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
            />
          </div>
        )}

        {!capturedSelfie && cameraReady && !isGenerating && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-black/65 hover:bg-black/85 border border-white/20 text-[clamp(10px,1.6vw,16px)] font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1.5 backdrop-blur-sm transition"
          >
            <Upload className="w-[clamp(12px,1.8vw,18px)] h-[clamp(12px,1.8vw,18px)]" />
            <span>Upload</span>
          </button>
        )}

        {flashActive && (
          <div className="absolute inset-0 bg-white z-30 animate-ping pointer-events-none" />
        )}

        {isGenerating && (
          <div className="absolute inset-0 z-20 bg-[#0d0522]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-5">
              <div className="w-[clamp(64px,11vw,110px)] h-[clamp(64px,11vw,110px)] rounded-full border-4 border-pink-500/30 border-t-cyan-300 animate-spin" />
              <Sparkles className="w-[42%] h-[42%] text-pink-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-[clamp(14px,2.5vw,26px)] font-extrabold uppercase tracking-wider text-white mb-1.5">
              Creating Your Concert Avatar...
            </p>
            <p className="text-[clamp(12px,2vw,20px)] text-purple-200/85 max-w-[75%] leading-relaxed">
              {generationStepText || `Styling your ${selectedPersonality?.name} vibe...`}
            </p>
          </div>
        )}

        {errorMsg && !isGenerating && (
          <div
            role="alert"
            className="absolute inset-x-3 bottom-3 z-20 bg-[#230b38]/95 border border-pink-500/70 rounded-md p-3.5 text-left shadow-lg"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <p className="text-[clamp(12px,1.9vw,18px)] font-bold text-pink-200 leading-snug">
                {errorMsg}
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Bottom Camera Controls: RETAKE | SHUTTER | SUBMIT */}
      <div className="w-[92%] flex items-center justify-between gap-[3vw] mt-[0.5vh]">
        <button
          type="button"
          onClick={() => {
            onRetake();
            setCameraAttempt((attempt) => attempt + 1);
          }}
          disabled={isGenerating}
          className="flex-1 py-[1.6vh] px-4 rounded-full bg-rupay-pill text-[#160836] font-extrabold text-[clamp(11.5px,2.2vw,23px)] tracking-[0.04em] uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
        >
          <span className="text-[1.15em] leading-none">↻</span>
          <span>RETAKE</span>
        </button>

        <button
          type="button"
          onClick={handleShutterClick}
          disabled={isGenerating}
          aria-label="Take Photo"
          className="w-[clamp(64px,11.5vw,116px)] h-[clamp(64px,11.5vw,116px)] rounded-full shutter-ring p-[4px] shadow-[0_0_24px_rgba(167,220,255,0.65)] transition-transform active:scale-90 shrink-0 disabled:opacity-50"
        >
          <div className="w-full h-full rounded-full bg-[#a8ccf0] hover:bg-[#bad8f7] border-2 border-white/80 transition-colors" />
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!capturedSelfie || isGenerating}
          className="flex-1 py-[1.6vh] px-4 rounded-full bg-rupay-pill text-[#160836] font-extrabold text-[clamp(11.5px,2.2vw,23px)] tracking-[0.04em] uppercase flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
        >
          <span className="text-[1.05em] leading-none">&gt;</span>
          <span>SUBMIT</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Step 4: Result / Avatar Ready
 */
function ResultView({
  generatedAvatar,
  cloudinaryUrl,
  selectedPersonality,
  onDone,
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const displayImage = generatedAvatar;

  useEffect(() => {
    let active = true;
    const generateQr = async () => {
      try {
        const shareUrl = cloudinaryUrl
          ? `${window.location.origin}/?photo=${encodeURIComponent(
              cloudinaryUrl
            )}&vibe=${encodeURIComponent(selectedPersonality?.id || 'foodie')}`
          : `${window.location.origin}/?vibe=${encodeURIComponent(
              selectedPersonality?.id || 'foodie'
            )}`;

        const url = await QRCode.toDataURL(shareUrl, {
          width: 280,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        if (active) setQrDataUrl(url);
      } catch (e) {
        console.error('QR generation error:', e);
      }
    };
    generateQr();
    return () => {
      active = false;
    };
  }, [cloudinaryUrl, selectedPersonality]);

  const handleDownloadPhoto = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const filename = `RuPay-Concert-Avatar-${(
        selectedPersonality?.id || 'foodie'
      ).toLowerCase()}.png`;

      if (cloudinaryUrl) {
        await downloadPhotoToDevice(cloudinaryUrl, filename);
      } else {
        const brandedDataUrl = await createBrandedDownloadDataUrl(displayImage);
        const link = document.createElement('a');
        link.href = brandedDataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between w-full h-full max-w-[920px] mx-auto px-[6vw] pt-[3.5vh] pb-[4.2vh] text-center select-none animate-fadeIn">
      {/* Top Branding & Brush Title */}
      <div className="flex flex-col items-center w-full">
        <RuPayHeaderLogo compact />
        <ConcertPersonalityTitle compact />

        <div className="mt-[0.8vh] flex flex-col items-center">
          <p className="text-[clamp(14px,2.6vw,28px)] font-extrabold uppercase tracking-[0.06em] text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            YOUR CONCERT AVATAR
          </p>
          <p className="font-brush text-[clamp(24px,4.5vw,48px)] uppercase tracking-wider text-gradient-personality leading-tight -rotate-1">
            IS READY!
          </p>
        </div>
      </div>

      {/* Framed Generated Concert Avatar */}
      <div className="relative w-[94%] max-h-[42vh] aspect-[1.22/1] rounded-[5px] overflow-hidden border-[2px] border-purple-400/80 shadow-[0_0_32px_rgba(244,102,181,0.35)] my-[1vh] bg-[#12072b]">
        <img
          src={displayImage}
          alt="Your Concert Avatar"
          className="w-full h-full object-cover"
        />
        <RuPayPhotoWatermark />
      </div>

      {/* QR Code & Download Box */}
      <div className="w-[82%] photobooth-glass rounded-[6px] p-[1.8vh] flex items-center justify-between gap-[3vw]">
        <div className="w-[clamp(64px,12.5vw,136px)] h-[clamp(64px,12.5vw,136px)] bg-white p-1.5 rounded-[4px] shrink-0 flex items-center justify-center shadow-inner">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Scan QR to download"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
        </div>

        <button
          type="button"
          onClick={handleDownloadPhoto}
          className="flex-1 flex flex-col items-center justify-center text-center group cursor-pointer py-1"
          title="Download your concert photo"
        >
          <div className="w-[clamp(24px,4.2vw,44px)] h-[clamp(24px,4.2vw,44px)] flex items-center justify-center text-purple-200 group-hover:text-pink-300 group-hover:translate-y-0.5 transition-all mb-1.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
          </div>
          <span className="text-[clamp(9.5px,1.8vw,20px)] font-extrabold uppercase tracking-[0.05em] text-white group-hover:text-pink-200 leading-[1.3] whitespace-pre-line">
            {isDownloading ? 'PREPARING PHOTO...' : 'SCAN TO DOWNLOAD\nYOUR PHOTO'}
          </span>
        </button>
      </div>

      {/* Bottom DONE Button */}
      <button
        type="button"
        onClick={onDone}
        className="mt-[0.5vh] px-[7vw] py-[1.6vh] rounded-full bg-rupay-pill text-[#160836] font-extrabold text-[clamp(12px,2.2vw,24px)] tracking-[0.05em] uppercase flex items-center justify-center gap-2.5 transition-transform active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[clamp(14px,2.4vw,26px)] h-[clamp(14px,2.4vw,26px)]"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>DONE</span>
      </button>
    </div>
  );
}

export default function App() {
  // Check if opened via QR scan on a guest's phone: /?photo=<cloudinary_url>&vibe=<id>
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const sharedPhotoUrl = searchParams?.get('photo');
  const sharedVibeId = searchParams?.get('vibe') || 'foodie';

  const [step, setStep] = useState(1);
  const [selectedPersonality, setSelectedPersonality] = useState(PERSONALITIES[4]);
  const [capturedSelfie, setCapturedSelfie] = useState(null);
  const [generatedAvatar, setGeneratedAvatar] = useState(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepText, setGenerationStepText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerateAvatar = async () => {
    if (!capturedSelfie || isGenerating) return;

    setErrorMsg('');
    setIsGenerating(true);
    setGenerationStepText(`Styling your ${selectedPersonality.name} vibe...`);

    try {
      const result = await generateConcertAvatar({
        selfieDataUrl: capturedSelfie,
        personality: selectedPersonality,
      });

      setGeneratedAvatar(result.imageUrl);

      // Composite the RuPay branding onto the image and upload to Cloudinary for QR sharing
      setGenerationStepText('Preparing your QR download link...');
      try {
        const brandedDataUrl = await createBrandedDownloadDataUrl(result.imageUrl);
        const uploaded = await uploadAvatarToCloudinary(brandedDataUrl);
        setCloudinaryUrl(uploaded.secureUrl);
      } catch (cloudErr) {
        if (cloudErr.message !== 'CLOUDINARY_NOT_CONFIGURED') {
          console.warn('Cloudinary upload warning:', cloudErr);
        }
        setCloudinaryUrl(null);
      }

      setStep(4);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStepText('');
    }
  };

  const handleReset = () => {
    setCapturedSelfie(null);
    setGeneratedAvatar(null);
    setCloudinaryUrl(null);
    setErrorMsg('');
    setStep(1);
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-[#0c0521] text-white overflow-hidden">
      {/* Full-Bleed Edge-to-Edge Photobooth Canvas */}
      <main className="relative w-full h-full bg-[#0c0521] overflow-hidden">
        {/* Sharp Concert Stage Background Filling 100% Width & Height */}
        <img
          src="/assets/concert-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />

        {/* Subtle top/bottom gradient vignette for text clarity */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(11,5,32,0.55) 0%, rgba(11,5,32,0.12) 40%, rgba(11,5,32,0.25) 75%, rgba(8,3,22,0.65) 100%)',
          }}
        />

        {sharedPhotoUrl ? (
          <GuestPhotoDownloadView
            photoUrl={sharedPhotoUrl}
            personalityId={sharedVibeId}
          />
        ) : (
          <>
            {step === 1 && <WelcomeView onStart={() => setStep(2)} />}

            {step === 2 && (
              <PersonalityView
                selectedPersonality={selectedPersonality}
                onSelectPersonality={(p) => setSelectedPersonality(p)}
                onBack={() => setStep(1)}
                onContinue={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <CameraView
                selectedPersonality={selectedPersonality}
                capturedSelfie={capturedSelfie}
                onCaptureSelfie={(dataUrl) => {
                  setCapturedSelfie(dataUrl);
                  setErrorMsg('');
                }}
                onRetake={() => {
                  setCapturedSelfie(null);
                  setErrorMsg('');
                }}
                onSubmit={handleGenerateAvatar}
                onBack={() => setStep(2)}
                isGenerating={isGenerating}
                generationStepText={generationStepText}
                errorMsg={errorMsg}
              />
            )}

            {step === 4 && (
              <ResultView
                generatedAvatar={generatedAvatar}
                cloudinaryUrl={cloudinaryUrl}
                selectedPersonality={selectedPersonality}
                onDone={handleReset}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
