import { useState } from 'react';
import { ArrowLeft, Play, Camera, Zap, Music, MapPin, CheckCircle2, ChevronRight, Sparkles, Clock, Ruler, Wind, Video, Image as ImageIcon, UserPlus, Settings, ChevronDown, ChevronUp } from 'lucide-react';

interface TemplatePageProps {
  template: any;
  onBack: () => void;
  onStartShooting: (template: any) => void;
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

export default function TemplatePreparePage({ template, onBack, onStartShooting }: TemplatePageProps) {
  const [sceneScanned, setSceneScanned] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [adaptationComplete, setAdaptationComplete] = useState(false);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

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
            <SceneScanCard scanned={sceneScanned} onScan={() => setSceneScanned(true)} />
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
              
              <button 
                onClick={() => onStartShooting(template)}
                disabled={!(sceneScanned && adaptationComplete && selectedMusic)}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all ${
                  sceneScanned && adaptationComplete && selectedMusic
                    ? 'bg-brand-gradient shadow-brand/20 active:scale-98'
                    : 'bg-white/[0.08] cursor-not-allowed opacity-50'
                }`}
              >
                <Camera className="w-5 h-5 text-white" strokeWidth={2.5} />
                <span className="body font-bold text-white">开始自动运镜拍摄</span>
              </button>

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
function SceneScanCard({ scanned, onScan }: { scanned: boolean; onScan: () => void }) {
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
          <div className="space-y-2">
            <button 
              onClick={() => setShowSimulator(true)}
              className="w-full py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl caption font-semibold text-white active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" strokeWidth={2.5} />
              <span>查看模板参考场景</span>
            </button>
            <button 
              onClick={() => setShowScanOptions(true)}
              className="w-full btn-primary-sm flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" strokeWidth={2.5} />
              <span>扫描实际场景</span>
            </button>
          </div>
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
function SequenceSimulator({ onClose, scannedScene }: { onClose: () => void; scannedScene: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewAngle, setViewAngle] = useState<'top' | 'side' | 'follow' | 'free'>('top');
  const [showComparison, setShowComparison] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(0);

  // 模拟 sequence 单元
  const sequenceUnits = [
    { code: 'C2', name: '急速倒退', duration: 8, color: '#00A8E8' },
    { code: 'S1', name: '静态特写', duration: 3, color: '#FFB800' },
    { code: 'C1', name: '上升展开', duration: 6, color: '#00A8E8' },
    { code: 'F1', name: '跟随摄', duration: 10, color: '#00DC82' },
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