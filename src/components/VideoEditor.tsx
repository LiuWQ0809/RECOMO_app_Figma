import { useState } from 'react';
import { X, Play, Pause, Scissors, Download, Volume2, VolumeX, SkipBack, SkipForward, Sparkles, Wand2, Music as MusicIcon, Type, Sticker, Layers, Zap, RotateCcw, RotateCw, Maximize2, Minimize2, Filter, Palette, Sliders, Sun, Moon, Contrast, Droplets, Wind, TrendingUp, Copy, Trash2, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoEditorProps {
  onClose: () => void;
}

export default function VideoEditor({ onClose }: VideoEditorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(30); // 30秒视频
  const [activeTab, setActiveTab] = useState<'cut' | 'effects' | 'music' | 'text' | 'stickers'>('cut');
  const [volume, setVolume] = useState(80);
  const [selectedClip, setSelectedClip] = useState(0);

  const tabs = [
    { id: 'cut', label: '剪辑', icon: Scissors },
    { id: 'effects', label: '特效', icon: Sparkles },
    { id: 'music', label: '音乐', icon: MusicIcon },
    { id: 'text', label: '文字', icon: Type },
    { id: 'stickers', label: '贴纸', icon: Sticker },
  ];

  // Mock video clips
  const clips = [
    { id: 0, start: 0, end: 12, label: '片段 1' },
    { id: 1, start: 12, end: 22, label: '片段 2' },
    { id: 2, start: 22, end: 30, label: '片段 3' },
  ];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div 
        className="flex-none bg-black/90 backdrop-blur-md border-b border-white/10 z-20"
        style={{ paddingTop: 'max(44px, env(safe-area-inset-top))' }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <h2 className="text-white font-bold">视频编辑</h2>
          
          <button className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00A8E8] to-[#0080FF] text-white caption font-bold active:scale-95 transition-all">
            导出
          </button>
        </div>
      </div>

      {/* Video Preview Area */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
        {/* Video Container */}
        <div className="w-full aspect-video max-h-full relative bg-black">
          {/* Video Preview Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4">
                <Play className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <p className="text-white/50" style={{ fontSize: '14px' }}>视频预览</p>
            </div>
          </div>

          {/* Playback Controls Overlay */}
          <div className="absolute bottom-6 left-4 right-4 z-10">
            {/* Time Display */}
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-white font-mono bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg" style={{ fontSize: '13px' }}>
                {formatTime(currentTime)}
              </span>
              <span className="text-white/60 font-mono" style={{ fontSize: '13px' }}>
                {formatTime(duration)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-[#00A8E8] to-[#0080FF] rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <button className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all">
                <SkipBack className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-[#00A8E8] to-[#0080FF] flex items-center justify-center active:scale-90 transition-all shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-white" strokeWidth={2} fill="white" />
                ) : (
                  <Play className="w-7 h-7 text-white ml-0.5" strokeWidth={2} fill="white" />
                )}
              </button>
              
              <button className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all">
                <SkipForward className="w-5 h-5 text-white" strokeWidth={2} />
              </button>

              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all ml-2"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white/50" strokeWidth={2} />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Area */}
      <div className="flex-none bg-[#1A1A1A] border-t border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2.5 mb-3">
            <Layers className="w-5 h-5 text-brand" strokeWidth={2} />
            <span className="font-bold text-white" style={{ fontSize: '14px' }}>时间轴</span>
          </div>
          
          {/* Simple Timeline Visualization */}
          <div className="relative h-20 bg-black/40 rounded-xl border border-white/10 overflow-hidden">
            {/* Video Track */}
            <div className="absolute top-2 left-2 right-2 h-7 bg-gradient-to-r from-[#00A8E8]/40 to-[#0080FF]/40 rounded-lg border border-[#00A8E8]/60 flex items-center px-3">
              <span className="text-white font-bold" style={{ fontSize: '12px' }}>视频轨道</span>
            </div>
            
            {/* Audio Track */}
            <div className="absolute bottom-2 left-2 right-2 h-7 bg-gradient-to-r from-[#51CF66]/40 to-[#40C057]/40 rounded-lg border border-[#51CF66]/60 flex items-center px-3">
              <span className="text-white font-bold" style={{ fontSize: '12px' }}>音频轨道</span>
            </div>

            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Tool Tabs */}
      <div className="flex-none bg-[#0F0F0F] border-t border-white/10">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 flex flex-col items-center gap-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-white/10' : ''
                }`}
              >
                <Icon 
                  className={`w-5.5 h-5.5 ${isActive ? 'text-brand' : 'text-white/60'}`} 
                  strokeWidth={2} 
                />
                <span className={`font-semibold ${isActive ? 'text-white' : 'text-white/60'}`} style={{ fontSize: '12px' }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool Panel */}
      <div 
        className="flex-none bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border-t border-white/10"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
      >
        <div className="px-4 py-4">
          {activeTab === 'cut' && <CutTools />}
          {activeTab === 'effects' && <EffectsTools />}
          {activeTab === 'music' && <MusicTools />}
          {activeTab === 'text' && <TextTools />}
          {activeTab === 'stickers' && <StickersTools />}
        </div>
      </div>
    </div>
  );
}

// Tool Panels
function CutTools() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* 快速操作 */}
      <div className="grid grid-cols-2 gap-2">
        <button className="py-3 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.12] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-white/[0.12]">
          <Scissors className="w-4.5 h-4.5" strokeWidth={2} />
          分割
        </button>
        <button className="py-3 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.12] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-white/[0.12]">
          <Trash2 className="w-4.5 h-4.5" strokeWidth={2} />
          删除
        </button>
        <button className="py-3 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.12] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-white/[0.12]">
          <Copy className="w-4.5 h-4.5" strokeWidth={2} />
          复制
        </button>
        <button className="py-3 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.12] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-white/[0.12]">
          <RotateCcw className="w-4.5 h-4.5" strokeWidth={2} />
          撤销
        </button>
      </div>

      {/* AI智能功能 */}
      <div className="space-y-2">
        <button className="w-full py-3 bg-gradient-to-r from-[#00A8E8]/20 to-[#0080FF]/20 border border-[#00A8E8]/50 rounded-xl caption font-bold text-white active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,168,232,0.15)]">
          <Zap className="w-5 h-5 text-[#00A8E8]" strokeWidth={2.5} fill="#00A8E8" />
          AI智能剪辑
        </button>
        <button className="w-full py-2.5 bg-white/[0.06] rounded-lg caption font-semibold text-white/80 border border-white/[0.08] active:scale-95 transition-all flex items-center justify-center gap-2">
          <Wand2 className="w-4 h-4" strokeWidth={2} />
          自动识别精彩片段
        </button>
      </div>

      {/* 调整 */}
      <div className="pt-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="caption text-white/70">速度</span>
          <span className="micro text-brand font-bold">1.0x</span>
        </div>
        <div className="flex gap-2">
          {['0.5x', '1.0x', '1.5x', '2.0x'].map((speed) => (
            <button
              key={speed}
              className={`flex-1 py-1.5 rounded-lg caption font-semibold transition-all ${
                speed === '1.0x'
                  ? 'bg-brand text-white'
                  : 'bg-white/[0.06] text-white/60 border border-white/[0.08]'
              }`}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EffectsTools() {
  const effects = [
    { name: '复古', icon: Sun, color: '#FFB800' },
    { name: '黑白', icon: Moon, color: '#FFFFFF' },
    { name: '鲜艳', icon: Palette, color: '#FF6B6B' },
    { name: '模糊', icon: Droplets, color: '#00A8E8' },
    { name: '锐化', icon: TrendingUp, color: '#51CF66' },
    { name: '暖色', icon: Sun, color: '#FFB800' },
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* 滤镜预设 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="caption text-white/70 font-semibold">滤镜</span>
          <button className="caption text-brand font-bold">全部 ›</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {effects.map((effect) => {
            const Icon = effect.icon;
            return (
              <button
                key={effect.name}
                className="py-2.5 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.12] active:scale-95 transition-all flex flex-col items-center gap-1.5 hover:bg-white/[0.12] hover:border-white/[0.20]"
              >
                <Icon className="w-5 h-5" strokeWidth={2} style={{ color: effect.color }} />
                <span className="micro">{effect.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 调整参数 */}
      <div className="space-y-2.5 pt-1">
        {[
          { label: '亮度', icon: Sun, value: 50 },
          { label: '对比度', icon: Contrast, value: 50 },
          { label: '饱和度', icon: Droplets, value: 50 },
        ].map((param) => {
          const Icon = param.icon;
          return (
            <div key={param.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-white/60" strokeWidth={2} />
                  <span className="caption text-white/70">{param.label}</span>
                </div>
                <span className="micro text-white font-mono">{param.value}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.10] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand to-[#0080FF] rounded-full"
                  style={{ width: `${param.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MusicTools() {
  const musicTracks = [
    { name: 'Upbeat Pop', bpm: 120, duration: '2:30', popular: true },
    { name: 'Chill Vibes', bpm: 90, duration: '3:15', popular: false },
    { name: 'Epic Cinematic', bpm: 140, duration: '2:45', popular: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* 音乐源 */}
      <div className="grid grid-cols-2 gap-2">
        <button className="py-3 bg-gradient-to-r from-[#00A8E8]/20 to-[#0080FF]/20 border border-[#00A8E8]/50 rounded-xl caption font-bold text-white active:scale-95 transition-all flex items-center justify-center gap-2">
          <MusicIcon className="w-4.5 h-4.5 text-[#00A8E8]" strokeWidth={2} />
          乐库
        </button>
        <button className="py-3 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.12] active:scale-95 transition-all flex items-center justify-center gap-2">
          <Download className="w-4.5 h-4.5" strokeWidth={2} />
          导入
        </button>
      </div>

      {/* 推荐音乐 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="caption text-white/70 font-semibold">推荐配乐</span>
          <button className="caption text-brand font-bold">更多 ›</button>
        </div>
        <div className="space-y-2">
          {musicTracks.map((track) => (
            <button
              key={track.name}
              className="w-full p-2.5 bg-white/[0.06] rounded-lg border border-white/[0.08] active:scale-98 transition-all flex items-center gap-3 hover:bg-white/[0.10]"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00A8E8] to-[#0080FF] flex items-center justify-center flex-none">
                <MusicIcon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="caption text-white font-semibold truncate">{track.name}</p>
                  {track.popular && (
                    <span className="micro px-1.5 py-0.5 rounded bg-[#FFB800]/20 text-[#FFB800] font-bold border border-[#FFB800]/40">HOT</span>
                  )}
                </div>
                <p className="micro text-white/50">
                  {track.bpm} BPM · {track.duration}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 音量控制 */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-white/60" strokeWidth={2} />
            <span className="caption text-white/70">音量</span>
          </div>
          <span className="micro text-white font-mono">80%</span>
        </div>
        <div className="w-full h-1.5 bg-white/[0.10] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#51CF66] to-[#40C057] rounded-full"
            style={{ width: '80%' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function TextTools() {
  const textStyles = [
    { name: '标题', example: 'Aa', color: '#FFFFFF' },
    { name: '字幕', example: 'Aa', color: '#00A8E8' },
    { name: '对话', example: 'Aa', color: '#51CF66' },
    { name: '引用', example: 'Aa', color: '#FFB800' },
    { name: '强调', example: 'Aa', color: '#FF6B6B' },
    { name: '装饰', example: 'Aa', color: '#9775FA' },
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* 文字样式 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="caption text-white/70 font-semibold">样式</span>
          <button className="caption text-brand font-bold">全部 ›</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {textStyles.map((style) => (
            <button
              key={style.name}
              className="py-3 bg-white/[0.08] rounded-xl caption font-semibold border border-white/[0.12] active:scale-95 transition-all flex flex-col items-center gap-1.5 hover:bg-white/[0.12] hover:border-white/[0.20]"
            >
              <span className="text-2xl font-bold" style={{ color: style.color }}>{style.example}</span>
              <span className="micro text-white/70">{style.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-2 gap-2">
        <button className="py-2.5 bg-white/[0.08] rounded-lg caption font-semibold text-white border border-white/[0.12] active:scale-95 transition-all flex items-center justify-center gap-2">
          <Type className="w-4 h-4" strokeWidth={2} />
          添加文字
        </button>
        <button className="py-2.5 bg-gradient-to-r from-[#00A8E8]/20 to-[#0080FF]/20 border border-[#00A8E8]/50 rounded-lg caption font-bold text-white active:scale-95 transition-all flex items-center justify-center gap-2">
          <Wand2 className="w-4 h-4 text-[#00A8E8]" strokeWidth={2} />
          AI字幕
        </button>
      </div>
    </motion.div>
  );
}

function StickersTools() {
  const stickerCategories = [
    { name: '表情', count: 48, color: '#FFB800' },
    { name: '装饰', count: 36, color: '#00A8E8' },
    { name: '箭头', count: 24, color: '#51CF66' },
    { name: '形状', count: 32, color: '#FF6B6B' },
    { name: '边框', count: 20, color: '#9775FA' },
    { name: '特效', count: 28, color: '#00DC82' },
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="caption text-white/70 font-semibold">分类</span>
          <button className="caption text-brand font-bold">全部 ›</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {stickerCategories.map((category) => (
            <button
              key={category.name}
              className="py-3 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.12] active:scale-95 transition-all flex flex-col items-center gap-1.5 hover:bg-white/[0.12] hover:border-white/[0.20]"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}30` }}>
                <Sticker className="w-4.5 h-4.5" strokeWidth={2} style={{ color: category.color }} />
              </div>
              <div className="text-center">
                <p className="micro text-white/90 font-semibold">{category.name}</p>
                <p className="micro text-white/40">{category.count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 快速操作 */}
      <button className="w-full py-2.5 bg-white/[0.08] rounded-lg caption font-semibold text-white border border-white/[0.12] active:scale-95 transition-all flex items-center justify-center gap-2">
        <Download className="w-4 h-4" strokeWidth={2} />
        导入自定义贴纸
      </button>
    </motion.div>
  );
}

// Helper function
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}