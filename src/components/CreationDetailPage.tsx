import { useState, useRef } from 'react';
import { X, Heart, MessageCircle, Share2, Bookmark, Play, Pause, Volume2, VolumeX, MoreHorizontal, Zap, MapPin, Camera, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface POI {
  id: string;
  name: string;
  type: 'building' | 'object' | 'scene';
  thumbnail: string;
  scanTime: string;
  accuracy: number; // 匹配精度 0-100
}

interface Sequence {
  id: string;
  name: string;
  stepCount: number;
  duration: number;
  thumbnail: string;
}

interface Creation {
  id: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  sequence: Sequence;
  pois: POI[];
  createdAt: string;
}

export default function CreationDetailPage({ 
  creation,
  onClose,
  onUseSequence,
  onUsePOI
}: {
  creation: Creation;
  onClose: () => void;
  onUseSequence?: (sequenceId: string) => void;
  onUsePOI?: (poiId: string) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(creation.isLiked);
  const [isSaved, setIsSaved] = useState(creation.isSaved);
  const [likesCount, setLikesCount] = useState(creation.likes);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const getPOITypeLabel = (type: POI['type']) => {
    const labels = {
      building: '建筑',
      object: '物体',
      scene: '场景'
    };
    return labels[type];
  };

  const getPOITypeColor = (type: POI['type']) => {
    const colors = {
      building: '#00A8E8',
      object: '#FFB800',
      scene: '#00DC82'
    };
    return colors[type];
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top Bar */}
      <div className="flex-none absolute top-0 left-0 right-0 z-30 px-4 py-3 bg-gradient-to-b from-black/80 to-transparent" style={{ paddingTop: 'calc(44px + 8px)' }}>
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center active:scale-90 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center active:scale-90 transition-all">
              <Download className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center active:scale-90 transition-all">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Preview */}
      <div 
        className="relative w-full bg-black"
        style={{ 
          height: 'calc(100vh - 88px)',
          maxHeight: '70vh'
        }}
      >
        {/* 使用静态图片代替视频，避免NotSupportedError */}
        <div className="w-full h-full relative">
          <ImageWithFallback
            src={creation.thumbnail}
            alt={creation.title}
            className="w-full h-full object-contain"
          />
          {/* 播放按钮覆层 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all"
            >
              {isPlaying ? (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" strokeWidth={0} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-4 z-20">
        {/* Like */}
        <button
          onClick={toggleLike}
          className="flex flex-col items-center gap-1 active:scale-90 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Heart 
              className={`w-6 h-6 ${isLiked ? 'fill-[#FF6B6B] text-[#FF6B6B]' : 'text-white'}`}
              strokeWidth={2}
            />
          </div>
          <span className="micro text-white font-semibold">
            {likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount}
          </span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1 active:scale-90 transition-all">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <span className="micro text-white font-semibold">
            {creation.comments >= 1000 ? `${(creation.comments / 1000).toFixed(1)}K` : creation.comments}
          </span>
        </button>

        {/* Save */}
        <button
          onClick={toggleSave}
          className="flex flex-col items-center gap-1 active:scale-90 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Bookmark 
              className={`w-6 h-6 ${isSaved ? 'fill-[#FFB800] text-[#FFB800]' : 'text-white'}`}
              strokeWidth={2}
            />
          </div>
          <span className="micro text-white font-semibold">收藏</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1 active:scale-90 transition-all">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <span className="micro text-white font-semibold">分享</span>
        </button>
      </div>

      {/* Bottom Info Panel */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent transition-all duration-300 ${
          panelExpanded ? 'h-[60vh]' : 'h-auto'
        }`}
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
      >
        {/* Drag Handle */}
        <button
          onClick={() => setPanelExpanded(!panelExpanded)}
          className="w-full py-2 flex items-center justify-center"
        >
          {panelExpanded ? (
            <ChevronDown className="w-5 h-5 text-white/50" />
          ) : (
            <ChevronUp className="w-5 h-5 text-white/50" />
          )}
        </button>

        <div className={`px-4 pb-4 ${panelExpanded ? 'overflow-y-auto max-h-[calc(60vh-60px)]' : ''}`}>
          {/* Title */}
          <h2 className="body-l font-bold text-white mb-2">{creation.title}</h2>
          <p className="caption text-white/50 mb-4">{creation.createdAt}</p>

          {/* Sequence Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand" strokeWidth={2} />
                <h3 className="body font-bold text-white">使用的运镜方案</h3>
              </div>
            </div>
            
            <div className="glass-card p-3 active:scale-98 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-none">
                  <ImageWithFallback
                    src={creation.sequence.thumbnail}
                    alt={creation.sequence.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="caption font-bold text-white mb-1">{creation.sequence.name}</h4>
                  <div className="flex items-center gap-2 micro text-white/50">
                    <span>{creation.sequence.stepCount} 步骤</span>
                    <span>·</span>
                    <span>{creation.sequence.duration}秒</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUseSequence?.(creation.sequence.id);
                  }}
                  className="px-3 py-1.5 bg-brand/20 border border-brand/40 rounded-lg caption font-bold text-brand active:scale-95 transition-all whitespace-nowrap"
                >
                  使用
                </button>
              </div>
            </div>
          </div>

          {/* POI Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand" strokeWidth={2} />
                <h3 className="body font-bold text-white">扫描的 POI 建模</h3>
              </div>
              <span className="caption text-brand font-semibold">{creation.pois.length} 个</span>
            </div>

            <div className="space-y-2">
              {creation.pois.map((poi) => {
                const typeColor = getPOITypeColor(poi.type);
                return (
                  <div
                    key={poi.id}
                    className="glass-card p-3 active:scale-98 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-none">
                        <ImageWithFallback
                          src={poi.thumbnail}
                          alt={poi.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="caption font-bold text-white truncate">{poi.name}</h4>
                          <span 
                            className="micro px-1.5 py-0.5 rounded font-bold"
                            style={{ 
                              backgroundColor: `${typeColor}20`,
                              color: typeColor,
                              border: `1px solid ${typeColor}40`
                            }}
                          >
                            {getPOITypeLabel(poi.type)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 micro text-white/50">
                          <span>{poi.scanTime}</span>
                          <span>·</span>
                          <div className="flex items-center gap-1">
                            <span>精度</span>
                            <span className="text-[#00DC82] font-bold">{poi.accuracy}%</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUsePOI?.(poi.id);
                        }}
                        className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg caption font-bold text-white active:scale-95 transition-all whitespace-nowrap"
                      >
                        使用
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* One-Click Recreate Button */}
          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00A8E8] to-[#0080FF] text-white body font-bold active:scale-95 transition-all shadow-[0_8px_24px_rgba(0,168,232,0.4)] flex items-center justify-center gap-2">
            <Camera className="w-5 h-5" strokeWidth={2.5} />
            <span>一键复现此作品</span>
          </button>
        </div>
      </div>
    </div>
  );
}