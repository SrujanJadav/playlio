import { useAudio } from "../context/AudioContext";
import "./PixelSpeaker.css";

export default function PixelSpeaker() {
  const { isMuted, toggleMute, category } = useAudio();

  // If no category is playing, don't show the speaker button
  // (Or we can show it globally so the user can set their preference beforehand)
  // Let's show it globally so they can pre-mute/unmute as they wish!

  return (
    <button
      onClick={toggleMute}
      className={`pixel-speaker-btn ${isMuted ? "muted" : "unmuted"}`}
      title={isMuted ? "Unmute Background Music" : "Mute Background Music"}
    >
      <div className="pixel-speaker-icon-wrapper">
        <svg
          viewBox="0 0 16 16"
          className="pixel-speaker-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Speaker Outer Outline */}
          <path d="M 1 5 h 4 v -2 h 3 v 10 h -3 v -2 h -4 z" fill="#080c18" />
          
          {/* Speaker Inner Fill */}
          <path d="M 2 6 h 3 v 4 h -3 z" fill="#3a7dff" />
          <path d="M 5 4 h 1 v 8 h -1 z" fill="#84c8ff" />
          <path d="M 6 3 h 1 v 10 h -1 z" fill="#ffffff" />
          
          {/* Sound Waves (Interactive Groups) */}
          
          {/* Wave 1 (Inner) */}
          <g className="wave-group wave-group-1">
            <rect x="8" y="6" width="3" height="5" fill="#080c18" />
            <rect x="9" y="7" width="1" height="3" fill="#84c8ff" />
          </g>
          
          {/* Wave 2 (Middle) */}
          <g className="wave-group wave-group-2">
            <rect x="10" y="4" width="3" height="9" fill="#080c18" />
            <rect x="11" y="5" width="1" height="7" fill="#ffffff" />
          </g>
          
          {/* Wave 3 (Outer) */}
          <g className="wave-group wave-group-3">
            <rect x="10" y="4" width="3" height="9" fill="#080c18" />
            <rect x="11" y="5" width="1" height="7" fill="#ffffff" />
          </g>
        </svg>
      </div>
    </button>
  );
}
