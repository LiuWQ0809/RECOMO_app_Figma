import { useState } from 'react';
import { X, Music, Scan, Check, ChevronRight, Upload, Library, Video, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SequenceSetupModalProps {
  sequenceName?: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (config: { music: MusicConfig; scene: SceneConfig }) => void;
}

interface MusicConfig {
  type: 'original' | 'library' | 'skip';
  name?: string;
  bpm?: number;
}

interface SceneConfig {
  type: 'phone' | 'recomo' | 'skip';
  scanData?: any;
}

export default function SequenceSetupModal({ sequenceName = '运镜序列', isOpen, onClose, onComplete }: SequenceSetupModalProps) {
  const [musicConfig, setMusicConfig] = useState<MusicConfig>({ type: 'original' });
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>({ type: 'recomo' });
  const [showMusicOptions, setShowMusicOptions] = useState(false);
  const [showSceneOptions, setShowSceneOptions] = useState(false);

  const handleComplete = () => {
    onComplete?.({ music: musicConfig, scene: sceneConfig });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <motion.div
        initial={{ y: 400, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] rounded-t-3xl w-full max-w-md border-t border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-bold">设置运镜参数</h3>
            <p className="text-white/60 caption">{sequenceName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* 音乐适配 */}
          <div className="bg-white/[0.06] rounded-xl p-4 border border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFB800]/20 flex items-center justify-center">
                  <Music className="w-4 h-4 text-[#FFB800]" />
                </div>
                <div>
                  <h4 className="caption font-bold text-white">音乐适配</h4>
                  <p className="micro text-white/50">选择运镜配乐</p>
                </div>
              </div>
              {musicConfig.type === 'skip' && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10">
                  <Check className="w-3 h-3 text-white/60" />
                  <span className="micro text-white/60">已跳过</span>
                </div>
              )}
            </div>

            {/* 音乐选项 */}
            <div className="space-y-2">
              <button
                onClick={() => setMusicConfig({ type: 'original' })}
                className={`w-full p-3 rounded-lg transition-all flex items-center justify-between ${
                  musicConfig.type === 'original'
                    ? 'bg-[#FFB800]/20 border border-[#FFB800]/40'
                    : 'bg-white/[0.04] border border-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-white/70" />
                  <div className="text-left">
                    <div className="caption text-white font-semibold">使用原音乐</div>
                    <div className="micro text-white/50">保留视频原始配乐</div>
                  </div>
                </div>
                {musicConfig.type === 'original' && (
                  <CheckCircle2 className="w-5 h-5 text-[#FFB800]" fill="#FFB800" />
                )}
              </button>

              <button
                onClick={() => {
                  setMusicConfig({ type: 'library' });
                  setShowMusicOptions(true);
                }}
                className={`w-full p-3 rounded-lg transition-all flex items-center justify-between ${
                  musicConfig.type === 'library'
                    ? 'bg-[#FFB800]/20 border border-[#FFB800]/40'
                    : 'bg-white/[0.04] border border-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Library className="w-4 h-4 text-white/70" />
                  <div className="text-left">
                    <div className="caption text-white font-semibold">从乐库导入</div>
                    <div className="micro text-white/50">选择其他音乐</div>
                  </div>
                </div>
                {musicConfig.type === 'library' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#FFB800]" fill="#FFB800" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/40" />
                )}
              </button>

              <button
                onClick={() => setMusicConfig({ type: 'skip' })}
                className="w-full py-2 text-center caption text-white/60 hover:text-white transition-colors"
              >
                跳过音乐设置
              </button>
            </div>
          </div>

          {/* 场景扫描 */}
          <div className="bg-white/[0.06] rounded-xl p-4 border border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00A8E8]/20 flex items-center justify-center">
                  <Scan className="w-4 h-4 text-[#00A8E8]" />
                </div>
                <div>
                  <h4 className="caption font-bold text-white">场景扫描</h4>
                  <p className="micro text-white/50">建立3D空间模型</p>
                </div>
              </div>
              {sceneConfig.type === 'skip' && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10">
                  <Check className="w-3 h-3 text-white/60" />
                  <span className="micro text-white/60">已跳过</span>
                </div>
              )}
            </div>

            {/* 场景选项 */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSceneConfig({ type: 'phone' });
                  setShowSceneOptions(true);
                }}
                className={`w-full p-3 rounded-lg transition-all flex items-center justify-between ${
                  sceneConfig.type === 'phone'
                    ? 'bg-[#00A8E8]/20 border border-[#00A8E8]/40'
                    : 'bg-white/[0.04] border border-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-2xl">📱</div>
                  <div className="text-left">
                    <div className="caption text-white font-semibold">手机摄像头扫描</div>
                    <div className="micro text-white/50">快速建模(精度70%)</div>
                  </div>
                </div>
                {sceneConfig.type === 'phone' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#00A8E8]" fill="#00A8E8" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/40" />
                )}
              </button>

              <button
                onClick={() => {
                  setSceneConfig({ type: 'recomo' });
                  setShowSceneOptions(true);
                }}
                className={`w-full p-3 rounded-lg transition-all flex items-center justify-between ${
                  sceneConfig.type === 'recomo'
                    ? 'bg-[#00A8E8]/20 border border-[#00A8E8]/40'
                    : 'bg-white/[0.04] border border-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-2xl">🤖</div>
                  <div className="text-left">
                    <div className="caption text-white font-semibold">RECOMO精细扫描</div>
                    <div className="micro text-white/50">高精度建模(推荐)</div>
                  </div>
                </div>
                {sceneConfig.type === 'recomo' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#00A8E8]" fill="#00A8E8" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/40" />
                )}
              </button>

              <button
                onClick={() => setSceneConfig({ type: 'skip' })}
                className="w-full py-2 text-center caption text-white/60 hover:text-white transition-colors"
              >
                跳过场景扫描
              </button>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="bg-gradient-to-r from-[#00A8E8]/10 to-[#0080FF]/10 rounded-lg p-3 border border-[#00A8E8]/20">
            <p className="micro text-white/70 text-center">
              💡 音乐适配和场景扫描可以提升运镜效果，但不是必需的
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleComplete}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00A8E8] to-[#0080FF] text-white font-bold active:scale-95 transition-all shadow-lg"
          >
            下一步
          </button>
          <div className="flex items-center justify-center gap-1">
            <span className="micro text-white/50">配置可在稍后修改</span>
          </div>
        </div>
      </motion.div>

      {/* 乐库选择弹窗 (TODO: 实现) */}
      <AnimatePresence>
        {showMusicOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowMusicOptions(false)}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-sm">
              <p className="text-white text-center">乐库功能开发中...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 场景扫描弹窗 (TODO: 实现) */}
      <AnimatePresence>
        {showSceneOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowSceneOptions(false)}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-sm">
              <p className="text-white text-center">场景扫描功能开发中...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}