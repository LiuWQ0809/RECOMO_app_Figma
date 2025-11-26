import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Battery, Wifi, Circle, Camera, Video, X, Zap, Focus, ChevronDown, Mic, MicOff, Sliders, Sun, Droplet, Aperture, Clock, Bookmark, Radio, Music, Users, ShoppingBag, Activity, Box, Maximize2, Film, Scissors, Gamepad2, Move, SlidersHorizontal, Crosshair, Navigation } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ARDanceGuide from './ARDanceGuide';
import VideoEditor from './VideoEditor';

type ControlMode = 'sequence' | 'manual' | 'tracking' | 'live';
type RecordingMode = 'photo' | 'video';

export default function CreatePage({ activeTemplate = null, onSaveShot, isPreview = false }: { activeTemplate?: any; onSaveShot?: (shot: any) => void; isPreview?: boolean }) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [controlMode, setControlMode] = useState<ControlMode>(activeTemplate ? 'sequence' : 'manual');
  const [recordingMode, setRecordingMode] = useState<RecordingMode>('video');
  const [isMuted, setIsMuted] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showCameraSettings, setShowCameraSettings] = useState(false);
  const [streamTime, setStreamTime] = useState(0);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [isExecutingSequence, setIsExecutingSequence] = useState(false);
  const [show3DView, setShow3DView] = useState(true);
  const [showARGuide, setShowARGuide] = useState(false);
  const [showVideoEditor, setShowVideoEditor] = useState(false);
  const [showPreviewMode, setShowPreviewMode] = useState(isPreview);
  
  // 3D Camera Position State
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 1.5, z: 3 });
  const [cameraRotation, setCameraRotation] = useState({ pitch: 0, yaw: 0, roll: 0 });

  // Camera settings
  const [cameraSettings, setCameraSettings] = useState({
    iso: 400,
    shutterSpeed: '1/60',
    whiteBalance: 'auto',
    exposure: 0,
  });

  // Stream timer - only run when streaming
  useEffect(() => {
    if (!isStreaming) return;
    
    const timer = setInterval(() => {
      setStreamTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isStreaming]);
  
  // Simulate camera position updates
  useEffect(() => {
    if (!isStreaming) return;
    
    const positionTimer = setInterval(() => {
      setCameraPosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 0.1,
        y: prev.y + (Math.random() - 0.5) * 0.05,
        z: prev.z + (Math.random() - 0.5) * 0.1,
      }));
      setCameraRotation(prev => ({
        pitch: prev.pitch + (Math.random() - 0.5) * 2,
        yaw: prev.yaw + (Math.random() - 0.5) * 2,
        roll: prev.roll + (Math.random() - 0.5) * 1,
      }));
    }, 100);
    
    return () => clearInterval(positionTimer);
  }, [isStreaming]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}'${secs.toString().padStart(2, '0')}"`;
  };

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const saveRecording = async () => {
    try {
      toast.info('正在上传视频和数据到服务器...');
      const formData = new FormData();
      
      // Mock video file
      const videoBlob = new Blob(['mock video content'], { type: 'video/mp4' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      formData.append('video', videoBlob, `recording_${timestamp}.mp4`);

      // Mock data file
      const data = {
        timestamp: Date.now(),
        duration: streamTime,
        cameraPosition,
        cameraSettings,
        controlMode,
        activeTemplate
      };
      const dataBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      formData.append('data', dataBlob, `data_${timestamp}.json`);

      const response = await fetch(`${apiBase}/upload`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('上传成功！');
      } else {
        toast.error('上传失败: ' + result.message);
      }
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('上传出错，请检查服务器连接');
    }
  };

  const handleStartStreaming = async () => {
    if (!isStreaming) {
      setIsStreaming(true);
      // Start sequence execution if in sequence mode
      if (controlMode === 'sequence' && activeTemplate) {
        setIsExecutingSequence(true);
        // Simulate sequence execution
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setSequenceProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setIsExecutingSequence(false);
          }
        }, 200);
      }
    } else {
      setIsStreaming(false);
      await saveRecording();
      setShowComplete(true);
      setIsExecutingSequence(false);
      setSequenceProgress(0);
    }
  };

  // 视频编辑器叠加层
  if (showVideoEditor) {
    return <VideoEditor onClose={() => setShowVideoEditor(false)} />;
  }

  // AR舞蹈引导模式叠加层
  if (showARGuide) {
    return (
      <ARDanceGuide
        templateName={activeTemplate?.sequenceName || '不齐舞团·环球街舞运镜'}
        musicName={activeTemplate?.musicName || 'Feel the Beat'}
        bpm={activeTemplate?.bpm || 122}
        onClose={() => setShowARGuide(false)}
        onComplete={(score) => {
          console.log('AR Dance Complete:', score);
          setShowARGuide(false);
          // 可以在这里保存得分等操作
        }}
      />
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-black relative">
      {/* Top Status Bar */}
      <div className="flex-none absolute top-0 left-0 right-0 z-20 px-4 py-2 bg-gradient-to-b from-black/90 to-transparent" style={{ paddingTop: 'calc(44px + 4px)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#00DC82] flex-none" />
            <span className="caption text-white font-semibold">Recomo Pro</span>
          </div>
          <div className="flex items-center gap-2">
            {isStreaming && (
              <div className="px-3 py-1.5 bg-[#FF4444]/20 backdrop-blur-sm rounded-full border border-[#FF4444]/40 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#FF4444] rounded-full animate-pulse" />
                <span className="caption font-bold text-[#FF4444]">LIVE</span>
                <span className="caption font-bold text-white">{formatTime(streamTime)}</span>
              </div>
            )}
            <Battery className="w-5 h-5 text-white flex-none" />
          </div>
        </div>
      </div>

      {/* Live Feed Area - 固定顶部 */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 flex-none w-full" style={{ paddingTop: '44px' }}>
        {/* 固定16:9画面容器 - RECOMO 设备图传画面 */}
        <div className="w-full aspect-video relative bg-black">
          {/* RECOMO 图传监控画面 */}
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1623325485148-6f1e291debf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwc2NlbmUlMjBuYXR1cmUlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjM1NTM5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="RECOMO 图传画面"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Sequence Progress - 仅在sequence模式下显示 */}
          {controlMode === 'sequence' && activeTemplate && (
            <div className="absolute top-3 left-3 glass-card px-3 py-1.5 z-10">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-brand flex-none" />
                <span className="micro font-bold text-white">{activeTemplate.sequenceName}</span>
                <span className="micro text-brand font-bold">{Math.round(sequenceProgress)}%</span>
              </div>
            </div>
          )}

          {/* 简化后的中心对焦框 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
            <div className="w-20 h-20 border border-white/30 rounded-sm relative">
              <div className="absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
              <div className="absolute -top-px -right-px w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
              <div className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
              <div className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 border-white" />
            </div>
          </div>

          {/* 紧急制动按钮 - 固定在画面右下角 */}
          <button 
            className="absolute bottom-3 right-3 z-30 w-11 h-11 rounded-lg bg-[#FFB800] border-2 border-[#D99A00] flex items-center justify-center active:scale-95 transition-all shadow-[0_4px_16px_rgba(255,184,0,0.5)]"
            aria-label="紧急制动"
          >
            {/* Corner screws effect */}
            <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-black/20" />
            <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-black/20" />
            <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-black/20" />
            <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-black/20" />
            
            {/* Red emergency button */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#FF6B6B] to-[#FF4444] border-2 border-[#CC0000] shadow-inner flex items-center justify-center">
              {/* Inner circle detail */}
              <div className="w-5 h-5 rounded-full border border-[#FF8888]/50" />
            </div>
          </button>
          
          {/* 3D Camera Position Monitor - 左下角 */}
          {show3DView && (
            <div className="absolute bottom-3 left-3 z-20 w-32 h-32 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 px-2 py-1 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10">
                <div className="flex items-center gap-1">
                  <Box className="w-3 h-3 text-brand" strokeWidth={2} />
                  <span className="micro font-bold text-white">3D</span>
                </div>
                <button 
                  onClick={() => setShow3DView(false)}
                  className="w-4 h-4 flex items-center justify-center active:scale-90 transition-all"
                >
                  <X className="w-3 h-3 text-white/60" strokeWidth={2} />
                </button>
              </div>
              
              {/* 3D View Container */}
              <div className="w-full h-full flex items-center justify-center relative">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
                
                {/* 3D Space Visualization */}
                <div className="relative w-20 h-20">
                  {/* Floor plane */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 border border-white/30 rounded-sm"
                    style={{ 
                      transform: `translateX(-50%) perspective(100px) rotateX(60deg)`,
                      transformOrigin: 'center bottom'
                    }}
                  />
                  
                  {/* Camera Icon */}
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
                    style={{ 
                      transform: `translate(-50%, -50%) translate(${cameraPosition.x * 5}px, ${-cameraPosition.y * 5}px) rotate(${cameraRotation.yaw}deg)`
                    }}
                  >
                    <div className="relative">
                      <Video className="w-4 h-4 text-brand drop-shadow-[0_0_4px_rgba(0,168,232,0.8)]" strokeWidth={2.5} />
                      {/* Direction indicator */}
                      <div 
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0.5 h-2 bg-brand"
                        style={{ 
                          transform: `translateX(-50%) translateY(-100%) rotate(${cameraRotation.pitch}deg)`,
                          transformOrigin: 'bottom center'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Target/Subject marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 border-2 border-[#FFB800] rounded-full" />
                </div>
              </div>
              
              {/* Position Data */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center justify-between micro text-white/70">
                  <span>X:{cameraPosition.x.toFixed(1)}m</span>
                  <span>Y:{cameraPosition.y.toFixed(1)}m</span>
                  <span>Z:{cameraPosition.z.toFixed(1)}m</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Show 3D View Button - when hidden */}
          {!show3DView && (
            <button
              onClick={() => setShow3DView(true)}
              className="absolute bottom-3 left-3 z-20 w-10 h-10 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center active:scale-95 transition-all"
            >
              <Box className="w-5 h-5 text-brand" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-white/[0.03] backdrop-blur-xl border-t border-white/[0.08]">
        {/* Mode Selector */}
        <div className="px-4 pt-2 pb-2">
          <div className="grid grid-cols-6 gap-2">
            <button 
              onClick={() => setShowCameraSettings(true)}
              className="h-11 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center active:scale-95 transition-all"
              title="相机设置"
            >
              <Sliders className="w-4 h-4 text-white" />
            </button>
            
            <button 
              onClick={() => setShowModeMenu(true)}
              className="col-span-2 h-11 flex items-center justify-center gap-2 px-3 bg-white/[0.1] border border-white/[0.12] rounded-xl active:scale-95 transition-all"
            >
              <span className="caption font-semibold text-white">
                {controlMode === 'sequence' ? '自动运镜' : controlMode === 'manual' ? '手动控制' : controlMode === 'live' ? '直播' : 'AI追踪'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-white/50" />
            </button>
            
            <button 
              onClick={() => setShowVideoEditor(true)}
              className="h-11 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center active:scale-95 transition-all"
              title="视频剪辑"
            >
              <Scissors className="w-4 h-4 text-white" />
            </button>
            
            <button 
              className="h-11 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center active:scale-95 transition-all"
              title="语音控制"
            >
              <Mic className="w-4 h-4 text-white" />
            </button>
            
            <button 
              onClick={() => setShowARGuide(true)}
              className="h-11 rounded-xl bg-gradient-to-br from-[#FFB800]/20 to-[#FF8C00]/20 border border-[#FFB800]/40 flex items-center justify-center active:scale-95 transition-all"
              title="AR引导"
            >
              <Box className="w-4 h-4 text-[#FFB800]" />
            </button>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-center gap-5">
            {/* Photo/Video Toggle */}
            <button 
              onClick={() => setRecordingMode(recordingMode === 'photo' ? 'video' : 'photo')}
              className="w-11 h-11 rounded-full bg-white/[0.1] border border-white/[0.12] flex items-center justify-center active:scale-90 transition-all"
            >
              {recordingMode === 'video' ? (
                <Video className="w-4.5 h-4.5 text-white" />
              ) : (
                <Camera className="w-4.5 h-4.5 text-white" />
              )}
            </button>

            {/* Main Stream Button */}
            <button
              onClick={handleStartStreaming}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isStreaming
                  ? 'bg-[#FF6B6B] active:scale-90'
                  : 'bg-white active:scale-90'
              }`}
            >
              {isStreaming ? (
                <div className="w-6 h-6 bg-white rounded-sm" />
              ) : (
                <Circle className={`w-14 h-14 fill-current ${recordingMode === 'video' ? 'text-[#FF6B6B]' : 'text-brand'}`} />
              )}
            </button>

            {/* Mute Toggle */}
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="w-11 h-11 rounded-full bg-white/[0.1] border border-white/[0.12] flex items-center justify-center active:scale-90 transition-all"
            >
              {isMuted ? (
                <MicOff className="w-4.5 h-4.5 text-white/50" />
              ) : (
                <Mic className="w-4.5 h-4.5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Control Mode Content */}
        <div className="px-4 pb-[90px]">
          {controlMode === 'manual' ? (
            <ManualControlView />
          ) : controlMode === 'sequence' ? (
            <SequenceControlView 
              activeTemplate={activeTemplate} 
              onOpenARGuide={() => setShowARGuide(true)}
            />
          ) : controlMode === 'live' ? (
            <LiveControlView />
          ) : (
            <TrackingControlView />
          )}
        </div>
      </div>

      {/* Mode Selection Menu */}
      {showModeMenu && (
        <ModeSelectionMenu
          currentMode={controlMode}
          onSelect={(mode) => {
            setControlMode(mode);
            setShowModeMenu(false);
          }}
          onClose={() => setShowModeMenu(false)}
        />
      )}

      {/* Camera Settings Panel */}
      {showCameraSettings && (
        <CameraSettingsPanel
          settings={cameraSettings}
          onUpdate={setCameraSettings}
          onClose={() => setShowCameraSettings(false)}
        />
      )}

      {/* Completion Modal */}
      {showComplete && (
        <CompletionModal onClose={() => setShowComplete(false)} />
      )}
    </div>
  );
}

// Camera Prompt Component
function CameraPrompt({ 
  cameraState, 
  errorMessage, 
  onInit 
}: { 
  cameraState: CameraState; 
  errorMessage: string; 
  onInit: () => void;
}) {
  if (cameraState === 'requesting') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-3 px-5">
          <div className="w-14 h-14 rounded-full bg-brand/20 mx-auto flex items-center justify-center animate-pulse">
            <Camera className="w-7 h-7 text-brand" />
          </div>
          <p className="body text-white">正在启动图传...</p>
          <p className="caption text-tertiary">请允许浏览器访问摄头</p>
        </div>
      </div>
    );
  }

  if (cameraState === 'denied' || cameraState === 'error') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4 px-6 max-w-sm">
          <div className="w-14 h-14 rounded-full bg-[#FFB800]/20 mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-[#FFB800]" />
          </div>
          <div>
            <p className="body text-white mb-2">{errorMessage}</p>
            {cameraState === 'denied' ? (
              <div className="text-left space-y-2 mt-3">
                <p className="caption text-tertiary mb-2">请按以下步骤允许访问：</p>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center flex-none mt-0.5">
                      <span className="micro text-brand font-bold">1</span>
                    </div>
                    <p className="caption text-white/70 flex-1">点击浏览器地址栏左侧的 <span className="text-white font-semibold">🔒</span> 或 <span className="text-white font-semibold">ⓘ</span> 图标</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center flex-none mt-0.5">
                      <span className="micro text-brand font-bold">2</span>
                    </div>
                    <p className="caption text-white/70 flex-1">找到<span className="text-white font-semibold">"摄像头"</span>权限</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center flex-none mt-0.5">
                      <span className="micro text-brand font-bold">3</span>
                    </div>
                    <p className="caption text-white/70 flex-1">选择<span className="text-white font-semibold">"允许"</span>并刷新页面</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="caption text-tertiary">请检查摄像头连接或关闭他使用摄像头的应用</p>
            )}
          </div>
          <button 
            onClick={onInit}
            className="btn-primary-sm w-full flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重试</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center space-y-4 px-5 max-w-sm">
        <div className="w-16 h-16 rounded-full bg-brand/20 mx-auto flex items-center justify-center">
          <Play className="w-8 h-8 text-brand ml-1" />
        </div>
        <div>
          <p className="body text-white mb-2">启动实时图传</p>
          <p className="caption text-tertiary mb-4">点击录制按钮���始拍摄</p>
        </div>
        <button 
          onClick={onInit}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>启动图传</span>
        </button>
      </div>
    </div>
  );
}

// Mode Selection Menu
function ModeSelectionMenu({ 
  currentMode, 
  onSelect, 
  onClose 
}: { 
  currentMode: ControlMode; 
  onSelect: (mode: ControlMode) => void;
  onClose: () => void;
}) {
  const modes = [
    {
      id: 'sequence' as ControlMode,
      name: '自动运镜',
      description: '官方模版预设路径自动执行',
      icon: Zap,
      color: '#00A8E8',
    },
    {
      id: 'manual' as ControlMode,
      name: '手动控制',
      description: '双摇杆手动操控底盘运动',
      icon: Focus,
      color: '#FFB800',
    },
    {
      id: 'tracking' as ControlMode,
      name: 'AI 追踪',
      description: '智能锁定目标自动跟拍',
      icon: Camera,
      color: '#00DC82',
    },
    {
      id: 'live' as ControlMode,
      name: '直播模式',
      description: '音乐律动 · POI场景自动运镜',
      icon: Radio,
      color: '#FF6B6B',
    },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#1C1C1E] rounded-t-3xl border-t border-white/10 animate-slide-up"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 border-b border-white/[0.06]">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />
          <h3 className="body-l font-bold text-white">选择控制模式</h3>
        </div>

        <div className="p-4 space-y-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = currentMode === mode.id;
            
            return (
              <button
                key={mode.id}
                onClick={() => onSelect(mode.id)}
                className={`w-full rounded-2xl p-4 border transition-all active:scale-98 ${
                  isSelected
                    ? 'bg-white/[0.1] border-white/20'
                    : 'bg-white/[0.05] border-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-none"
                    style={{ background: `${mode.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: mode.color }} strokeWidth={2} />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="body font-bold text-white">{mode.name}</span>
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                      )}
                    </div>
                    <p className="caption text-tertiary">{mode.description}</p>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center flex-none">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Camera Settings Panel
function CameraSettingsPanel({
  settings,
  onUpdate,
  onClose,
}: {
  settings: any;
  onUpdate: (settings: any) => void;
  onClose: () => void;
}) {
  const isoOptions = [100, 200, 400, 800, 1600, 3200];
  const shutterOptions = ['1/30', '1/60', '1/125', '1/250', '1/500', '1/1000'];
  const wbOptions = [
    { value: 'auto', label: '自动' },
    { value: '晴天', label: '晴天' },
    { value: '阴天', label: '阴天' },
    { value: '钨丝灯', label: '钨丝灯' },
    { value: '荧光灯', label: '荧光灯' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#1C1C1E] rounded-t-3xl border-t border-white/10 animate-slide-up max-h-[80vh] overflow-y-auto"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#1C1C1E] px-5 pt-4 pb-3 border-b border-white/[0.06] z-10">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h3 className="body-l font-bold text-white">相机参数</h3>
            <button
              onClick={onClose}
              className="caption font-semibold text-brand active:scale-95 transition-all"
            >
              完成
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* ISO */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-brand" strokeWidth={2} />
                <span className="body font-semibold text-white">ISO 感光度</span>
              </div>
              <span className="caption font-bold text-brand">{settings.iso}</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {isoOptions.map((iso) => (
                <button
                  key={iso}
                  onClick={() => onUpdate({ ...settings, iso })}
                  className={`py-2 px-2 rounded-lg caption font-semibold transition-all ${
                    settings.iso === iso
                      ? 'bg-brand text-white'
                      : 'bg-white/[0.08] text-white/70 border border-white/[0.08]'
                  }`}
                >
                  {iso}
                </button>
              ))}
            </div>
          </div>

          {/* Shutter Speed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" strokeWidth={2} />
                <span className="body font-semibold text-white">快门速度</span>
              </div>
              <span className="caption font-bold text-brand">{settings.shutterSpeed}s</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {shutterOptions.map((shutter) => (
                <button
                  key={shutter}
                  onClick={() => onUpdate({ ...settings, shutterSpeed: shutter })}
                  className={`py-2 px-1 rounded-lg micro font-semibold transition-all ${
                    settings.shutterSpeed === shutter
                      ? 'bg-brand text-white'
                      : 'bg-white/[0.08] text-white/70 border border-white/[0.08]'
                  }`}
                >
                  {shutter}
                </button>
              ))}
            </div>
          </div>

          {/* White Balance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-brand" strokeWidth={2} />
                <span className="body font-semibold text-white">白平衡</span>
              </div>
              <span className="caption font-bold text-brand">
                {wbOptions.find(w => w.value === settings.whiteBalance)?.label}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {wbOptions.map((wb) => (
                <button
                  key={wb.value}
                  onClick={() => onUpdate({ ...settings, whiteBalance: wb.value })}
                  className={`py-2 px-2 rounded-lg caption font-semibold transition-all ${
                    settings.whiteBalance === wb.value
                      ? 'bg-brand text-white'
                      : 'bg-white/[0.08] text-white/70 border border-white/[0.08]'
                  }`}
                >
                  {wb.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exposure Compensation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Aperture className="w-4 h-4 text-brand" strokeWidth={2} />
                <span className="body font-semibold text-white">曝光补偿</span>
              </div>
              <span className="caption font-bold text-brand">
                {settings.exposure > 0 ? '+' : ''}{settings.exposure} EV
              </span>
            </div>
            <div className="bg-white/[0.08] rounded-xl p-4 border border-white/[0.08]">
              <input
                type="range"
                min="-2"
                max="2"
                step="0.5"
                value={settings.exposure}
                onChange={(e) => onUpdate({ ...settings, exposure: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <span className="micro text-white/50">-2 EV</span>
                <span className="micro text-white/50">0</span>
                <span className="micro text-white/50">+2 EV</span>
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="pt-2">
            <div className="flex gap-2">
              <button
                onClick={() => onUpdate({
                  iso: 400,
                  shutterSpeed: '1/60',
                  whiteBalance: 'auto',
                  exposure: 0,
                })}
                className="flex-1 py-3 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.08] active:scale-95 transition-all"
              >
                重置认
              </button>
              <button
                onClick={() => onUpdate({
                  iso: 100,
                  shutterSpeed: '1/125',
                  whiteBalance: '晴天',
                  exposure: 0.5,
                })}
                className="flex-1 py-3 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.08] active:scale-95 transition-all"
              >
                室外模式
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Manual Control View
function ManualControlView() {
  const [speed, setSpeed] = useState(60);
  const [controlMode, setControlMode] = useState<'fps' | 'precision'>('fps');
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  
  return (
    <div className="space-y-2">
      {/* 双虚拟摇杆控制 - FPS风格 */}
      {controlMode === 'fps' && (
      <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.08] relative">
        {/* 模式切换按钮 - 左上角 */}
        <button 
          onClick={() => setControlMode('precision')}
          className="absolute top-2.5 left-2.5 w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center active:scale-90 transition-all z-10"
          title="切换到精度控制"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-white/60" />
        </button>

        {/* 连接遥控器按钮 - 右上角 */}
        <button 
          onClick={() => setIsRemoteConnected(!isRemoteConnected)}
          className={`absolute top-2.5 right-2.5 h-7 px-2.5 rounded-lg flex items-center gap-1.5 active:scale-90 transition-all z-10 ${
            isRemoteConnected 
              ? 'bg-[#00DC82]/20 border border-[#00DC82]/40' 
              : 'bg-white/[0.08] border border-white/[0.12]'
          }`}
          title={isRemoteConnected ? "遥控器已连接" : "连接遥控器"}
        >
          <Gamepad2 className={`w-3.5 h-3.5 ${isRemoteConnected ? 'text-[#00DC82]' : 'text-white/60'}`} />
          {isRemoteConnected && <div className="w-1.5 h-1.5 rounded-full bg-[#00DC82] animate-pulse" />}
        </button>

        <div className="flex items-center justify-center mb-2 pt-1">
          <div className="flex items-center gap-1.5">
            <Move className="w-4 h-4 text-brand" />
            <span className="caption font-bold text-white">快速操控</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* 左摇杆 - 移动控制 */}
          <div className="flex flex-col items-center">
            <div className="w-[120px] h-[120px] rounded-full bg-white/[0.08] border-2 border-white/[0.12] relative flex items-center justify-center">
              {/* Direction Labels */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2">
                <span className="micro text-white/40">前</span>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <span className="micro text-white/40">后</span>
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <span className="micro text-white/40">左</span>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <span className="micro text-white/40">右</span>
              </div>
              
              {/* Center Circle */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-[#0080FF] shadow-lg flex items-center justify-center border-2 border-white/20">
                <div className="w-8 h-8 rounded-full bg-white/20" />
              </div>
              
              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-px h-6 bg-white/20" />
                <div className="absolute w-6 h-px bg-white/20" />
              </div>
            </div>
            <span className="caption font-bold text-white mt-1.5">移动</span>
            <span className="micro text-white/50">底盘</span>
          </div>

          {/* 右摇杆 - 视角控制 */}
          <div className="flex flex-col items-center">
            <div className="w-[120px] h-[120px] rounded-full bg-white/[0.08] border-2 border-white/[0.12] relative flex items-center justify-center">
              {/* Direction Labels */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2">
                <span className="micro text-white/40">上</span>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <span className="micro text-white/40">下</span>
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <span className="micro text-white/40">左</span>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <span className="micro text-white/40">右</span>
              </div>
              
              {/* Center Circle */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFB800] to-[#FF8C00] shadow-lg flex items-center justify-center border-2 border-white/20">
                <div className="w-8 h-8 rounded-full bg-white/20" />
              </div>
              
              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-px h-6 bg-white/20" />
                <div className="absolute w-6 h-px bg-white/20" />
              </div>
            </div>
            <span className="caption font-bold text-white mt-1.5">视角</span>
            <span className="micro text-white/50">云台</span>
          </div>
        </div>

        {/* 速度控制 */}
        <div className="mt-2.5 bg-white/[0.04] rounded-lg p-2 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="caption text-white/70">速度</span>
            <span className="caption text-brand font-bold">{speed}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-1.5"
          />
        </div>
      </div>
      )}

      {/* 精度控制模式 */}
      {controlMode === 'precision' && (
      <div className="bg-white/[0.04] rounded-xl p-2.5 border border-white/[0.08] relative">
        {/* 模式切换按钮 - 左上角 */}
        <button 
          onClick={() => setControlMode('fps')}
          className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center active:scale-90 transition-all z-10"
          title="切换到快速操控"
        >
          <Move className="w-3.5 h-3.5 text-white/60" />
        </button>

        {/* 连接遥控器按钮 - 右上角 */}
        <button 
          onClick={() => setIsRemoteConnected(!isRemoteConnected)}
          className={`absolute top-2 right-2 h-7 px-2.5 rounded-lg flex items-center gap-1.5 active:scale-90 transition-all z-10 ${
            isRemoteConnected 
              ? 'bg-[#00DC82]/20 border border-[#00DC82]/40' 
              : 'bg-white/[0.08] border border-white/[0.12]'
          }`}
          title={isRemoteConnected ? "遥控器已连接" : "连接遥控器"}
        >
          <Gamepad2 className={`w-3.5 h-3.5 ${isRemoteConnected ? 'text-[#00DC82]' : 'text-white/60'}`} />
          {isRemoteConnected && <div className="w-1.5 h-1.5 rounded-full bg-[#00DC82] animate-pulse" />}
        </button>

        <div className="flex items-center justify-center mb-1.5 pt-0.5">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#FFB800]" />
            <span className="caption font-bold text-white">精度控制</span>
          </div>
        </div>

        {/* 底盘移动控制 */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Navigation className="w-3 h-3 text-brand" />
            <span className="micro text-white/70 font-bold">底盘移动</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center flex-1">
              <div className="w-20 h-20 rounded-full bg-white/[0.08] border border-white/[0.12] relative flex items-center justify-center">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2">
                  <span className="micro text-white/40">前</span>
                </div>
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
                  <span className="micro text-white/40">后</span>
                </div>
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                  <span className="micro text-white/40">左</span>
                </div>
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  <span className="micro text-white/40">右</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-[#0080FF] shadow-lg flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-white/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-px h-4 bg-white/20" />
                  <div className="absolute w-4 h-px bg-white/20" />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="bg-white/[0.04] rounded-lg p-1.5 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-1">
                  <span className="micro text-white/60">旋转</span>
                  <span className="micro text-brand font-bold">0°</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="w-6 h-6 rounded bg-white/[0.08] flex items-center justify-center active:scale-90 transition-all">
                    <span className="text-white text-xs">←</span>
                  </button>
                  <div className="flex-1 h-1 bg-white/[0.08] rounded-full">
                    <div className="h-full bg-brand-gradient w-1/2 rounded-full" />
                  </div>
                  <button className="w-6 h-6 rounded bg-white/[0.08] flex items-center justify-center active:scale-90 transition-all">
                    <span className="text-white text-xs">→</span>
                  </button>
                </div>
              </div>

              <div className="bg-white/[0.04] rounded-lg p-1.5 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-1">
                  <span className="micro text-white/60">速度</span>
                  <span className="micro text-brand font-bold">{speed}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full h-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 相机精度控制 */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Crosshair className="w-3 h-3 text-[#FFB800]" />
            <span className="micro text-white/70 font-bold">相机控制</span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Pan/Tilt */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-[68px] h-[68px] rounded-lg bg-white/[0.08] border border-white/[0.12] relative flex items-center justify-center">
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2">
                  <span style={{ fontSize: '9px' }} className="text-white/40">↑</span>
                </div>
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
                  <span style={{ fontSize: '9px' }} className="text-white/40">↓</span>
                </div>
                <div className="absolute left-0.5 top-1/2 -translate-y-1/2">
                  <span style={{ fontSize: '9px' }} className="text-white/40">←</span>
                </div>
                <div className="absolute right-0.5 top-1/2 -translate-y-1/2">
                  <span style={{ fontSize: '9px' }} className="text-white/40">→</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFB800] to-[#FF8C00] shadow-md flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                </div>
              </div>
              <span className="micro text-white/50 mt-0.5">朝向</span>
            </div>

            {/* Horizontal Movement */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-[68px] h-[68px] rounded-lg bg-white/[0.08] border border-white/[0.12] relative flex items-center justify-center">
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2">
                  <span style={{ fontSize: '9px' }} className="text-white/40">前</span>
                </div>
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
                  <span style={{ fontSize: '9px' }} className="text-white/40">后</span>
                </div>
                <div className="absolute left-0.5 top-1/2 -translate-y-1/2">
                  <span style={{ fontSize: '9px' }} className="text-white/40">←</span>
                </div>
                <div className="absolute right-0.5 top-1/2 -translate-y-1/2">
                  <span style={{ fontSize: '9px' }} className="text-white/40">→</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand to-[#0080FF] shadow-md flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                </div>
              </div>
              <span className="micro text-white/50 mt-0.5">平移</span>
            </div>

            {/* Vertical Movement */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-[68px] h-[68px] rounded-lg bg-white/[0.08] border border-white/[0.12] relative flex items-center justify-center">
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2">
                  <span style={{ fontSize: '9px' }} className="text-white/40">升</span>
                </div>
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
                  <span style={{ fontSize: '9px' }} className="text-white/40">降</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00DC82] to-[#00A870] shadow-md flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                </div>
              </div>
              <span className="micro text-white/50 mt-0.5">升降</span>
            </div>
          </div>

          {/* Values Display - 压缩版本 */}
          <div className="flex items-center justify-between mt-1.5 px-1">
            <div className="flex items-center gap-0.5">
              <span style={{ fontSize: '9px' }} className="text-white/40">Pan</span>
              <span className="micro text-brand font-bold">0°</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span style={{ fontSize: '9px' }} className="text-white/40">Tilt</span>
              <span className="micro text-brand font-bold">-15°</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span style={{ fontSize: '9px' }} className="text-white/40">XYZ</span>
              <span className="micro text-brand font-bold">0/0/1.5</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

// Sequence Control View
function SequenceControlView({ activeTemplate, onOpenARGuide }: { activeTemplate: any; onOpenARGuide?: () => void }) {
  // Mock sequence steps data
  const sequenceSteps = [
    { id: 1, name: '起始定位', duration: 2, status: 'completed' },
    { id: 2, name: '急速后退', duration: 8, status: 'current' },
    { id: 3, name: '高度调整', duration: 4, status: 'upcoming' },
    { id: 4, name: '稳定收尾', duration: 8, status: 'upcoming' },
  ];

  const currentStep = sequenceSteps.find(s => s.status === 'current') || sequenceSteps[0];
  const nextStep = sequenceSteps.find(s => s.status === 'upcoming');
  const totalDuration = sequenceSteps.reduce((sum, step) => sum + step.duration, 0);
  const completedDuration = sequenceSteps
    .filter(s => s.status === 'completed')
    .reduce((sum, step) => sum + step.duration, 0) + 3; // 模拟当前步骤进行中
  const overallProgress = (completedDuration / totalDuration) * 100;

  return (
    <div className="space-y-2">
      {/* Sequence Info Card */}
      <div className="bg-white/[0.06] rounded-xl p-3 border border-white/[0.08] space-y-3">
        {/* Header with Icon and Name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="caption font-bold text-white">
                {activeTemplate?.sequenceName || '追光者'}
              </h4>
              <p className="micro text-white/50">4个步骤 · 总时长 {totalDuration}秒</p>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="micro text-white/70">整体进度</span>
            <span className="micro font-bold text-brand">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand to-[#0080FF] rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="micro text-white/50">{completedDuration}s</span>
            <span className="micro text-white/50">{totalDuration}s</span>
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-gradient-to-r from-brand/20 to-[#0080FF]/20 rounded-lg p-2.5 border border-brand/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="micro text-white/70">正在执行</span>
            </div>
            <span className="micro font-bold text-brand">步骤 {currentStep.id}/5</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="caption font-bold text-white">{currentStep.name}</span>
            <span className="caption text-brand font-bold">{currentStep.duration}s</span>
          </div>
        </div>

        {/* Next Step Preview */}
        {nextStep && (
          <div className="bg-white/[0.04] rounded-lg p-2.5 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <ChevronDown className="w-3 h-3 text-white/40" strokeWidth={2} />
                <span className="micro text-white/50">接下来</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="caption text-white/80">{nextStep.name}</span>
              <span className="caption text-white/50">{nextStep.duration}s</span>
            </div>
          </div>
        )}

        {/* Timeline Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {sequenceSteps.map((step) => (
            <div
              key={step.id}
              className={`rounded-full transition-all ${
                step.status === 'completed'
                  ? 'w-2 h-2 bg-brand'
                  : step.status === 'current'
                  ? 'w-3 h-3 bg-brand shadow-[0_0_8px_rgba(0,168,232,0.6)]'
                  : 'w-1.5 h-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Live Control View - 直播模式：AI驱动的音乐同步自动运镜
function LiveControlView() {
  const [liveMode, setLiveMode] = useState<'auto' | 'manual'>('auto');
  const [selectedScene, setSelectedScene] = useState<'dance' | 'fashion' | 'product'>('dance');
  const [musicActive, setMusicActive] = useState(true);
  const [sensitivity, setSensitivity] = useState(70);

  // Mock 数据
  const currentBPM = 122;
  const detectedPeople = 1;
  const activePOIs = 3;

  const sceneTypes = [
    { id: 'dance', name: '舞蹈', icon: Users, color: '#00A8E8', description: '多人编队运镜' },
    { id: 'fashion', name: '走秀', icon: ShoppingBag, color: '#FFB800', description: '跟随拍摄' },
    { id: 'product', name: '展示', icon: Activity, color: '#00DC82', description: '环绕特写' },
  ];

  const quickSequences = [
    { id: 1, name: '编队群像', icon: 'C5', active: true },
    { id: 2, name: '追光者', icon: 'C2', active: false },
    { id: 3, name: '环绕特写', icon: 'C6', active: false },
  ];

  return (
    <div className="space-y-2">
      {/* 音乐分析卡片 */}
      <div className="bg-white/[0.06] rounded-xl p-3 border border-white/[0.08] space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${musicActive ? 'bg-gradient-to-br from-[#FF6B6B] to-[#FF4444] animate-pulse' : 'bg-white/[0.08]'}`}>
              <Music className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="caption font-bold text-white">音乐律动</h4>
              <p className="micro text-white/50">{musicActive ? '实时分析中' : '未检测到音乐'}</p>
            </div>
          </div>
          <button 
            onClick={() => setMusicActive(!musicActive)}
            className={`px-2.5 py-1 rounded-full caption font-bold transition-all ${
              musicActive 
                ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/40' 
                : 'bg-white/[0.08] text-white/50 border border-white/[0.08]'
            }`}
          >
            {musicActive ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* 音乐波形可视化 + BPM */}
        {musicActive && (
          <div className="space-y-2">
            {/* BPM Display */}
            <div className="flex items-center justify-between bg-white/[0.04] rounded-lg p-2">
              <span className="micro text-white/70">节奏检测</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse" />
                <span className="caption font-bold text-[#FF6B6B]">{currentBPM} BPM</span>
              </div>
            </div>

            {/* 简化的音乐波形 */}
            <div className="flex items-end justify-center gap-0.5 h-12 px-2">
              {[...Array(32)].map((_, i) => {
                const height = Math.sin(i * 0.5) * 40 + 50;
                return (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#FF6B6B] to-[#FF8888] rounded-t transition-all duration-100"
                    style={{ 
                      height: `${height}%`,
                      opacity: 0.6 + Math.sin(i * 0.3) * 0.4 
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 场景模式选择 */}
      <div className="bg-white/[0.06] rounded-xl p-3 border border-white/[0.08]">
        <h4 className="caption font-bold text-white mb-2 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-[#FF6B6B]" strokeWidth={2.5} />
          直播场景
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          {sceneTypes.map((scene) => {
            const Icon = scene.icon;
            const isSelected = selectedScene === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => setSelectedScene(scene.id as any)}
                className={`p-2 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-white/[0.12] border border-white/20'
                    : 'bg-white/[0.04] border border-white/[0.06]'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center"
                  style={{ backgroundColor: `${scene.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: scene.color }} strokeWidth={2} />
                </div>
                <div className="micro font-bold text-white text-center">{scene.name}</div>
                <div className="micro text-white/40 text-center">{scene.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* POI & 识别状态 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/[0.06] rounded-xl p-2.5 border border-white/[0.08]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00DC82]" />
            <span className="micro text-white/70">POI 热区</span>
          </div>
          <div className="caption font-bold text-white">{activePOIs} 个场景</div>
        </div>
        <div className="bg-white/[0.06] rounded-xl p-2.5 border border-white/[0.08]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="micro text-white/70">AI 识别</span>
          </div>
          <div className="caption font-bold text-white">{detectedPeople} 人</div>
        </div>
      </div>

      {/* 自动/手动模式切换 */}
      <div className="bg-white/[0.06] rounded-xl p-3 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="caption font-bold text-white">运镜��制</h4>
          <div className="flex items-center gap-1 bg-white/[0.08] rounded-lg p-0.5">
            <button
              onClick={() => setLiveMode('auto')}
              className={`px-2.5 py-1 rounded caption font-semibold transition-all ${
                liveMode === 'auto'
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-white/60'
              }`}
            >
              自动
            </button>
            <button
              onClick={() => setLiveMode('manual')}
              className={`px-2.5 py-1 rounded caption font-semibold transition-all ${
                liveMode === 'manual'
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-white/60'
              }`}
            >
              手动
            </button>
          </div>
        </div>

        {liveMode === 'auto' ? (
          /* 自动模式 - 显示灵敏度控制 */
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="micro text-white/70">跟随灵敏度</span>
              <span className="micro font-bold text-brand">{sensitivity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseInt(e.target.value))}
              className="w-full h-1"
            />
            <div className="flex justify-between micro text-white/40">
              <span>保守</span>
              <span>激进</span>
            </div>
          </div>
        ) : (
          /* 手动模式 - 显示快速触发按钮 */
          <div className="space-y-1.5">
            <p className="micro text-white/50 mb-1">快速切换 Sequence</p>
            {quickSequences.map((seq) => (
              <button
                key={seq.id}
                className={`w-full p-2 rounded-lg transition-all flex items-center justify-between ${
                  seq.active
                    ? 'bg-gradient-to-r from-brand/20 to-[#0080FF]/20 border border-brand/40'
                    : 'bg-white/[0.04] border border-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-6 h-6 rounded flex items-center justify-center caption font-bold ${
                      seq.active 
                        ? 'bg-brand text-white' 
                        : 'bg-white/[0.08] text-white/60'
                    }`}
                  >
                    {seq.icon}
                  </div>
                  <span className={`caption font-semibold ${seq.active ? 'text-white' : 'text-white/70'}`}>
                    {seq.name}
                  </span>
                </div>
                {seq.active && (
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 快速动作 */}
      <div className="grid grid-cols-2 gap-2">
        <button className="py-2 bg-white/[0.06] rounded-lg caption font-semibold text-white border border-white/[0.08] active:scale-95 transition-all flex items-center justify-center gap-1.5">
          <Music className="w-3.5 h-3.5" strokeWidth={2} />
          导入音乐
        </button>
        <button className="py-2 bg-white/[0.06] rounded-lg caption font-semibold text-white border border-white/[0.08] active:scale-95 transition-all flex items-center justify-center gap-1.5">
          <Activity className="w-3.5 h-3.5" strokeWidth={2} />
          加载 POI
        </button>
      </div>
    </div>
  );
}

// Tracking Control View
function TrackingControlView() {
  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center justify-center py-2 px-4">
        <div className="w-full max-w-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#00DC82]/20 mx-auto flex items-center justify-center border-2 border-[#00DC82]">
            <Focus className="w-6 h-6 text-[#00DC82]" />
          </div>
          <div>
            <h4 className="body font-bold text-white mb-1">AI 智能追踪</h4>
            <p className="caption text-secondary">在画面中框选追踪目标</p>
          </div>
          
          <div className="flex gap-2 justify-center pt-2">
            <button className="px-4 py-2 bg-white/[0.08] rounded-lg caption font-semibold text-white border border-white/[0.08] active:scale-95 transition-all">
              人物追踪
            </button>
            <button className="px-4 py-2 bg-white/[0.08] rounded-lg caption font-semibold text-white border border-white/[0.08] active:scale-95 transition-all">
              物体追踪
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Completion Modal
function CompletionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in p-5">
      <div className="solid-card p-6 max-w-sm w-full animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="text-center mb-6 mt-4 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#00DC82]/20 rounded-full mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#00DC82]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-bold mb-2" style={{ fontSize: '20px' }}>拍摄完成！</h3>
          <p className="caption text-secondary">视频已保存到相册</p>
        </div>

        <div className="solid-card-sm p-4 mb-4 bg-[#0A0A0A]">
          <div className="flex items-center justify-between mb-3 caption text-secondary">
            <span>质量评分</span>
            <div className="flex items-center gap-1">
              <span className="body-l font-bold text-brand">9.2</span>
              <span>/10</span>
            </div>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-brand-gradient w-[92%]" />
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/[0.1] border border-white/10 rounded-xl caption font-semibold text-white hover:bg-white/[0.15] transition-all active:scale-95 flex items-center justify-center"
          >
            关闭
          </button>
          <button className="flex-1 btn-primary-sm flex items-center justify-center">
            分享
          </button>
        </div>
      </div>
    </div>
  );
}
