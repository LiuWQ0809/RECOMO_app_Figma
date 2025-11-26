import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Play, Camera, Zap, Music, MapPin, CheckCircle2, ChevronRight, Sparkles, Clock, Ruler, Wind, Video, Image as ImageIcon, UserPlus, Settings, ChevronDown, ChevronUp } from 'lucide-react';

interface TemplatePageProps {
  template: any;
  onBack: () => void;
  onStartShooting: (template: any) => void;
  onPreview?: (template: any) => void;
}

// Sequence 组成单元类型定义
type SequenceUnitType = 'C' | 'S' | 'F' | 'POI';

interface SequenceUnit {
  id: string;
  type: SequenceUnitType;
  code: string; // 例如 C1, S2, F3
  name: string;
  duration: number; // 秒
  params: {
    distance?: number; // 米
    speed?: number; // m/s
    height?: number; // 米
    angle?: number; // 度
    count?: number; // 照片数量
    [key: string]: any;
  };
  aiAdapted?: boolean;
  manualEdited?: boolean;
}

export default function TemplatePreparePage({ template, onBack, onStartShooting, onPreview }: TemplatePageProps) {
  const [sceneScanned, setSceneScanned] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [adaptationComplete, setAdaptationComplete] = useState(false);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [showTemplateScene, setShowTemplateScene] = useState(false);
  const [showPreviewSimulator, setShowPreviewSimulator] = useState(false);

  // 模拟 Sequence 数据 - 实际应该从 template 中获取
  const [sequenceUnits, setSequenceUnits] = useState<SequenceUnit[]>([
    {
      id: '1',
      type: 'C',
      code: 'C2',
      name: '急速倒退',
      duration: 8,
      params: {
        distance: 5.2,
        speed: 0.65,
        height: 1.5,
        angle: 0,
      },
    },
    {
      id: '2',
      type: 'S',
      code: 'S1',
      name: '静态特写',
      duration: 3,
      params: {
        count: 5,
        interval: 0.6,
      },
    },
    {
      id: '3',
      type: 'POI',
      code: 'POI',
      name: '兴趣点标记',
      duration: 0,
      params: {
        points: 3,
      },
    },
    {
      id: '4',
      type: 'C',
      code: 'C1',
      name: '上升展开',
      duration: 6,
      params: {
        distance: 3.2,
        speed: 0.5,
        height: 2.5,
        angle: 15,
      },
    },
    {
      id: '5',
      type: 'F',
      code: 'F1',
      name: '跟随拍摄',
      duration: 10,
      params: {
        distance: 2.0,
        speed: 0.4,
        mode: 'smooth',
      },
    },
  ]);

  const totalDuration = sequenceUnits.reduce((sum, unit) => sum + unit.duration, 0);

  const handleAIAdaptUnit = (unitId: string) => {
    setSequenceUnits(units =>
      units.map(unit =>
        unit.id === unitId
          ? {
              ...unit,
              aiAdapted: true,
              params: {
                ...unit.params,
                // AI 适配后的参数（模拟）
                distance: unit.params.distance ? unit.params.distance * 0.92 : undefined,
                speed: unit.params.speed ? unit.params.speed * 0.95 : undefined,
              },
            }
          : unit
      )
    );
  };

  const handleAIAdaptAll = () => {
    sequenceUnits.forEach(unit => {
      if (!unit.aiAdapted) {
        setTimeout(() => handleAIAdaptUnit(unit.id), Math.random() * 1000);
      }
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-none bg-[#0A0A0A] border-b border-white/[0.06]" style={{ paddingTop: 'max(44px, env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={onBack}
            className="flex-none w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all active:scale-90 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <h2 className="font-bold text-white" style={{ fontSize: '20px' }}>Sequence 配置</h2>
          <button
            onClick={() => onStartShooting(template)}
            className="flex-none caption font-semibold text-brand active:scale-95 transition-all"
          >
            跳过
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 pb-32">
          
          {/* Sequence 概览 */}
          <div className="mt-6 mb-6">
            <div className="bg-gradient-to-br from-[#00A8E8]/20 to-[#0080FF]/20 border border-white/10 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="body-l font-bold text-white mb-1">{template.title}</h2>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-brand-gradient rounded-md">
                      <span className="micro font-bold text-white">{template.sequenceCode}</span>
                    </div>
                    <span className="caption text-white/70">{template.sequenceName}</span>
                  </div>
                </div>
                {template.tag && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-brand-gradient backdrop-blur-sm rounded-lg flex-none">
                    <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    <span className="micro font-bold text-white">{template.tag}</span>
                  </div>
                )}
              </div>

              {/* Sequence 组成流程 */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 mb-3 border border-white/10">
                <div className="caption text-white/70 mb-2">Sequence 流程</div>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                  {sequenceUnits.map((unit, index) => (
                    <div key={unit.id} className="flex items-center gap-2 flex-none">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        {getUnitIcon(unit.type)}
                        <span className="caption font-bold text-white">{unit.code}</span>
                      </div>
                      {index < sequenceUnits.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-white/30 flex-none" strokeWidth={2} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
                  <div className="micro text-white/50 mb-0.5">总时长</div>
                  <div className="caption font-bold text-white">{totalDuration}秒</div>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
                  <div className="micro text-white/50 mb-0.5">单元数</div>
                  <div className="caption font-bold text-white">{sequenceUnits.length}个</div>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
                  <div className="micro text-white/50 mb-0.5">作者</div>
                  <div className="caption font-bold text-white truncate">{template.author}</div>
                </div>
              </div>

              {/* 查看模版参考场景按钮 */}
              <button 
                onClick={() => setShowTemplateScene(true)}
                className="w-full mt-3 py-3 bg-transparent border-2 border-[#00A8E8] rounded-xl caption font-semibold text-brand active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" strokeWidth={2.5} />
                <span>查看模版参考场景</span>
              </button>
            </div>
          </div>

          {/* Step 1: 场景扫描 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${sceneScanned ? 'bg-[#00DC82]' : 'bg-brand-gradient'}`}>
                  {sceneScanned ? (
                    <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                  ) : (
                    <span className="micro font-bold text-white">1</span>
                  )}
                </div>
                <h3 className="body font-bold text-white">场景扫描与建模</h3>
              </div>
              {sceneScanned && (
                <span className="caption text-[#00DC82] font-semibold">已完成</span>
              )}
            </div>
            <SceneScanCard
              scanned={sceneScanned}
              onScan={() => setSceneScanned(true)}
              projectId={template?.projectId}
              videoUrl={template?.videoUrl}
              templateKey={
                template?.id ||
                template?.videoUrl ||
                template?.title ||
                template?.sequenceName
              }
            />
          </div>

          {/* Step 2: Sequence 单元配置 */}
          {sceneScanned && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${adaptationComplete ? 'bg-[#00DC82]' : 'bg-brand-gradient'}`}>
                    {adaptationComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                    ) : (
                      <span className="micro font-bold text-white">2</span>
                    )}
                  </div>
                  <h3 className="body font-bold text-white">Sequence 单元配置</h3>
                </div>
                <button
                  onClick={handleAIAdaptAll}
                  className="caption font-semibold text-brand flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4" strokeWidth={2} />
                  <span>AI 一键适配</span>
                </button>
              </div>

              {/* 单元列表 */}
              <div className="space-y-2">
                {sequenceUnits.map((unit, index) => (
                  <SequenceUnitCard
                    key={unit.id}
                    unit={unit}
                    index={index}
                    expanded={expandedUnit === unit.id}
                    onToggle={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                    onAIAdapt={() => handleAIAdaptUnit(unit.id)}
                    onParamChange={(params) => {
                      setSequenceUnits(units =>
                        units.map(u =>
                          u.id === unit.id
                            ? { ...u, params, manualEdited: true }
                            : u
                        )
                      );
                    }}
                  />
                ))}
              </div>

              {sequenceUnits.every(u => u.aiAdapted || u.type === 'POI') && !adaptationComplete && (
                <button
                  onClick={() => setAdaptationComplete(true)}
                  className="w-full mt-3 py-3 bg-[#00DC82]/20 border border-[#00DC82]/40 rounded-xl caption font-bold text-[#00DC82] active:scale-95 transition-all"
                >
                  确认配置并继续
                </button>
              )}
            </div>
          )}

          {/* Step 3: 音乐匹配 */}
          {adaptationComplete && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedMusic ? 'bg-[#00DC82]' : 'bg-brand-gradient'}`}>
                  {selectedMusic ? (
                    <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                  ) : (
                    <span className="micro font-bold text-white">3</span>
                  )}
                </div>
                <h3 className="body font-bold text-white">音乐节奏匹配</h3>
              </div>
              <MusicMatchCard selectedMusic={selectedMusic} onSelect={setSelectedMusic} totalDuration={totalDuration} />
            </div>
          )}

          {/* 开始拍摄 CTA - 始终显示，根据状态启用/禁用 */}
          <div className="mb-6">
            <div className={`border rounded-2xl p-5 transition-all ${
              sceneScanned && adaptationComplete && selectedMusic
                ? 'bg-gradient-to-br from-[#00DC82]/20 to-[#00A8E8]/20 border-[#00DC82]/40'
                : 'bg-[#1C1C1E] border-white/[0.08]'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-none ${
                  sceneScanned && adaptationComplete && selectedMusic
                    ? 'bg-[#00DC82]'
                    : 'bg-white/10'
                }`}>
                  {sceneScanned && adaptationComplete && selectedMusic ? (
                    <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />
                  ) : (
                    <Camera className="w-6 h-6 text-white/50" strokeWidth={2.5} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="body font-bold text-white mb-1">
                    {sceneScanned && adaptationComplete && selectedMusic ? '配置完成！' : '准备开始拍摄'}
                  </h3>
                  <p className="caption text-white/70">
                    {sceneScanned && adaptationComplete && selectedMusic 
                      ? 'AI已优化运镜参数，准备开始拍摄' 
                      : '完成以下步骤后可开始拍摄'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => onStartShooting(template)}
                  disabled={!(sceneScanned && adaptationComplete && selectedMusic)}
                  className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all ${
                    sceneScanned && adaptationComplete && selectedMusic
                      ? 'bg-brand-gradient shadow-brand/20 active:scale-98'
                      : 'bg-white/[0.08] cursor-not-allowed opacity-50'
                  }`}
                >
                  <Camera className="w-5 h-5 text-white" strokeWidth={2.5} />
                  <span className="body font-bold text-white">开始拍摄</span>
                </button>
                <button 
                  onClick={() => setShowPreviewSimulator(true)}
                  className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 border border-white/20 bg-white/[0.08] active:scale-98 transition-all"
                >
                  <Play className="w-5 h-5 text-white" strokeWidth={2.5} />
                  <span className="body font-bold text-white">Preview</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 text-center">
                  <div className="micro text-white/50 mb-0.5">场景</div>
                  <div className={`caption font-semibold ${sceneScanned ? 'text-[#00DC82]' : 'text-white/30'}`}>
                    {sceneScanned ? '已扫描' : '未扫描'}
                  </div>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 text-center">
                  <div className="micro text-white/50 mb-0.5">参数</div>
                  <div className={`caption font-semibold ${adaptationComplete ? 'text-[#00DC82]' : 'text-white/30'}`}>
                    {adaptationComplete ? '已优化' : '未优化'}
                  </div>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 text-center">
                  <div className="micro text-white/50 mb-0.5">音乐</div>
                  <div className={`caption font-semibold ${selectedMusic ? 'text-[#00DC82]' : 'text-white/30'}`}>
                    {selectedMusic ? '已匹配' : '未匹配'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      {sceneScanned && adaptationComplete && selectedMusic && (
        <div className="flex-none bg-[#0A0A0A] border-t border-white/[0.06] p-5" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
          <button 
            onClick={() => onStartShooting(template)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            <span>下一步</span>
          </button>
        </div>
      )}

      {/* 模板参考场景模拟器 */}
      {showTemplateScene && (
        <SequenceSimulator 
          onClose={() => setShowTemplateScene(false)}
          scannedScene={null}
          projectId={template?.projectId}
          videoUrl={template?.videoUrl}
        />
      )}

      {/* Preview - Sequence 预览页面 */}
      {showPreviewSimulator && (
        <SequencePreview 
          onClose={() => setShowPreviewSimulator(false)}
        />
      )}
    </div>
  );
}

// 获取单元类型图标
function getUnitIcon(type: SequenceUnitType) {
  const iconProps = { className: "w-3.5 h-3.5 text-white flex-none", strokeWidth: 2.5 };
  switch (type) {
    case 'C':
      return <Video {...iconProps} />;
    case 'S':
      return <ImageIcon {...iconProps} />;
    case 'F':
      return <UserPlus {...iconProps} />;
    case 'POI':
      return <MapPin {...iconProps} />;
  }
}

// Sequence 单元卡片
function SequenceUnitCard({
  unit,
  index,
  expanded,
  onToggle,
  onAIAdapt,
  onParamChange,
}: {
  unit: SequenceUnit;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onAIAdapt: () => void;
  onParamChange: (params: any) => void;
}) {
  const typeConfig = {
    C: { label: 'Clip 运镜', color: '#00A8E8', bgColor: 'bg-[#00A8E8]/10', borderColor: 'border-[#00A8E8]/30' },
    S: { label: 'Still 照片', color: '#FFB800', bgColor: 'bg-[#FFB800]/10', borderColor: 'border-[#FFB800]/30' },
    F: { label: 'Follow 跟随', color: '#00DC82', bgColor: 'bg-[#00DC82]/10', borderColor: 'border-[#00DC82]/30' },
    POI: { label: 'POI 兴趣点', color: '#A855F7', bgColor: 'bg-[#A855F7]/10', borderColor: 'border-[#A855F7]/30' },
  };

  const config = typeConfig[unit.type];

  return (
    <div className={`bg-[#1C1C1E] rounded-xl border border-white/[0.08] overflow-hidden transition-all ${expanded ? 'ring-2 ring-white/10' : ''}`}>
      {/* 单元头部 */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 active:bg-white/[0.02] transition-colors"
      >
        {/* 序号 */}
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-none">
          <span className="micro font-bold text-white">{index + 1}</span>
        </div>

        {/* 单元信息 */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`px-2 py-0.5 rounded-md ${config.bgColor} border ${config.borderColor} flex items-center gap-1`}>
              {getUnitIcon(unit.type)}
              <span className="micro font-bold" style={{ color: config.color }}>{unit.code}</span>
            </div>
            <span className="caption font-semibold text-white truncate">{unit.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="micro text-white/50">{config.label}</span>
            {unit.duration > 0 && (
              <>
                <span className="text-white/20">·</span>
                <span className="micro text-white/50">{unit.duration}秒</span>
              </>
            )}
            {unit.aiAdapted && (
              <>
                <span className="text-white/20">·</span>
                <span className="micro text-[#00DC82] font-semibold">已适配</span>
              </>
            )}
            {unit.manualEdited && (
              <>
                <span className="text-white/20">·</span>
                <span className="micro text-brand font-semibold">已编辑</span>
              </>
            )}
          </div>
        </div>

        {/* 展开图标 */}
        <div className="flex-none">
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-white/50" strokeWidth={2} />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/50" strokeWidth={2} />
          )}
        </div>
      </button>

      {/* 展开内容 - 参数调整 */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.06]">
          <div className="pt-3 space-y-3">
            {/* 参数列表 */}
            <div className="space-y-2">
              {unit.type === 'C' && (
                <>
                  <ParamRow
                    label="运镜距离"
                    value={unit.params.distance || 0}
                    unit="米"
                    min={1}
                    max={10}
                    step={0.1}
                    onChange={(val) => onParamChange({ ...unit.params, distance: val })}
                  />
                  <ParamRow
                    label="运动速度"
                    value={unit.params.speed || 0}
                    unit="m/s"
                    min={0.1}
                    max={2}
                    step={0.05}
                    onChange={(val) => onParamChange({ ...unit.params, speed: val })}
                  />
                  <ParamRow
                    label="拍摄高度"
                    value={unit.params.height || 0}
                    unit="米"
                    min={0.5}
                    max={3}
                    step={0.1}
                    onChange={(val) => onParamChange({ ...unit.params, height: val })}
                  />
                  <ParamRow
                    label="俯仰角度"
                    value={unit.params.angle || 0}
                    unit="°"
                    min={-30}
                    max={30}
                    step={1}
                    onChange={(val) => onParamChange({ ...unit.params, angle: val })}
                  />
                </>
              )}

              {unit.type === 'S' && (
                <>
                  <ParamRow
                    label="照片数"
                    value={unit.params.count || 0}
                    unit="张"
                    min={1}
                    max={20}
                    step={1}
                    onChange={(val) => onParamChange({ ...unit.params, count: val })}
                  />
                  <ParamRow
                    label="拍摄间隔"
                    value={unit.params.interval || 0}
                    unit="秒"
                    min={0.2}
                    max={5}
                    step={0.1}
                    onChange={(val) => onParamChange({ ...unit.params, interval: val })}
                  />
                </>
              )}

              {unit.type === 'F' && (
                <>
                  <ParamRow
                    label="跟随距离"
                    value={unit.params.distance || 0}
                    unit="米"
                    min={0.5}
                    max={5}
                    step={0.1}
                    onChange={(val) => onParamChange({ ...unit.params, distance: val })}
                  />
                  <ParamRow
                    label="跟随速度"
                    value={unit.params.speed || 0}
                    unit="m/s"
                    min={0.1}
                    max={1.5}
                    step={0.05}
                    onChange={(val) => onParamChange({ ...unit.params, speed: val })}
                  />
                </>
              )}

              {unit.type === 'POI' && (
                <div className="text-center py-3 bg-white/[0.06] rounded-lg border border-white/[0.08]">
                  <MapPin className="w-8 h-8 text-[#A855F7] mx-auto mb-2" strokeWidth={2} />
                  <p className="caption text-white/70">POI 将在拍摄时标记</p>
                  <p className="micro text-white/50 mt-1">当前场景: {unit.params.points || 0} 个兴趣点</p>
                </div>
              )}
            </div>

            {/* AI 适配按钮 */}
            {!unit.aiAdapted && unit.type !== 'POI' && (
              <button
                onClick={onAIAdapt}
                className="w-full py-2.5 bg-brand/10 border border-brand/30 rounded-xl caption font-bold text-brand active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" strokeWidth={2.5} />
                <span>AI 智能适配此单元</span>
              </button>
            )}

            {unit.aiAdapted && (
              <div className="bg-[#00DC82]/10 border border-[#00DC82]/20 rounded-xl p-2.5 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00DC82] flex-none mt-0.5" strokeWidth={2} />
                <div>
                  <p className="caption text-white mb-0.5">AI 已优化参数</p>
                  <p className="micro text-white/50">根据场景空间自动调整，保持运镜风格</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 参数调整行
function ParamRow({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="bg-white/[0.06] rounded-lg p-3 border border-white/[0.08]">
      <div className="flex items-center justify-between mb-2">
        <span className="caption text-white/70">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="body font-bold text-white">{value.toFixed(step < 1 ? 2 : 0)}</span>
          <span className="caption text-white/50">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #00A8E8 0%, #00A8E8 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="micro text-white/30">{min}{unit}</span>
        <span className="micro text-white/30">{max}{unit}</span>
      </div>
    </div>
  );
}

// 场景扫描卡片
function SceneScanCard({
  scanned,
  onScan,
  projectId,
  videoUrl,
  templateKey,
}: {
  scanned: boolean;
  onScan: () => void;
  projectId?: string;
  videoUrl?: string;
  templateKey?: string;
}) {
  const [scanning, setScanning] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showScanOptions, setShowScanOptions] = useState(false);
  const [scanMethod, setScanMethod] = useState<'phone' | 'recomo' | null>(null);
  const [scannedScene, setScannedScene] = useState<any>(null);

  const handleScan = (method: 'phone' | 'recomo') => {
    setScanMethod(method);
    setShowScanOptions(false);
    setScanning(true);
    
    // 模拟扫描过程
    setTimeout(() => {
      setScanning(false);
      const mockScene = {
        id: Date.now().toString(),
        name: method === 'phone' ? '手机扫描场景' : 'RECOMO精细场景',
        method,
        scanTime: new Date().toISOString(),
        dimensions: {
          width: 5.2,
          length: 4.8,
          height: 2.8,
        },
        obstacles: [
          { type: 'wall', position: { x: 55, y: 60 } },
          { type: 'furniture', position: { x: 85, y: 48 } },
        ],
        pois: [
          { id: 'poi1', name: '兴趣点 1', position: { x: 60, y: 65 } },
          { id: 'poi2', name: '兴趣点 2', position: { x: 75, y: 55 } },
          { id: 'poi3', name: '兴趣点 3', position: { x: 90, y: 45 } },
        ],
        lightCondition: 'good',
        accuracy: method === 'recomo' ? 98 : 88,
      };
      setScannedScene(mockScene);
      onScan();
    }, method === 'recomo' ? 3000 : 2000);
  };

  if (scanned) {
    return (
      <>
        <div className="bg-[#1C1C1E] rounded-2xl border border-white/[0.08] overflow-hidden">
          {/* 3D场景预览 */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00DC82]/20 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-[#00DC82]/40">
                  <MapPin className="w-8 h-8 text-[#00DC82]" strokeWidth={2} />
                </div>
                <p className="caption text-white/70 mb-1">
                  {scannedScene ? `${scannedScene.name}已生成` : '3D 场景模型已生成'}
                </p>
                {scannedScene && (
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <span className="micro text-white/50">精度</span>
                    <span className="caption font-bold text-[#00DC82]">{scannedScene.accuracy}%</span>
                  </div>
                )}
                <button
                  onClick={() => setShowSimulator(true)}
                  className="caption font-semibold text-brand flex items-center gap-1 mx-auto active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4" strokeWidth={2} />
                  <span>预览运镜效果</span>
                </button>
              </div>
            </div>
            
            {/* 网格线效果 */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,168,232,.3) 25%, rgba(0,168,232,.3) 26%, transparent 27%, transparent 74%, rgba(0,168,232,.3) 75%, rgba(0,168,232,.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,168,232,.3) 25%, rgba(0,168,232,.3) 26%, transparent 27%, transparent 74%, rgba(0,168,232,.3) 75%, rgba(0,168,232,.3) 76%, transparent 77%, transparent)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* 场景信息 */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white/[0.06] rounded-lg p-2 text-center border border-white/[0.08]">
                <div className="micro text-tertiary mb-1">空间范围</div>
                <div className="caption font-semibold text-white">
                  {scannedScene ? `${scannedScene.dimensions.width}×${scannedScene.dimensions.length}m` : '5.2×4.8m'}
                </div>
              </div>
              <div className="bg-white/[0.06] rounded-lg p-2 text-center border border-white/[0.08]">
                <div className="micro text-tertiary mb-1">障碍物</div>
                <div className="caption font-semibold text-white">
                  {scannedScene ? scannedScene.obstacles.length : 2} 处
                </div>
              </div>
              <div className="bg-white/[0.06] rounded-lg p-2 text-center border border-white/[0.08]">
                <div className="micro text-tertiary mb-1">光照条件</div>
                <div className="caption font-semibold text-white">良好</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowScanOptions(true)}
                className="flex-1 py-2.5 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.08] active:scale-95 transition-all flex items-center justify-center"
              >
                重新扫描
              </button>
              {scannedScene && (
                <button 
                  className="flex-1 py-2.5 bg-brand/10 border border-brand/30 rounded-xl caption font-semibold text-brand active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>保存场景</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 扫描方式选择弹窗 */}
        {showScanOptions && (
          <ScanMethodSelector
            onSelect={handleScan}
            onClose={() => setShowScanOptions(false)}
          />
        )}

        {/* Sequence 模拟器弹窗 */}
        {showSimulator && (
          <SequenceSimulator 
            onClose={() => setShowSimulator(false)}
            scannedScene={scannedScene}
            projectId={template?.projectId}
            videoUrl={template?.videoUrl}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-[#1C1C1E] rounded-2xl border border-white/[0.08] p-5">
        <div className="text-center mb-4">
          <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${scanning ? 'bg-brand/20 animate-pulse' : 'bg-white/[0.08]'} border border-white/[0.12]`}>
            <Camera className={`w-8 h-8 ${scanning ? 'text-brand' : 'text-white'}`} strokeWidth={2} />
          </div>
          <h4 className="body font-semibold text-white mb-2">
            {scanning ? (scanMethod === 'recomo' ? 'RECOMO 精细扫描中...' : '正在扫描场景...') : '扫描拍摄场景'}
          </h4>
          <p className="caption text-tertiary leading-relaxed">
            {scanning 
              ? (scanMethod === 'recomo' ? '正在进行高精度3D建模，请耐心等待' : '请缓慢移动设备，扫描整个拍摄区域')
              : '先查看模板参考场景，或扫描实际场景进行AI适配'}
          </p>
        </div>

        {!scanning && (
          <button 
            onClick={() => setShowScanOptions(true)}
            className="w-full btn-primary-sm flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" strokeWidth={2.5} />
            <span>扫描实际场景</span>
          </button>
        )}

        {scanning && (
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-brand-gradient animate-pulse w-2/3 transition-all" />
          </div>
        )}
      </div>

      {/* 扫描方式选择弹窗 */}
      {showScanOptions && (
        <ScanMethodSelector
          onSelect={handleScan}
          onClose={() => setShowScanOptions(false)}
        />
      )}

      {/* Sequence 模拟器 - 显示模板参考场景 */}
      {showSimulator && (
        <SequenceSimulator 
          onClose={() => setShowSimulator(false)}
          scannedScene={null} // null表示显示模板参考场景
          projectId={projectId}
          videoUrl={videoUrl}
        />
      )}
    </>
  );
}

// 扫描方式选择弹窗
function ScanMethodSelector({ onSelect, onClose }: { onSelect: (method: 'phone' | 'recomo') => void; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex flex-col animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="flex-1 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-none px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-white/[0.08]" style={{ paddingTop: 'max(44px, env(safe-area-inset-top))' }}>
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
            <h3 className="body font-bold text-white">选择扫描方式</h3>
          </div>
        </div>

        {/* 选项列表 */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <button
            onClick={() => onSelect('phone')}
            className="w-56 h-56 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-all border border-white/20"
          >
            <Camera className="w-16 h-16 text-white" strokeWidth={2.5} />
            <p className="caption text-white/70 mt-3">手机扫描</p>
          </button>
          <p className="caption text-white/50 mt-4">适用于快速扫描</p>

          <button
            onClick={() => onSelect('recomo')}
            className="w-56 h-56 rounded-full bg-brand-gradient flex items-center justify-center active:scale-95 transition-all border border-brand/40 mt-6"
          >
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="caption text-white/70 mt-3">RECOMO精细扫描</p>
          </button>
          <p className="caption text-white/50 mt-4">适用于高精度建模</p>
        </div>
      </div>
    </div>
  );
}

// 音乐匹配卡片
function MusicMatchCard({ selectedMusic, onSelect, totalDuration }: { selectedMusic: string | null; onSelect: (id: string) => void; totalDuration: number }) {
  const musicOptions = [
    { id: '1', name: '节奏感强 · 街头', bpm: 128, duration: totalDuration, match: 98 },
    { id: '2', name: '轻快节奏 · 日系', bpm: 110, duration: totalDuration, match: 95 },
    { id: '3', name: '舒缓氛围 · 清新', bpm: 85, duration: totalDuration, match: 87 },
  ];

  return (
    <div className="space-y-2">
      {musicOptions.map((music) => (
        <button
          key={music.id}
          onClick={() => onSelect(music.id)}
          className={`w-full rounded-xl p-4 border transition-all active:scale-98 ${
            selectedMusic === music.id
              ? 'bg-brand/10 border-brand/40'
              : 'bg-[#1C1C1E] border-white/[0.08]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-none ${
              selectedMusic === music.id ? 'bg-brand-gradient' : 'bg-white/[0.08]'
            }`}>
              <Music className={`w-5 h-5 ${selectedMusic === music.id ? 'text-white' : 'text-white/50'}`} strokeWidth={2} />
            </div>
            
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="body font-semibold text-white truncate">{music.name}</span>
                <div className={`px-2 py-0.5 rounded-md flex-none ${
                  music.match >= 95 ? 'bg-[#00DC82]/20' : 'bg-white/[0.08]'
                }`}>
                  <span className={`micro font-bold ${
                    music.match >= 95 ? 'text-[#00DC82]' : 'text-white/70'
                  }`}>{music.match}% 匹配</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="caption text-tertiary">{music.bpm} BPM</span>
                <span className="text-white/20">·</span>
                <span className="caption text-tertiary">{music.duration}秒</span>
              </div>
            </div>

            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-none ${
              selectedMusic === music.id
                ? 'border-brand bg-brand'
                : 'border-white/30'
            }`}>
              {selectedMusic === music.id && (
                <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

// Sequence 模拟器弹窗
function SequenceSimulator({
  onClose,
  scannedScene,
  projectId,
  videoUrl,
  templateKey,
}: {
  onClose: () => void;
  scannedScene: any;
  projectId?: string;
  videoUrl?: string;
  templateKey?: string;
}) {
  // 缓存工具（需在使用前定义，避免初始化引用错误）
  const cacheKeyForVideo = (key: string) => `recomo_project_cache_${key}`;
  const getCachedProjectId = (key?: string) => {
    if (!key) return undefined;
    try {
      const cached = localStorage.getItem(cacheKeyForVideo(key));
      return cached || undefined;
    } catch (e) {
      console.warn('读取缓存失败', e);
      return undefined;
    }
  };
  const setCachedProjectId = (key?: string, pid?: string) => {
    if (!key || !pid) return;
    try {
      localStorage.setItem(cacheKeyForVideo(key), pid);
    } catch (e) {
      console.warn('写入缓存失败', e);
    }
  };
  const clearCachedProjectId = (key?: string) => {
    if (!key) return;
    try {
      localStorage.removeItem(cacheKeyForVideo(key));
    } catch (e) {
      console.warn('清除缓存失败', e);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [viewerLoading, setViewerLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ points: 0, cameras: 0 });
  const [sceneData, setSceneData] = useState<any>(scannedScene || null);
  const [reconStatus, setReconStatus] = useState<string>('等待加载');
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>(() => {
    const key = templateKey || videoUrl;
    const cached = getCachedProjectId(key);
    return cached || projectId;
  });
  const [loadedProjectId, setLoadedProjectId] = useState<string | null>(null);
  const [videoWidthPct, setVideoWidthPct] = useState<number>(20); // 视频宽占比%
  const [videoDuration, setVideoDuration] = useState(0);
  const [pathDuration, setPathDuration] = useState(0);
  const statusTimer = useRef<any>(null);
  const [lastTriedProject, setLastTriedProject] = useState<string | null>(null);
  const forceNewRef = useRef(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const timelineRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const rafRef = useRef<number | null>(null);
  const currentTimeRef = useRef(0);
  // 已弃用视锥
  const durationRef = useRef(0);
  const duration = useMemo(() => {
    const d = Math.max(videoDuration || 0, pathDuration || 0);
    if (d > 0) durationRef.current = d;
    return d || durationRef.current;
  }, [videoDuration, pathDuration]);

  const formatTime = (t: number) => {
    if (!isFinite(t) || t < 0) t = 0;
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const API_BASE = import.meta.env.VITE_SFM_API_BASE || 'http://192.168.100.100:7000/api';
  const STATIC_BASE = API_BASE.replace(/\/api$/, '');

  const resolveUrl = (url: string) => (url.startsWith('http') ? url : `${STATIC_BASE}${url}`);

  const parseAsciiPly = (text: string) => {
    const lines = text.split('\n');
    let headerEnd = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().toLowerCase() === 'end_header') {
        headerEnd = i;
        break;
      }
    }
    const points: any[] = [];
    if (headerEnd === -1) return points;
    const maxPoints = 100000; // 更严格的点数上限，加快加载
    const step = Math.max(1, Math.floor((lines.length - headerEnd) / maxPoints));
    for (let i = headerEnd + 1; i < lines.length; i += step) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(/\s+/).map(parseFloat);
      if (parts.length >= 3) {
        points.push({
          x: parts[0],
          y: parts[1],
          z: parts[2],
          r: parts.length >= 6 ? parts[3] / 255 : 0.7,
          g: parts.length >= 6 ? parts[4] / 255 : 0.8,
          b: parts.length >= 6 ? parts[5] / 255 : 1.0,
        });
      }
    }
    return points;
  };

  const parseTUMPose = (text: string) => {
    const poses: any[] = [];
    const lines = text.trim().split('\n');
    for (const line of lines) {
      if (!line.trim() || line.startsWith('#')) continue;
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 8) {
        poses.push({
          ts: parseFloat(parts[0]),
          x: parseFloat(parts[1]),
          y: parseFloat(parts[2]),
          z: parseFloat(parts[3]),
          qx: parseFloat(parts[4]),
          qy: parseFloat(parts[5]),
          qz: parseFloat(parts[6]),
          qw: parseFloat(parts[7]),
        });
      }
    }
    return poses;
  };

  // 优先使用 PLYLoader (ArrayBuffer) 提升解析速度，失败则回退 ASCII
  const loadPlyGeometry = async (url: string) => {
    try {
      const THREE = await import('three');
      const { PLYLoader } = await import('three/examples/jsm/loaders/PLYLoader.js');
      const loader = new PLYLoader();
      const arrayBuffer = await (await fetch(url, { cache: 'no-cache' })).arrayBuffer();

      return await new Promise<any[]>((resolve, reject) => {
        try {
          const geometry = loader.parse(arrayBuffer);
          const positions = geometry.getAttribute('position');
          const colorsAttr = geometry.getAttribute('color');
          const pts: any[] = [];
          for (let i = 0; i < positions.count; i++) {
            pts.push({
              x: positions.getX(i),
              y: positions.getY(i),
              z: positions.getZ(i),
              r: colorsAttr ? colorsAttr.getX(i) : 0.7,
              g: colorsAttr ? colorsAttr.getY(i) : 0.8,
              b: colorsAttr ? colorsAttr.getZ(i) : 1.0,
            });
          }
          resolve(pts);
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      console.warn('PLYLoader 解析失败，回退 ASCII', e);
      const txt = await (await fetch(url, { cache: 'no-cache' })).text();
      return parseAsciiPly(txt);
    }
  };

  const loadProjectData = async (pid?: string) => {
    const key = templateKey || videoUrl;
    const cached = getCachedProjectId(key);
    const effectiveId = pid || cached || currentProjectId || projectId;
    if (!effectiveId) {
      setError('未提供项目ID，无法加载点云/轨迹');
      return;
    }
    if (loadedProjectId === effectiveId && sceneData?.points?.length) {
      setViewerLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log('[SequenceSimulator] 请求点云/轨迹, projectId:', effectiveId);
      // 优先请求预览点云，加快加载
      const pointUrl = `${API_BASE}/projects/${effectiveId}/pointcloud?preview=true`;
      console.log('[SequenceSimulator] 点云URL:', pointUrl);
      const pcResp = await fetch(pointUrl);
      const pcJson = await pcResp.json();
      if (!pcJson.pointcloud_url) {
        throw new Error('未找到点云文件 (sparse_preview/ascii/ply)');
      }
      console.log('[SequenceSimulator] 预览点云文件:', pcJson.pointcloud_url);
      const posesResp = await fetch(`${API_BASE}/projects/${effectiveId}/poses`);
      const posesJson = await posesResp.json();
      console.log('[SequenceSimulator] 轨迹URL:', posesJson.poses_url);

      const plyUrl = resolveUrl(pcJson.pointcloud_url);
      const points = await loadPlyGeometry(plyUrl);
      if (!points.length) throw new Error('点云解析为空');

      let cameraPath: any[] = [];
      if (posesJson.poses_url) {
        const posesUrl = resolveUrl(posesJson.poses_url);
        const posesText = await (await fetch(posesUrl, { cache: 'no-cache' })).text();
        console.log('[SequenceSimulator] 轨迹文本长度:', posesText.length);
        cameraPath = parseTUMPose(posesText);
      }

      setSceneData({ points, cameraPath });
      setStats({ points: points.length, cameras: cameraPath.length });
      setLoadedProjectId(effectiveId);
    setViewerLoading(true); // 让下方渲染流程重新显示loading遮罩
  } catch (err: any) {
    console.error(err);
    setError(err?.message || '加载失败');
  } finally {
    setLoading(false);
  }
  };

  const fetchStatus = async (pid: string) => {
    console.log('[SequenceSimulator] 查询状态', pid);
    const resp = await fetch(`${API_BASE}/projects/${pid}/status`, { cache: 'no-cache' });
    if (!resp.ok) throw new Error(`状态请求失败 ${resp.status}`);
    return resp.json();
  };

  const startReconstruct = async (pid: string) => {
    console.log('[SequenceSimulator] 启动重建', pid);
    await fetch(`${API_BASE}/projects/${pid}/reconstruct?script_type=full`, { method: 'POST' });
  };

  const uploadVideoAndCreate = async () => {
    if (!videoUrl) throw new Error('缺少视频URL，无法创建项目');
    // 优先使用缓存的 projectId（按模板key或视频URL）
    const cacheKey = templateKey || videoUrl;
    const cached = forceNewRef.current ? undefined : getCachedProjectId(cacheKey);
    if (cached) {
      console.log('[SequenceSimulator] 使用缓存的项目ID:', cached);
      setCurrentProjectId(cached);
      return cached;
    }
    setReconStatus('上传视频中...');
    const absoluteUrl = videoUrl.startsWith('http') ? videoUrl : `${window.location.origin}${videoUrl}`;
    console.log('[SequenceSimulator] 下载视频并上传创建项目', absoluteUrl);
    const blobResp = await fetch(absoluteUrl);
    if (!blobResp.ok) throw new Error(`下载视频失败 ${blobResp.status}`);
    const blob = await blobResp.blob();
    const form = new FormData();
    form.append('file', new File([blob], 'reference.mp4', { type: 'video/mp4' }));
    form.append('group', '默认组');
    form.append('force_new', forceNewRef.current ? 'true' : 'false');
    const uploadResp = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
    if (!uploadResp.ok) throw new Error(`上传接口失败 ${uploadResp.status}`);
    const uploadJson = await uploadResp.json();
    const pid = uploadJson.project_id;
    if (!pid) throw new Error('上传接口未返回项目ID');
    console.log('[SequenceSimulator] 新建项目ID:', pid);
    setCurrentProjectId(pid);
    setCachedProjectId(cacheKey, pid);
    forceNewRef.current = false;
    return pid;
  };

  const isMissingProject = (statusObj: any) => {
    const msg = (statusObj?.status || '').toString();
    return (
      msg.includes('No such file') ||
      msg.includes('不存在') ||
      msg.includes('没有这样的文件') ||
      msg.includes('not found')
    );
  };

  const ensureDataReady = async (retrying = false) => {
    if (scannedScene) {
      setReconStatus('使用已扫描场景');
      setViewerLoading(false);
      return;
    }
    const cached = getCachedProjectId(templateKey || videoUrl);
    let pid = cached || currentProjectId || projectId;
    if (!pid && videoUrl) {
      try {
        pid = await uploadVideoAndCreate();
      } catch (err) {
        throw err;
      }
    }
    if (!pid) {
      setError('未找到项目ID且无法从视频创建，请检查模板是否包含 videoUrl 或 projectId');
      setViewerLoading(false);
      return;
    }
    // 写入缓存，避免后续重复重建
    setCachedProjectId(templateKey || videoUrl, pid);
    setCurrentProjectId(pid);
    setError(null);
    setReconStatus('检查重建状态...');
    try {
      const status = await fetchStatus(pid);
      setReconStatus(status.status || '未知');
      console.log('[SequenceSimulator] 初始状态', status);

      if (isMissingProject(status)) {
        console.warn('[SequenceSimulator] 项目缺失，准备重新创建');
        clearCachedProjectId(templateKey || videoUrl);
        forceNewRef.current = true;
        setCurrentProjectId(undefined);
        setLoadedProjectId(null);
        if (retrying) {
          setError('项目缺失且重建重试失败');
          setViewerLoading(false);
          return;
        }
        const newPid = await uploadVideoAndCreate();
        if (!newPid) {
          setError('项目缺失且无法重新创建');
          setViewerLoading(false);
          return;
        }
        return ensureDataReady(true);
      }

      const needsRun = !status.has_pointcloud && !status.has_camera_poses;
      if (needsRun && status.status !== '执行中') {
        setReconStatus('启动重建...');
        await startReconstruct(pid);
      }

      if (statusTimer.current) clearInterval(statusTimer.current);
      statusTimer.current = setInterval(async () => {
        try {
          const st = await fetchStatus(pid!);
          setReconStatus(st.status || '执行中');
          console.log('[SequenceSimulator] 轮询状态', st);
          if (isMissingProject(st)) {
            console.warn('[SequenceSimulator] 轮询检测到项目缺失，准备重新创建');
            clearInterval(statusTimer.current);
            statusTimer.current = null;
            clearCachedProjectId(templateKey || videoUrl);
            forceNewRef.current = true;
            setCurrentProjectId(undefined);
            setLoadedProjectId(null);
            await ensureDataReady(true);
            return;
          }
          if (st.has_pointcloud || st.has_camera_poses || (st.status && st.status.includes('完成'))) {
            clearInterval(statusTimer.current);
            statusTimer.current = null;
            await loadProjectData(pid!);
          }
        } catch (pollErr) {
          console.error(pollErr);
        }
      }, 2000);

      // 如果已有数据，直接加载
      if (!needsRun) {
        await loadProjectData(pid);
      }
      setLastTriedProject(pid);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || '重建状态检查失败');
      setViewerLoading(false);
    }
  };

  useEffect(() => {
    // 当提供了projectId且没有scannedScene时自动加载
    if ((projectId || templateKey || videoUrl) && !scannedScene) {
      ensureDataReady();
    }
    currentTimeRef.current = currentTime;
    return () => {
      if (statusTimer.current) {
        clearInterval(statusTimer.current);
        statusTimer.current = null;
      }
    };
  }, [projectId, scannedScene, templateKey, videoUrl, currentTime]);

  useEffect(() => {
    let renderer: any = null;
    let controls: any = null;
    let animationId: number;
    let resizeHandler: (() => void) | null = null;

    const init = async () => {
      try {
        const THREE = await import('three');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
        const container = containerRef.current;
        if (!container) throw new Error('容器未初始化');

        const data =
          sceneData && sceneData.points && sceneData.points.length
            ? sceneData
            : {
                points: generateMockPointCloud(2000),
                cameraPath: generateMockCameraPath(),
              };

        const width = container.clientWidth || 360;
        const height = container.clientHeight || 640;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b0c10);

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 50);
        camera.position.set(1.2, 0.9, 1.4);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 0, 0);

        scene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(2, 3, 2);
        scene.add(dirLight);
        scene.add(new THREE.GridHelper(4, 24, 0x333333, 0x1f1f1f));
        scene.add(new THREE.AxesHelper(0.4));

        // 翻转Y轴让点云/轨迹方向正确
        const pointsData = data.points.map((p: any) => ({
          ...p,
          y: -p.y,
        }));
        const positions = new Float32Array(pointsData.length * 3);
        const colors = new Float32Array(pointsData.length * 3);
        pointsData.forEach((p: any, i: number) => {
          positions[i * 3] = p.x;
          positions[i * 3 + 1] = p.y;
          positions[i * 3 + 2] = p.z;
          colors[i * 3] = p.r ?? 0.7;
          colors[i * 3 + 1] = p.g ?? 0.8;
          colors[i * 3 + 2] = p.b ?? 1.0;
        });
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const cloud = new THREE.Points(
          geometry,
          new THREE.PointsMaterial({
            size: 0.005,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
          })
        );
        scene.add(cloud);

        // 将TUM位姿直接用作相机中心，翻转Y轴对齐点云坐标系
        const flipQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
        const pathData =
          data.cameraPath && data.cameraPath.length >= 2
            ? data.cameraPath.map((p: any) => {
                const q = new THREE.Quaternion(p.qx ?? 0, p.qy ?? 0, p.qz ?? 0, p.qw ?? 1);
                q.premultiply(flipQuat); // Y翻转
                return {
                  ts: p.ts ?? 0,
                  x: p.x,
                  y: -p.y,
                  z: p.z,
                  qx: q.x,
                  qy: q.y,
                  qz: q.z,
                  qw: q.w,
                };
              })
            : generateMockCameraPath();
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(
          pathData.map((p: any) => new THREE.Vector3(p.x, p.y, p.z))
        );
        const line = new THREE.Line(
          lineGeometry,
          new THREE.LineBasicMaterial({ color: 0x00a8e8, linewidth: 2 })
        );
        scene.add(line);

        // 时间轴参数
        const tsList = pathData.filter((p: any) => typeof p.ts === 'number');
        if (tsList.length >= 2) {
          const startTs = Math.min(...tsList.map((p: any) => p.ts));
          const endTs = Math.max(...tsList.map((p: any) => p.ts));
          timelineRef.current = { start: startTs, end: endTs };
          setPathDuration(endTs - startTs);
          setCurrentTime(0);
        } else {
          timelineRef.current = { start: 0, end: 0 };
          setPathDuration(0);
        }

        // 绿色线条逐步显示经过的轨迹
        const traversedGeometry = new THREE.BufferGeometry().setFromPoints(
          pathData.map((p: any) => new THREE.Vector3(p.x, p.y, p.z))
        );
        const traversedMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2, opacity: 0.9, transparent: true });
        traversedGeometry.setDrawRange(0, 0);
        const traversedLine = new THREE.Line(traversedGeometry, traversedMaterial);
        scene.add(traversedLine);

        // 当前相机位置高亮
        const currentMarker = new THREE.Mesh(
          new THREE.SphereGeometry(0.02),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        scene.add(currentMarker);

        const updateMarker = (timeSec: number) => {
          if (!pathData.length) return;
          const { start, end } = timelineRef.current;
          if (end <= start) return;
          const pathSpan = end - start;
          const scale = duration > 0 && pathSpan > 0 ? pathSpan / duration : 1;
          const targetTs = start + timeSec * scale;
          let prev = pathData[0];
          let next = pathData[pathData.length - 1];
          for (let i = 0; i < pathData.length - 1; i++) {
            if (pathData[i].ts <= targetTs && pathData[i + 1].ts >= targetTs) {
              prev = pathData[i];
              next = pathData[i + 1];
              break;
            }
          }
          const t =
            next.ts === prev.ts
              ? 0
              : Math.min(1, Math.max(0, (targetTs - prev.ts) / (next.ts - prev.ts)));
          const interp = new THREE.Vector3(
            prev.x + (next.x - prev.x) * t,
            prev.y + (next.y - prev.y) * t,
            prev.z + (next.z - prev.z) * t
          );
          currentMarker.position.copy(interp);

          // 逐步显示经过的轨迹
          if (traversedGeometry) {
            const idx = pathData.findIndex((p: any) => p.ts >= targetTs);
            const drawCount = idx === -1 ? pathData.length : Math.max(2, idx + 1);
            traversedGeometry.setDrawRange(0, drawCount);
          }
        };

        const animate = () => {
          animationId = requestAnimationFrame(animate);
          controls.update();
          updateMarker(currentTimeRef.current);
          renderer.render(scene, camera);
        };
        animate();

        resizeHandler = () => {
          if (!container || !renderer) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', resizeHandler);

        setStats({ points: pointsData.length, cameras: pathData.length });
        setViewerLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || '参考场景加载失败');
        setViewerLoading(false);
      }
    };

    setViewerLoading(true);
    init();

    return () => {
      console.log('[SequenceSimulator] 清理渲染器');
      cancelAnimationFrame(animationId);
      if (controls?.dispose) controls.dispose();
      if (renderer?.dispose) renderer.dispose();
      if (renderer?.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }
    };
  }, [sceneData, scannedScene]);

  // 播放控制，按 TUM 时间轴推进（以视频时间为准，减少状态抖动）
  useEffect(() => {
    if (!playing || duration <= 0) return;
    const tick = () => {
      const videoTime = videoPlayerRef.current?.currentTime ?? currentTimeRef.current;
      const clamped = Math.min(duration, videoTime);
      if (Math.abs(clamped - currentTimeRef.current) > 0.016) {
        currentTimeRef.current = clamped;
        setCurrentTime(clamped);
        if (clamped >= duration) {
          setPlaying(false);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing, duration]);

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex flex-col animate-fade-in"
      onClick={onClose}
    >
      <div className="flex-none px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-white/[0.08]" style={{ paddingTop: 'max(44px, env(safe-area-inset-top))' }}>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <h3 className="body font-bold text-white">模板参考场景</h3>
              <span className="micro text-white/50">
                自动加载当前视频的重建结果（点云 + 相机轨迹）
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 caption text-white/80">
                {currentProjectId ? `项目ID ${currentProjectId}` : '未绑定项目ID'}
              </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 caption text-white/80">
              点云 {stats.points}
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 caption text-white/80">
              轨迹 {stats.cameras}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const key = templateKey || videoUrl;
                  clearCachedProjectId(key);
                  setCurrentProjectId(undefined);
                  setSceneData(null);
                  setStats({ points: 0, cameras: 0 });
                  setReconStatus('重新重建...');
                  ensureDataReady();
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white caption font-bold active:scale-95 transition-all"
              >
                重新重建
              </button>
            </div>
          </div>
        </div>

      <div
        className="flex-1 relative px-4 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 px-4 pb-6 pt-3">
          <div
            ref={containerRef}
            className="w-full h-full bg-[#0A0A0A] border border-white/[0.08] rounded-2xl overflow-hidden"
          />
          {videoUrl && (
            <div
              className="absolute top-4 right-4 bg-black/70 border border-white/10 rounded-xl overflow-hidden resize"
              style={{
                width: `${videoWidthPct}%`,
                maxWidth: '35%',
                minWidth: '12%',
                aspectRatio: '9 / 16',
                minHeight: '180px',
                maxHeight: '70%',
              }}
            >
              <video
                ref={videoPlayerRef}
                src={videoUrl}
                className="w-full h-full object-contain bg-black"
                muted
                playsInline
                controls
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  setVideoDuration(v.duration);
                }}
                onEnded={() => {
                  if (videoPlayerRef.current) {
                    try {
                      videoPlayerRef.current.pause();
                      videoPlayerRef.current.currentTime = duration;
                    } catch {}
                  }
                  setCurrentTime(duration);
                  currentTimeRef.current = duration;
                  setPlaying(false);
                }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={() => {}}
              />
              <div className="absolute inset-x-0 bottom-0 px-3 py-1.5 bg-black/60 flex items-center justify-between text-white/70 micro">
                <span>参考视频</span>
                <span>{duration ? `${duration.toFixed(1)}s` : ''}</span>
              </div>
            </div>
          )}
        </div>

        {(viewerLoading || loading) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card px-4 py-3">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <p className="caption text-white/70 mt-2">
                {loading ? '拉取点云/轨迹中...' : '加载参考场景中...'}
              </p>
              <p className="micro text-white/50 mt-1">{reconStatus}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card px-4 py-3 text-center max-w-sm space-y-2">
              <p className="body text-white mb-1">加载失败</p>
              <p className="caption text-white/60">{error}</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    ensureDataReady();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-brand text-white caption font-bold active:scale-95 transition-all"
                >
                  重试
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSceneData({ points: generateMockPointCloud(1500), cameraPath: generateMockCameraPath() });
                    setError(null);
                    setReconStatus('使用示例场景');
                    setViewerLoading(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white caption font-bold active:scale-95 transition-all"
                >
                  使用示例
                </button>
              </div>
            </div>
          </div>
        )}

        {!error && !loading && !viewerLoading && (!sceneData || !sceneData.points?.length) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card px-4 py-4 text-center max-w-sm space-y-2">
              <p className="body text-white mb-1">等待重建结果</p>
              <p className="caption text-white/60">
                {currentProjectId
                  ? `项目 ${currentProjectId} 正在重建或尚无点云，请稍候…`
                  : '未找到可用项目，检查模板是否包含 videoUrl 或 projectId'}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    ensureDataReady();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-brand text-white caption font-bold active:scale-95 transition-all"
                >
                  重新加载
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSceneData({ points: generateMockPointCloud(1500), cameraPath: generateMockCameraPath() });
                    setError(null);
                    setReconStatus('使用示例场景');
                    setViewerLoading(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white caption font-bold active:scale-95 transition-all"
                >
                  查看示例
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-between items-center text-white/70 caption">
            <div className="glass-card px-3 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00A8E8]" />
              <span>蓝色线条为相机轨迹，红/绿分别是起点与终点</span>
            </div>
          <div className="glass-card px-3 py-2 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (videoPlayerRef.current) {
                  if (videoPlayerRef.current.paused) {
                    videoPlayerRef.current.play().catch(() => {});
                  } else {
                    videoPlayerRef.current.pause();
                  }
                }
              }}
              className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white"
            >
              {playing ? '暂停' : '播放'}
            </button>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.01}
              value={currentTime}
              onChange={(e) => {
                const t = parseFloat(e.target.value);
                setCurrentTime(t);
                currentTimeRef.current = t;
                if (videoPlayerRef.current) {
                  try {
                    videoPlayerRef.current.currentTime = t;
                  } catch {}
                }
              }}
              className="w-40 accent-brand"
            />
            <span className="micro text-white/70 font-mono tabular-nums min-w-[90px] text-right">
              {duration ? `${formatTime(currentTime)} / ${formatTime(duration)}` : '无时间轴'}
            </span>
            <div className="flex items-center gap-1">
              <span className="micro text-white/50">视频大小</span>
              <input
                type="range"
                min={10}
                max={35}
                step={1}
                value={videoWidthPct}
                onChange={(e) => setVideoWidthPct(parseInt(e.target.value, 10))}
              />
              <span className="micro text-white/60">{videoWidthPct}%</span>
            </div>
            <span className="micro text-white/70">滚轮缩放 · 右键/Shift+拖拽平移 · 左键旋转</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const key = templateKey || videoUrl;
                clearCachedProjectId(key);
                setCurrentProjectId(undefined);
                setSceneData(null);
                setStats({ points: 0, cameras: 0 });
                setLoadedProjectId(null);
                setReconStatus('重新重建...');
                forceNewRef.current = true;
                ensureDataReady();
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white caption font-bold active:scale-95 transition-all"
            >
              重新重建
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateMockPointCloud(count = 2000) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 2;
    const y = Math.random() * 1.2;
    const z = (Math.random() - 0.5) * 2;
    points.push({
      x,
      y,
      z,
      r: 0.4 + Math.random() * 0.3,
      g: 0.6 + Math.random() * 0.3,
      b: 0.8 + Math.random() * 0.2,
    });
  }
  return points;
}

function generateMockCameraPath() {
  const path = [];
  const steps = 20;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    path.push({
      x: -0.6 + t * 1.2 + Math.sin(t * Math.PI * 2) * 0.1,
      y: 0.2 + Math.cos(t * Math.PI) * 0.05,
      z: 0.8 - t * 1.0 + Math.cos(t * Math.PI * 2) * 0.08,
    });
  }
  return path;
}

// 3D 场景视图组件
function Scene3DView({ 
  viewAngle, 
  progress, 
  version 
}: { 
  viewAngle: 'top' | 'side' | 'follow' | 'free'; 
  progress: number;
  version: 'original' | 'optimized';
}) {
  // 根据进度计算相机位置（简化的2D表示）
  const cameraX = 50 + (progress / 100) * 30 * (version === 'optimized' ? 0.92 : 1);
  const cameraY = 50 - (progress / 100) * 20;

  const getViewTransform = () => {
    switch (viewAngle) {
      case 'top':
        return 'perspective(800px) rotateX(60deg)';
      case 'side':
        return 'perspective(800px) rotateY(-20deg) rotateX(20deg)';
      case 'follow':
        return 'perspective(600px) rotateX(10deg)';
      case 'free':
        return 'perspective(800px) rotateX(45deg) rotateY(15deg)';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* 3D 场景容器 */}
      <div 
        className="absolute inset-0 transition-transform duration-500"
        style={{ transform: getViewTransform() }}
      >
        {/* 地面网格 */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,168,232,.5) 25%, rgba(0,168,232,.5) 26%, transparent 27%, transparent 74%, rgba(0,168,232,.5) 75%, rgba(0,168,232,.5) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,168,232,.5) 25%, rgba(0,168,232,.5) 26%, transparent 27%, transparent 74%, rgba(0,168,232,.5) 75%, rgba(0,168,232,.5) 76%, transparent 77%, transparent)',
            backgroundSize: '40px 40px',
            transform: 'translateZ(-50px)',
          }}
        />

        {/* 运动轨迹线 */}
        <svg 
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'translateZ(0px)' }}
        >
          <defs>
            <linearGradient id={`gradient-${version}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={version === 'optimized' ? '#00A8E8' : '#888'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={version === 'optimized' ? '#0080FF' : '#666'} stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d={`M ${50} ${70} Q ${65} ${60}, ${80} ${50} T ${100} ${40}`}
            fill="none"
            stroke={`url(#gradient-${version})`}
            strokeWidth="3"
            strokeDasharray={version === 'original' ? '5,5' : '0'}
            opacity="0.6"
          />
          {/* 已完成路径 */}
          <path
            d={`M ${50} ${70} Q ${65} ${60}, ${80} ${50}`}
            fill="none"
            stroke={version === 'optimized' ? '#00A8E8' : '#888'}
            strokeWidth="4"
            strokeDasharray={`${progress * 2}, 200`}
            opacity="1"
          />
        </svg>

        {/* 相机位置指示器 */}
        <div
          className="absolute w-8 h-8 transition-all duration-300"
          style={{
            left: `${cameraX}%`,
            top: `${cameraY}%`,
            transform: 'translate(-50%, -50%) translateZ(10px)',
          }}
        >
          <div className={`w-full h-full rounded-lg ${version === 'optimized' ? 'bg-brand' : 'bg-white/50'} shadow-lg animate-pulse flex items-center justify-center`}>
            <Camera className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          {/* 视角方向指示 */}
          <div 
            className={`absolute w-12 h-0.5 top-1/2 left-full ${version === 'optimized' ? 'bg-brand' : 'bg-white/50'}`}
            style={{ 
              transformOrigin: 'left center',
              transform: `rotate(${-progress * 0.5}deg)`,
            }}
          />
        </div>

        {/* POI 标记点 */}
        {[
          { x: 60, y: 65, label: 'POI 1' },
          { x: 75, y: 55, label: 'POI 2' },
          { x: 90, y: 45, label: 'POI 3' },
        ].map((poi, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${poi.x}%`,
              top: `${poi.y}%`,
              transform: 'translate(-50%, -50%) translateZ(5px)',
            }}
          >
            <div className="w-6 h-6 rounded-full bg-[#A855F7]/30 border-2 border-[#A855F7] flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-[#A855F7]" strokeWidth={2.5} />
            </div>
            <span className="absolute top-full mt-1 micro text-[#A855F7] whitespace-nowrap">
              {poi.label}
            </span>
          </div>
        ))}

        {/* 障碍物 */}
        <div
          className="absolute w-16 h-20 bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-lg border border-white/20"
          style={{
            left: '55%',
            top: '60%',
            transform: 'translate(-50%, -50%) translateZ(0px)',
          }}
        />
        <div
          className="absolute w-12 h-16 bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-lg border border-white/20"
          style={{
            left: '85%',
            top: '48%',
            transform: 'translate(-50%, -50%) translateZ(0px)',
          }}
        />
      </div>

      {/* 版本标签（仅在对比模式需要） */}
      {version === 'original' && (
        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg border border-white/20">
          <span className="caption text-white/70">路径较长，耗时 +8%</span>
        </div>
      )}
      {version === 'optimized' && (
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-brand/20 backdrop-blur-sm rounded-lg border border-brand/40">
          <span className="caption text-brand font-semibold">AI优化，避开障碍物</span>
        </div>
      )}
    </div>
  );
}

// Sequence 预览页面组件
function SequencePreview({ onClose }: { onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewAngle, setViewAngle] = useState<'top' | 'side' | 'follow' | 'free'>('top');
  const [showComparison, setShowComparison] = useState(false);

  // 模拟 sequence 单元
  const sequenceUnits = [
    { code: 'C2', name: '急速倒退', duration: 8, color: '#00A8E8' },
    { code: 'S1', name: '静态特写', duration: 3, color: '#FFB800' },
    { code: 'C1', name: '上升展开', duration: 6, color: '#00A8E8' },
    { code: 'F1', name: '跟随拍摄', duration: 10, color: '#00DC82' },
  ];

  const totalDuration = sequenceUnits.reduce((sum, unit) => sum + unit.duration, 0);

  // 播放控制
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + (100 / totalDuration) * 0.1;
        });
      }, 100);
    }
  };

  // 根据进度计算当前单元
  const getCurrentUnit = () => {
    let accumulated = 0;
    for (let i = 0; i < sequenceUnits.length; i++) {
      accumulated += (sequenceUnits[i].duration / totalDuration) * 100;
      if (progress <= accumulated) {
        return i;
      }
    }
    return sequenceUnits.length - 1;
  };

  const activeUnit = getCurrentUnit();

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex flex-col animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="flex-1 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-none px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-white/[0.08]" style={{ paddingTop: 'max(44px, env(safe-area-inset-top))' }}>
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
            <h3 className="body font-bold text-white">Sequence 预览</h3>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`caption font-semibold active:scale-95 transition-all px-3 py-1.5 rounded-lg ${
                showComparison ? 'bg-brand/20 text-brand border border-brand/40' : 'text-white/70'
              }`}
            >
              对比模式
            </button>
          </div>
        </div>

        {/* 3D 预览区 */}
        <div className="flex-1 relative">
          {!showComparison ? (
            /* 单图模式 */
            <div className="w-full h-full relative">
              <Scene3DView viewAngle={viewAngle} progress={progress} version="optimized" />
            </div>
          ) : (
            /* 对比模式 */
            <div className="w-full h-full grid grid-cols-2 gap-px bg-white/[0.08]">
              <div className="relative">
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-white/[0.08] backdrop-blur-sm rounded-lg border border-white/20">
                  <span className="caption font-bold text-white/70">优化前</span>
                </div>
                <Scene3DView viewAngle={viewAngle} progress={progress} version="original" />
              </div>
              <div className="relative">
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-brand/20 backdrop-blur-sm rounded-lg border border-brand/40">
                  <span className="caption font-bold text-brand">优化后</span>
                </div>
                <Scene3DView viewAngle={viewAngle} progress={progress} version="optimized" />
              </div>
            </div>
          )}

          {/* 视角控制 */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl border border-white/10 p-2">
            <div className="flex flex-col gap-2">
              {[
                { angle: 'top' as const, label: '俯视', icon: '⬇' },
                { angle: 'side' as const, label: '侧视', icon: '↗' },
                { angle: 'follow' as const, label: '跟随', icon: '👁' },
                { angle: 'free' as const, label: '自由', icon: '🔄' },
              ].map((view) => (
                <button
                  key={view.angle}
                  onClick={() => setViewAngle(view.angle)}
                  className={`px-3 py-2 rounded-lg caption font-semibold transition-all active:scale-95 ${
                    viewAngle === view.angle
                      ? 'bg-brand text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{view.icon}</span>
                    <span>{view.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 当前单元信息 */}
          <div className="absolute bottom-24 left-4 right-4 flex items-center justify-center pointer-events-none">
            <div className="glass-card px-4 py-2.5 max-w-xs">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: sequenceUnits[activeUnit].color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="caption font-bold" style={{ color: sequenceUnits[activeUnit].color }}>
                      {sequenceUnits[activeUnit].code}
                    </span>
                    <span className="caption text-white">{sequenceUnits[activeUnit].name}</span>
                  </div>
                  <div className="micro text-white/50">
                    {sequenceUnits[activeUnit].duration}秒 · 第 {activeUnit + 1}/{sequenceUnits.length} 步
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部控制区 */}
        <div className="flex-none bg-black/80 backdrop-blur-sm border-t border-white/[0.08] px-4 pb-8 pt-4">
          {/* 时间轴 */}
          <div className="mb-4">
            {/* Sequence 单元标记 */}
            <div className="flex mb-2 h-6">
              {sequenceUnits.map((unit, index) => {
                const width = (unit.duration / totalDuration) * 100;
                return (
                  <div
                    key={index}
                    className="relative flex items-center justify-center"
                    style={{ width: `${width}%` }}
                  >
                    <div 
                      className={`h-6 rounded-md border transition-all ${
                        index === activeUnit 
                          ? 'border-2 scale-105' 
                          : 'border opacity-50'
                      }`}
                      style={{
                        width: '100%',
                        backgroundColor: `${unit.color}20`,
                        borderColor: unit.color,
                      }}
                    >
                      <div className="flex items-center justify-center h-full">
                        <span 
                          className="micro font-bold"
                          style={{ color: unit.color }}
                        >
                          {unit.code}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 进度条 */}
            <div className="relative">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${sequenceUnits[activeUnit].color} 0%, ${sequenceUnits[activeUnit].color} ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              {/* 播放头 */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none"
                style={{ 
                  left: `calc(${progress}% - 8px)`,
                  backgroundColor: sequenceUnits[activeUnit].color,
                }}
              />
            </div>

            {/* 时间显示 */}
            <div className="flex justify-between mt-1">
              <span className="micro text-white/50">
                {((progress / 100) * totalDuration).toFixed(1)}s
              </span>
              <span className="micro text-white/50">{totalDuration}s</span>
            </div>
          </div>

          {/* 播放控制按钮 */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setProgress(0)}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all border border-white/20"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center active:scale-90 transition-all shadow-lg"
            >
              {isPlaying ? (
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <Play className="w-7 h-7 text-white ml-1" strokeWidth={2.5} fill="white" />
              )}
            </button>

            <button
              onClick={() => setProgress(100)}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all border border-white/20"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
