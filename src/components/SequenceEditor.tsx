import { useState } from 'react';
import { Plus, GripVertical, Trash2, Play, Save, ArrowLeft, Clock, Zap } from 'lucide-react';

interface Shot {
  id: string;
  name: string;
  keyframes: any[];
  duration: number;
  createdAt: string;
}

interface SequenceShot extends Shot {
  speed: number; // 0.5x - 2x
  delay: number; // seconds before this shot
}

interface SequenceEditorProps {
  savedShots: Shot[];
  onSave: (sequence: any) => void;
  onBack: () => void;
}

export default function SequenceEditor({ savedShots, onSave, onBack }: SequenceEditorProps) {
  const [sequenceName, setSequenceName] = useState('');
  const [selectedShots, setSelectedShots] = useState<SequenceShot[]>([]);
  const [showShotPicker, setShowShotPicker] = useState(false);

  const addShot = (shot: Shot) => {
    setSelectedShots([
      ...selectedShots,
      { ...shot, speed: 1.0, delay: 0 }
    ]);
    setShowShotPicker(false);
  };

  const removeShot = (index: number) => {
    setSelectedShots(selectedShots.filter((_, i) => i !== index));
  };

  const updateShotSpeed = (index: number, speed: number) => {
    const updated = [...selectedShots];
    updated[index].speed = speed;
    setSelectedShots(updated);
  };

  const updateShotDelay = (index: number, delay: number) => {
    const updated = [...selectedShots];
    updated[index].delay = delay;
    setSelectedShots(updated);
  };

  const getTotalDuration = () => {
    return selectedShots.reduce((total, shot) => {
      return total + (shot.duration / shot.speed) + shot.delay;
    }, 0);
  };

  const handleSave = () => {
    if (sequenceName.trim() && selectedShots.length > 0) {
      const sequence = {
        id: Date.now().toString(),
        name: sequenceName,
        shots: selectedShots,
        totalDuration: getTotalDuration(),
        createdAt: new Date().toISOString()
      };
      onSave(sequence);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex-none px-4 py-3 border-b border-white/[0.08]" style={{ paddingTop: 'calc(44px + 12px)' }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/[0.08] flex items-center justify-center active:scale-90 transition-all">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="body-l font-bold text-white">Sequence 编排</h1>
          <button
            onClick={handleSave}
            disabled={!sequenceName.trim() || selectedShots.length === 0}
            className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5 text-white" />
          </button>
        </div>

        <input
          type="text"
          value={sequenceName}
          onChange={(e) => setSequenceName(e.target.value)}
          placeholder="输入 Sequence 名称..."
          className="w-full px-4 py-2.5 bg-white/[0.08] border border-white/[0.12] rounded-xl text-white caption placeholder:text-white/40 focus:outline-none focus:border-brand transition-all"
        />
      </div>

      {/* Sequence Timeline */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {selectedShots.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/[0.08] mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white/40" />
            </div>
            <p className="body text-white/60 mb-2">还没有添加 Shot</p>
            <p className="caption text-white/40">点击下方按钮添加 Shot 到 Sequence</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedShots.map((shot, index) => (
              <div key={`${shot.id}-${index}`} className="glass-card p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-none pt-1">
                    <GripVertical className="w-5 h-5 text-white/30" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="micro text-brand font-bold">#{index + 1}</span>
                          <span className="caption font-semibold text-white">{shot.name}</span>
                        </div>
                        <div className="micro text-white/50 mt-0.5">
                          {shot.keyframes.length} 个关键帧
                        </div>
                      </div>
                      <button
                        onClick={() => removeShot(index)}
                        className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center active:scale-90 transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
                      </button>
                    </div>

                    {/* Speed Control */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="micro text-white/60">播放速度</span>
                        <span className="micro text-brand font-bold">{shot.speed.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={shot.speed}
                        onChange={(e) => updateShotSpeed(index, parseFloat(e.target.value))}
                        className="w-full h-1"
                      />

                      <div className="flex items-center justify-between">
                        <span className="micro text-white/60">延迟时间</span>
                        <span className="micro text-brand font-bold">{shot.delay.toFixed(1)}s</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={shot.delay}
                        onChange={(e) => updateShotDelay(index, parseFloat(e.target.value))}
                        className="w-full h-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex-none px-4 py-4 border-t border-white/[0.08]" style={{ paddingBottom: 'calc(34px + 16px)' }}>
        {/* Duration Info */}
        {selectedShots.length > 0 && (
          <div className="glass-card p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" />
                <span className="caption text-white font-semibold">总时长</span>
              </div>
              <span className="caption text-brand font-bold">
                {Math.floor(getTotalDuration() / 60)}:{Math.floor(getTotalDuration() % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowShotPicker(true)}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>添加 Shot</span>
        </button>
      </div>

      {/* Shot Picker Modal */}
      {showShotPicker && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#1C1C1E] rounded-t-3xl border-t border-white/10 animate-slide-up max-h-[70vh] overflow-y-auto" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
            <div className="sticky top-0 bg-[#1C1C1E] px-5 pt-4 pb-3 border-b border-white/[0.06] z-10">
              <div className="flex items-center justify-between">
                <h3 className="body-l font-bold text-white">选择 Shot</h3>
                <button
                  onClick={() => setShowShotPicker(false)}
                  className="caption font-semibold text-brand"
                >
                  取消
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {savedShots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="caption text-white/60">还没有保存的 Shot</p>
                  <p className="micro text-white/40 mt-1">请先录制并保存 Shot</p>
                </div>
              ) : (
                savedShots.map((shot) => (
                  <button
                    key={shot.id}
                    onClick={() => addShot(shot)}
                    className="w-full solid-card-sm p-3 text-left active:scale-98 transition-all"
                  >
                    <div className="caption font-semibold text-white mb-1">{shot.name}</div>
                    <div className="flex items-center gap-3 micro text-white/50">
                      <span>{shot.keyframes.length} 关键帧</span>
                      <span>·</span>
                      <span>
                        {Math.floor(shot.duration / 60)}:{(shot.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
