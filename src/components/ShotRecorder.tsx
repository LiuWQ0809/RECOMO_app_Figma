import { useState } from 'react';
import { Circle, StopCircle, Bookmark, Save, X } from 'lucide-react';

interface Keyframe {
  timestamp: number;
  positions: {
    chassis: { x: number; y: number; rotation: number };
    arm: number[]; // 6 joint angles
  };
}

interface ShotRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSaveShot: (shot: any) => void;
  onClose: () => void;
}

export default function ShotRecorder({
  isRecording,
  onStartRecording,
  onStopRecording,
  onSaveShot,
  onClose
}: ShotRecorderProps) {
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [shotName, setShotName] = useState('');

  const handleAddKeyframe = () => {
    // Mock current position data
    const newKeyframe: Keyframe = {
      timestamp: recordingTime,
      positions: {
        chassis: { x: 0, y: 0, rotation: 0 },
        arm: [0, 45, -30, 0, 15, 0]
      }
    };
    setKeyframes([...keyframes, newKeyframe]);
  };

  const handleSave = () => {
    if (shotName.trim()) {
      const shot = {
        id: Date.now().toString(),
        name: shotName,
        keyframes,
        duration: recordingTime,
        createdAt: new Date().toISOString()
      };
      onSaveShot(shot);
      setShotName('');
      setKeyframes([]);
      setShowSaveDialog(false);
      onClose();
    }
  };

  return (
    <>
      {/* Recording Controls Overlay */}
      {isRecording && (
        <div className="absolute top-24 left-3 right-3 z-20">
          <div className="glass-card p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-pulse" />
                <span className="caption font-semibold text-white">录制中</span>
              </div>
              <span className="caption font-bold text-brand">
                {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddKeyframe}
                className="flex-1 py-2 bg-brand rounded-lg caption font-semibold text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Bookmark className="w-4 h-4" />
                <span>打点 ({keyframes.length})</span>
              </button>
              
              <button
                onClick={() => {
                  onStopRecording();
                  setShowSaveDialog(true);
                }}
                className="px-4 py-2 bg-[#FF6B6B] rounded-lg flex items-center justify-center active:scale-95 transition-all"
              >
                <StopCircle className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Keyframe List */}
            {keyframes.length > 0 && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="micro text-white/60 mb-1">关键帧</div>
                <div className="flex flex-wrap gap-1">
                  {keyframes.map((kf, idx) => (
                    <div key={idx} className="px-2 py-0.5 bg-white/10 rounded micro text-white">
                      {Math.floor(kf.timestamp / 60)}:{(kf.timestamp % 60).toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Shot Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#1C1C1E] rounded-t-3xl border-t border-white/10 animate-slide-up p-5" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="body-l font-bold text-white">保存 Shot</h3>
              <button onClick={() => setShowSaveDialog(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="caption text-white/70 mb-2 block">Shot 名称</label>
                <input
                  type="text"
                  value={shotName}
                  onChange={(e) => setShotName(e.target.value)}
                  placeholder="输入 Shot 名称..."
                  className="w-full px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl text-white caption placeholder:text-white/40 focus:outline-none focus:border-brand transition-all"
                  autoFocus
                />
              </div>

              <div className="bg-white/[0.06] rounded-xl p-3 border border-white/[0.08]">
                <div className="flex items-center justify-between caption text-white/70 mb-1">
                  <span>关键帧数量</span>
                  <span className="text-brand font-bold">{keyframes.length}</span>
                </div>
                <div className="flex items-center justify-between caption text-white/70">
                  <span>总时长</span>
                  <span className="text-brand font-bold">
                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 py-3 bg-white/[0.1] rounded-xl caption font-semibold text-white active:scale-95 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={!shotName.trim()}
                  className="flex-1 btn-primary-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>保存</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
