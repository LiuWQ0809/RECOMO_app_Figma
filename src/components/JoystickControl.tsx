export default function JoystickControl() {
  return (
    <div className="relative w-full aspect-square max-w-[180px]">
      {/* Joystick Base */}
      <div className="absolute inset-0 rounded-full bg-white/[0.08] border-2 border-white/[0.12]" />
      
      {/* Direction Indicators */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 micro text-tertiary">
        Tilt ↑
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 micro text-tertiary">
        ↓
      </div>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 micro text-tertiary">
        ← Pan
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 micro text-tertiary">
        →
      </div>
      
      {/* Center Cross */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-px h-full bg-white/10" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-px w-full bg-white/10" />
      </div>
      
      {/* Joystick Handle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-brand-gradient shadow-[0_4px_16px_rgba(0,168,232,0.4)] cursor-move active:scale-95 transition-all flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
