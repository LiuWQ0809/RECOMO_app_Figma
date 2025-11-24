import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, X, Zap, Star, TrendingUp, Target, Music, Award, Share2, Download, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PokemonGOStyleAROverlay from './PokemonGOStyleAROverlay';
import { ImageWithFallback } from './figma/ImageWithFallback';
import danceImage from 'figma:asset/b794792dc24780002f4da9bac69d2f9acbb85463.png';

interface ARDanceGuideProps {
  templateName: string;
  musicName: string;
  bpm: number;
  onClose: () => void;
  onComplete: (score: ARScore) => void;
}

interface ARScore {
  trajectorySync: number;  // 轨迹同步分数
  rhythmMatch: number;      // 节奏对拍分数
  stability: number;        // 镜头稳定性分数
  overall: number;          // 总分
  badges: string[];         // 获得的徽章
}

interface BeatPoint {
  time: number;
  intensity: 'strong' | 'normal';
}

interface TrajectoryPoint {
  id: number;
  x: number;
  y: number;
  z: number;
  time: number;
  label: string;
  color: string;
}

export default function ARDanceGuide({ templateName, musicName, bpm, onClose, onComplete }: ARDanceGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime] = useState(30); // 30秒的舞蹈序列
  const [currentBeat, setCurrentBeat] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCompleted, setIsCompleted] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false); // 新增：练习模式开关
  
  // 得分数据
  const [trajectoryScore, setTrajectoryScore] = useState(0);
  const [rhythmScore, setRhythmScore] = useState(0);
  const [stabilityScore, setStabilityScore] = useState(0);
  const [currentNodeScore, setCurrentNodeScore] = useState<number | null>(null);
  const [showNodeScore, setShowNodeScore] = useState(false);
  
  // 轨迹数据
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [userDeviation, setUserDeviation] = useState(0); // 0-100, 0是完美对齐
  
  // 实时提示
  const [guidanceText, setGuidanceText] = useState('准备开始，跟随音乐和轨迹移动...');
  const [feedbackType, setFeedbackType] = useState<'good' | 'warning' | 'error' | 'perfect'>('good');

  // 模拟音乐节拍点
  const beatInterval = 60 / bpm * 1000; // 毫秒
  const beatsPerBar = 4;
  
  // 模拟运镜轨迹点 - 使用C/F/S话术体系
  // C = Camera (摄影机运动) / F = Focus (焦点调整) / S = Subject (主体跟随)
  const trajectoryPoints: TrajectoryPoint[] = [
    { id: 1, x: 0, y: 0, z: 0, time: 0, label: 'C-定位', color: '#00A8E8' },
    { id: 2, x: -2, y: 0.5, z: 1, time: 4, label: 'C-平移+推进', color: '#00A8E8' },
    { id: 3, x: -1, y: 1, z: 2, time: 8, label: 'C-升高+拉远', color: '#00A8E8' },
    { id: 4, x: 2, y: 0.5, z: 1, time: 12, label: 'C-快速绕行', color: '#00A8E8' },
    { id: 5, x: 0, y: 1.5, z: 3, time: 16, label: 'F-正面聚焦', color: '#FFB800' },
    { id: 6, x: 1, y: 0.3, z: 0.5, time: 20, label: 'C-俯冲特写', color: '#00A8E8' },
    { id: 7, x: 0, y: 0.8, z: 1.5, time: 24, label: 'S-回中稳定', color: '#51CF66' },
  ];

  const currentTarget = trajectoryPoints[currentTargetIndex];
  const nextTarget = trajectoryPoints[currentTargetIndex + 1];

  // 开始倒计时
  const startCountdown = () => {
    setShowCountdown(true);
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          setIsPlaying(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 计时器
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 0.1;
        if (newTime >= totalTime) {
          setIsPlaying(false);
          handleComplete();
          return totalTime;
        }
        return newTime;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [isPlaying]);

  // 节拍追踪
  useEffect(() => {
    if (!isPlaying) return;
    
    const beatNum = Math.floor(currentTime / (60 / bpm));
    setCurrentBeat(beatNum);
    
    // 根据当前时间更新目标点
    const targetIndex = trajectoryPoints.findIndex(point => point.time > currentTime) - 1;
    if (targetIndex >= 0 && targetIndex !== currentTargetIndex) {
      setCurrentTargetIndex(targetIndex);
      // 播放节点到达音效
      showNodeScoreAnimation(85 + Math.random() * 15);
    }
  }, [currentTime, isPlaying, currentTargetIndex, bpm]);

  // 实时反馈逻辑
  useEffect(() => {
    if (!isPlaying || !nextTarget) return;
    
    const feedbackInterval = setInterval(() => {
      // 模拟用户偏差（实际应该从陀螺仪/加速度计获取）
      const deviation = Math.random() * 30;
      setUserDeviation(deviation);
      
      // 根据偏差和时间点提供引导
      const timeToNext = nextTarget.time - currentTime;
      
      if (timeToNext < 2 && timeToNext > 0.5) {
        if (deviation < 10) {
          setGuidanceText(`完美！保持这个节奏`);
          setFeedbackType('perfect');
          setTrajectoryScore(prev => Math.min(100, prev + 0.5));
        } else if (deviation < 20) {
          setGuidanceText(`${nextTarget.label}，准备移动！`);
          setFeedbackType('good');
        } else {
          setGuidanceText(`调整方向，往${getDirectionHint(nextTarget)}！`);
          setFeedbackType('warning');
        }
      } else if (timeToNext <= 0.5 && timeToNext > 0) {
        setGuidanceText(`3、2、1，${nextTarget.label}！`);
        setFeedbackType('good');
      }
      
      // 稳定性评分（模拟）
      setStabilityScore(prev => Math.min(100, prev + 0.3));
    }, 200); // 每200ms更新一次
    
    return () => clearInterval(feedbackInterval);
  }, [isPlaying, nextTarget, currentTime]);

  // 节奏匹配评分
  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentBeat % beatsPerBar === 0 && currentBeat > 0) {
      setRhythmScore(prev => Math.min(100, prev + 1));
    }
  }, [currentBeat, isPlaying]);

  const getDirectionHint = (target: TrajectoryPoint) => {
    if (target.x < -1) return '左侧';
    if (target.x > 1) return '右侧';
    if (target.y > 1) return '上方';
    if (target.y < 0.5) return '下方';
    return '前方';
  };

  const showNodeScoreAnimation = (score: number) => {
    setCurrentNodeScore(Math.round(score));
    setShowNodeScore(true);
    setTimeout(() => setShowNodeScore(false), 2000);
  };

  const handleComplete = () => {
    const overall = Math.round((trajectoryScore + rhythmScore + stabilityScore) / 3);
    const badges: string[] = [];
    
    if (rhythmScore >= 90) badges.push('音乐卡点王');
    if (trajectoryScore >= 90) badges.push('轨迹同步大师');
    if (stabilityScore >= 90) badges.push('稳定运镜专家');
    if (overall >= 95) badges.push('完美表演');
    
    setIsCompleted(true);
    
    onComplete({
      trajectorySync: Math.round(trajectoryScore),
      rhythmMatch: Math.round(rhythmScore),
      stability: Math.round(stabilityScore),
      overall,
      badges
    });
  };

  const handleReset = () => {
    setCurrentTime(0);
    setCurrentBeat(0);
    setCurrentTargetIndex(0);
    setTrajectoryScore(0);
    setRhythmScore(0);
    setStabilityScore(0);
    setIsPlaying(false);
    setIsCompleted(false);
    setGuidanceText('准备开始，跟随音乐和轨迹移动...');
  };

  // 完成弹窗
  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-2xl p-6 max-w-sm w-full border border-white/10"
        >
          {/* 头部 */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00A8E8] to-[#0080FF] mx-auto mb-4 flex items-center justify-center"
            >
              <Award className="w-12 h-12 text-white" />
            </motion.div>
            <h3 className="text-white mb-1.5" style={{ fontSize: '18px', fontWeight: 700 }}>拍摄完成！</h3>
            <p className="text-white/60" style={{ fontSize: '14px' }}>{templateName}</p>
          </div>

          {/* 总分 */}
          <div className="bg-white/[0.06] rounded-xl p-5 mb-5 text-center border border-white/[0.08]">
            <div className="text-white/60 mb-2" style={{ fontSize: '13px' }}>综合得分</div>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00A8E8] to-[#51CF66]">
              {Math.round((trajectoryScore + rhythmScore + stabilityScore) / 3)}
            </div>
          </div>

          {/* 详细得分 */}
          <div className="space-y-3 mb-5">
            <ScoreItem icon={<Target className="w-5 h-5" />} label="轨迹同步" score={Math.round(trajectoryScore)} />
            <ScoreItem icon={<Music className="w-5 h-5" />} label="节奏对拍" score={Math.round(rhythmScore)} />
            <ScoreItem icon={<TrendingUp className="w-5 h-5" />} label="镜头稳定" score={Math.round(stabilityScore)} />
          </div>

          {/* 徽章 */}
          {((trajectoryScore >= 90 || rhythmScore >= 90 || stabilityScore >= 90)) && (
            <div className="bg-white/[0.04] rounded-xl p-4 mb-5 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-[#FFB800]" />
                <span className="font-bold text-white" style={{ fontSize: '14px' }}>获得徽章</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {rhythmScore >= 90 && <Badge text="音乐卡点王" />}
                {trajectoryScore >= 90 && <Badge text="轨迹同步大师" />}
                {stabilityScore >= 90 && <Badge text="稳定运镜专家" />}
              </div>
            </div>
          )}

          {/* 操作按钮区 */}
          <div className="space-y-2.5">
            {/* 保存到本地相册 */}
            <button 
              onClick={() => {
                // TODO: 实现保存到本地相册的逻辑
                console.log('保存视频到本地相册');
              }}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#00A8E8] to-[#0080FF] text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
            >
              <Download className="w-4 h-4" />
              保存到相册
            </button>

            {/* 分享和发布 */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => {
                  // TODO: 实现分享到社交媒体的辑
                  console.log('分享到社交媒体');
                }}
                className="h-11 rounded-xl bg-white/[0.08] text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all border border-white/[0.08]"
              >
                <Share2 className="w-4 h-4" />
                社交分享
              </button>
              <button 
                onClick={() => {
                  // TODO: 实现发布到创作者社区的逻辑
                  console.log('发布到创作者社区');
                }}
                className="h-11 rounded-xl bg-white/[0.08] text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all border border-white/[0.08]"
              >
                <Send className="w-4 h-4" />
                发布社区
              </button>
            </div>

            {/* 重新拍摄和关闭 */}
            <div className="flex gap-2 pt-1">
              <button 
                onClick={handleReset}
                className="flex-1 h-10 rounded-xl bg-white/[0.04] text-white/70 font-bold flex items-center justify-center gap-2 active:scale-95 transition-all border border-white/[0.06]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                重新拍摄
              </button>
              <button 
                onClick={onClose}
                className="flex-1 h-10 rounded-xl bg-white/[0.04] text-white/70 font-bold flex items-center justify-center gap-2 active:scale-95 transition-all border border-white/[0.06]"
              >
                <X className="w-3.5 h-3.5" />
                关闭
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* VR引导模式监控图 - 舞蹈画面背景 */}
      <div className="absolute inset-0">
        <ImageWithFallback 
          src={danceImage}
          alt="VR舞蹈引导监控画面"
          className="w-full h-full object-cover"
        />
        {/* 深色叠加层增强AR元素可见性 */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* AR 叠加层 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 音乐节拍条 - 顶部 */}
        <MusicBeatBar 
          currentBeat={currentBeat} 
          beatsPerBar={beatsPerBar}
          bpm={bpm}
          musicName={musicName}
          isPlaying={isPlaying}
        />

        {/* 3D AR空间引导层 - 增强版 */}
        <PokemonGOStyleAROverlay 
          trajectoryPoints={trajectoryPoints}
          currentTargetIndex={currentTargetIndex}
          currentTime={currentTime}
          userDeviation={userDeviation}
          isPlaying={isPlaying}
          nextTarget={nextTarget}
          practiceMode={practiceMode}
        />

        {/* 节点得分动画 */}
        <AnimatePresence>
          {showNodeScore && currentNodeScore && (
            <motion.div
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: 1.2, y: -50 }}
              exit={{ scale: 0.8, opacity: 0, y: -100 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="text-4xl font-bold text-[#51CF66] drop-shadow-lg">
                +{currentNodeScore}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 实时引导提示 - 底部 */}
        {/* 播放开始后移除引导提示条 */}
      </div>

      {/* 倒计时覆盖层 */}
      <AnimatePresence>
        {showCountdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="text-9xl font-bold text-white"
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 控制按钮 - 底部中央 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto z-10">
        {!isPlaying && currentTime === 0 && (
          <button
            onClick={startCountdown}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00A8E8] to-[#0080FF] flex items-center justify-center active:scale-90 transition-all shadow-lg"
          >
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </button>
        )}
        
        {isPlaying && (
          <>
            <button
              onClick={() => setIsPlaying(false)}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-all"
            >
              <Pause className="w-6 h-6 text-white" fill="white" />
            </button>
          </>
        )}

        {!isPlaying && currentTime > 0 && currentTime < totalTime && (
          <button
            onClick={() => setIsPlaying(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00A8E8] to-[#0080FF] flex items-center justify-center active:scale-90 transition-all shadow-lg"
          >
            <Play className="w-7 h-7 text-white ml-1" fill="white" />
          </button>
        )}

        <button
          onClick={handleReset}
          className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-all"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={onClose}
          className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-all"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* 得分显示 - 右上角 */}
      <ScoreDisplay 
        trajectoryScore={trajectoryScore}
        rhythmScore={rhythmScore}
        stabilityScore={stabilityScore}
        isPlaying={isPlaying}
      />

      {/* 进度条 - 顶部下方 */}
      {isPlaying && (
        <div className="absolute top-20 left-0 right-0 px-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#00A8E8] to-[#51CF66]"
              style={{ width: `${(currentTime / totalTime) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 音乐节拍条组件
function MusicBeatBar({ currentBeat, beatsPerBar, bpm, musicName, isPlaying }: any) {
  return (
    <div className="absolute top-0 left-0 right-0 p-4">
      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        {/* 音乐信息 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-[#00A8E8]" />
            <span className="caption font-bold text-white">{musicName}</span>
          </div>
          <span className="micro text-white/60">{bpm} BPM</span>
        </div>
        
        {/* 节拍可视化 */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 16 }).map((_, i) => {
            const beatNum = i + 1;
            const isCurrentBeat = currentBeat % 16 === i;
            const isStrongBeat = beatNum % beatsPerBar === 1;
            
            return (
              <motion.div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all ${
                  isCurrentBeat 
                    ? 'bg-[#00A8E8]' 
                    : isStrongBeat 
                    ? 'bg-white/30' 
                    : 'bg-white/10'
                }`}
                animate={isCurrentBeat && isPlaying ? {
                  scale: [1, 1.5, 1],
                  opacity: [1, 1, 0.5]
                } : {}}
                transition={{ duration: 0.3 }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 实时反馈提示
function RealtimeFeedback({ text, type, isPlaying }: any) {
  if (!isPlaying) return null;
  
  const bgColor = {
    perfect: 'from-[#51CF66]/90 to-[#40C057]/90',
    good: 'from-[#00A8E8]/90 to-[#0080FF]/90',
    warning: 'from-[#FFB800]/90 to-[#FF8C00]/90',
    error: 'from-[#FF6B6B]/90 to-[#FF5252]/90'
  }[type];
  
  return (
    <motion.div
      key={text}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className="absolute bottom-24 left-0 right-0 px-4"
    >
      <div className={`bg-gradient-to-r ${bgColor} backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg`}>
        <div className="text-center text-white font-bold">
          {text}
        </div>
      </div>
    </motion.div>
  );
}

// 得分显示
function ScoreDisplay({ trajectoryScore, rhythmScore, stabilityScore, isPlaying }: any) {
  if (!isPlaying) return null;
  
  return (
    <div className="absolute top-24 right-4 space-y-2">
      <ScoreBadge icon={<Target className="w-3.5 h-3.5" />} label="轨迹" score={Math.round(trajectoryScore)} color="#00A8E8" />
      <ScoreBadge icon={<Music className="w-3.5 h-3.5" />} label="节奏" score={Math.round(rhythmScore)} color="#FFB800" />
      <ScoreBadge icon={<TrendingUp className="w-3.5 h-3.5" />} label="稳定" score={Math.round(stabilityScore)} color="#51CF66" />
    </div>
  );
}

function ScoreBadge({ icon, label, score, color }: any) {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10 min-w-[80px]"
    >
      <div className="flex items-center gap-2 mb-1">
        <div style={{ color }}>{icon}</div>
        <span className="micro text-white/70">{label}</span>
      </div>
      <div className="font-bold text-white" style={{ color }}>{score}</div>
    </motion.div>
  );
}

function ScoreItem({ icon, label, score }: any) {
  return (
    <div className="flex items-center justify-between bg-white/[0.04] rounded-lg p-3 border border-white/[0.08]">
      <div className="flex items-center gap-2">
        <div className="text-[#00A8E8]">{icon}</div>
        <span className="caption text-white/80">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`h-full rounded-full ${
              score >= 90 ? 'bg-gradient-to-r from-[#51CF66] to-[#40C057]' :
              score >= 75 ? 'bg-gradient-to-r from-[#00A8E8] to-[#0080FF]' :
              'bg-gradient-to-r from-[#FFB800] to-[#FF8C00]'
            }`}
          />
        </div>
        <span className="caption font-bold text-white min-w-[32px] text-right">{score}</span>
      </div>
    </div>
  );
}

function Badge({ text }: any) {
  return (
    <div className="inline-flex items-center gap-1 bg-gradient-to-r from-[#FFB800]/20 to-[#FF8C00]/20 border border-[#FFB800]/30 rounded-full px-2 py-1">
      <Zap className="w-3 h-3 text-[#FFB800]" fill="#FFB800" />
      <span className="micro text-[#FFB800] font-bold">{text}</span>
    </div>
  );
}