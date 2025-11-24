import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Ruler, Move, Compass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, Eye, Target, Crosshair } from 'lucide-react';

interface TrajectoryPoint {
  id: number;
  x: number;
  y: number;
  z: number;
  time: number;
  label: string;
  color: string;
}

interface AROverlayProps {
  trajectoryPoints: TrajectoryPoint[];
  currentTargetIndex: number;
  currentTime: number;
  userDeviation: number;
  isPlaying: boolean;
  nextTarget: TrajectoryPoint | undefined;
  practiceMode?: boolean; // 新增：引导练习模式
}

// Pokemon GO风格的AR叠加层组件 - 增强版
export default function PokemonGOStyleAROverlay({
  trajectoryPoints,
  currentTargetIndex,
  currentTime,
  userDeviation,
  isPlaying,
  nextTarget,
  practiceMode = false,
}: AROverlayProps) {
  const currentTarget = trajectoryPoints[currentTargetIndex];

  // 提取动作类型 (C/F/S)
  const getActionType = (label: string) => {
    if (label.startsWith('C-')) return { type: 'C', color: '#00A8E8', name: 'Camera' };
    if (label.startsWith('F-')) return { type: 'F', color: '#FFB800', name: 'Focus' };
    if (label.startsWith('S-')) return { type: 'S', color: '#51CF66', name: 'Subject' };
    return { type: '', color: '#FFFFFF', name: '' };
  };

  const currentActionType = currentTarget ? getActionType(currentTarget.label) : null;

  // 计算到下一个目标的距离和方向
  const getDirectionInfo = () => {
    if (!nextTarget || !currentTarget) return null;
    const dx = nextTarget.x - currentTarget.x;
    const dy = nextTarget.y - currentTarget.y;
    const dz = nextTarget.z - currentTarget.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    // 计算主要方向
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const absZ = Math.abs(dz);
    
    let primary = '';
    let secondary = '';
    
    if (absX > absY && absX > absZ) {
      primary = dx > 0 ? '右' : '左';
    } else if (absY > absX && absY > absZ) {
      primary = dy > 0 ? '上' : '下';
    } else {
      primary = dz > 0 ? '前' : '后';
    }
    
    // 次要方向
    if (absY > 0.3 && primary !== '上' && primary !== '下') {
      secondary = dy > 0 ? '上' : '下';
    } else if (absZ > 0.3 && primary !== '前' && primary !== '后') {
      secondary = dz > 0 ? '前' : '后';
    }
    
    return {
      distance: distance.toFixed(1),
      primary,
      secondary,
      angle: Math.atan2(dx, dz) * (180 / Math.PI),
    };
  };

  const directionInfo = getDirectionInfo();

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* 顶部目标信息 - Pokemon GO风格 */}
      {isPlaying && currentTarget && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center gap-1">
            {/* 目标标签 */}
            <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20">
              <span className="text-white caption font-bold">
                {currentTarget.label.split('-')[1]}
              </span>
            </div>
            {/* CP值风格 - 步骤数 */}
            <div className="text-white/60 micro">
              步骤 {currentTarget.id}/7
            </div>
          </div>
        </motion.div>
      )}

      {/* 左侧HUD - 距离和位置信息 */}
      {isPlaying && nextTarget && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 space-y-3"
        >
          {/* 距离显示 */}
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-4 h-4 text-[#00A8E8]" />
              <span className="micro text-white/60">距离</span>
            </div>
            <div className="text-white font-bold">{directionInfo?.distance}m</div>
          </div>

          {/* 高度差显示 */}
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Move className="w-4 h-4 text-[#FFB800]" />
              <span className="micro text-white/60">高度</span>
            </div>
            <div className="text-white font-bold">
              {nextTarget ? `${(nextTarget.y - currentTarget.y).toFixed(1)}m` : '0m'}
            </div>
          </div>
        </motion.div>
      )}

      {/* 3D空间主视图 */}
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* 地面网格平面 - Pokemon GO风格 */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* 网格线 - 垂直 */}
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 10}
              y1="60"
              x2={i * 10}
              y2="100"
              stroke="#00A8E8"
              strokeWidth="0.1"
              opacity={0.2}
            />
          ))}
          {/* 网格线 - 水平 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={60 + i * 10}
              x2="100"
              y2={60 + i * 10}
              stroke="#00A8E8"
              strokeWidth="0.1"
              opacity={0.2}
            />
          ))}

          {/* 路径轨迹线 */}
          <motion.path
            d={generateSVGPath(trajectoryPoints)}
            stroke="url(#pathGradient)"
            strokeWidth="0.4"
            fill="none"
            strokeDasharray="2,2"
            opacity={0.5}
          />

          {/* 定义渐变 */}
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00A8E8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFB800" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#51CF66" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* 目标点可视化 */}
        {trajectoryPoints.map((point, index) => {
          const isCurrent = index === currentTargetIndex;
          const isNext = index === currentTargetIndex + 1;
          const isPast = index < currentTargetIndex;

          if (!isCurrent && !isNext && !isPast) return null;

          const screenX = 50 + point.x * 15;
          const screenY = 50 - point.y * 10 + point.z * 5;
          const actionType = getActionType(point.label);

          return (
            <div key={point.id}>
              {/* 高度指示器 - 垂直虚线到地面 */}
              {isCurrent && point.y > 0 && (
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ pointerEvents: 'none' }}
                >
                  <line
                    x1={screenX}
                    y1={screenY}
                    x2={screenX}
                    y2={60}
                    stroke={actionType.color}
                    strokeWidth="0.2"
                    strokeDasharray="1,1"
                    opacity="0.5"
                  />
                  {/* 地面接触点 */}
                  <circle
                    cx={screenX}
                    cy={60}
                    r="0.5"
                    fill={actionType.color}
                    opacity="0.6"
                  />
                </svg>
              )}

              {/* 目标点主体 */}
              <motion.div
                className="absolute"
                style={{
                  left: `${screenX}%`,
                  top: `${screenY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isCurrent ? 1 : isNext ? 0.85 : 0.5,
                  opacity: isPast ? 0.3 : 1,
                }}
              >
                {/* 当前目标 - Pokemon GO风格同心圆 */}
                {isCurrent && (
                  <div className="relative">
                    {/* 外圈脉冲 */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        width: '120px',
                        height: '120px',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: `2px solid ${actionType.color}`,
                        opacity: 0.3,
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />

                    {/* 中圈 */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        width: '90px',
                        height: '90px',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: `2px solid ${actionType.color}`,
                        opacity: 0.4,
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />

                    {/* 内圈 - 主目标 */}
                    <motion.div
                      className="w-20 h-20 rounded-full flex items-center justify-center relative"
                      style={{
                        backgroundColor: `${actionType.color}20`,
                        border: `3px solid ${actionType.color}`,
                        boxShadow: `0 0 30px ${actionType.color}60, inset 0 0 20px ${actionType.color}20`,
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 30px ${actionType.color}60, inset 0 0 20px ${actionType.color}20`,
                          `0 0 40px ${actionType.color}80, inset 0 0 30px ${actionType.color}30`,
                          `0 0 30px ${actionType.color}60, inset 0 0 20px ${actionType.color}20`,
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {/* 节点编号 */}
                      <span className="text-white text-2xl font-bold">{point.id}</span>

                      {/* C/F/S类型标签 */}
                      <div
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center micro font-bold"
                        style={{
                          backgroundColor: actionType.color,
                          color: 'white',
                          boxShadow: `0 2px 8px ${actionType.color}60`,
                        }}
                      >
                        {actionType.type}
                      </div>
                    </motion.div>

                    {/* 目标锁定框 - 接近目标时显示 */}
                    {userDeviation < 20 && (
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          width: '100px',
                          height: '100px',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {/* 四角锁定框 */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* 左上角 */}
                          <path
                            d="M 10 10 L 10 30 M 10 10 L 30 10"
                            stroke={actionType.color}
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                          />
                          {/* 右上角 */}
                          <path
                            d="M 90 10 L 90 30 M 90 10 L 70 10"
                            stroke={actionType.color}
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                          />
                          {/* 左下角 */}
                          <path
                            d="M 10 90 L 10 70 M 10 90 L 30 90"
                            stroke={actionType.color}
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                          />
                          {/* 右下角 */}
                          <path
                            d="M 90 90 L 90 70 M 90 90 L 70 90"
                            stroke={actionType.color}
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* 下一个目标点 */}
                {isNext && (
                  <div className="relative">
                    {/* 距离环 */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        width: '70px',
                        height: '70px',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: `2px dashed ${actionType.color}`,
                        opacity: 0.4,
                      }}
                    />

                    {/* 目标球 */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        borderColor: actionType.color,
                        backgroundColor: `${actionType.color}15`,
                        border: `2px solid ${actionType.color}`,
                        boxShadow: `0 0 15px ${actionType.color}40`,
                      }}
                    >
                      <span className="text-white font-bold">{point.id}</span>
                    </div>

                    {/* 3D方向箭头 */}
                    <motion.div
                      className="absolute -top-12 left-1/2 -translate-x-1/2"
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className="text-3xl"
                          style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                          }}
                        >
                          👇
                        </div>
                        {/* 距离标签 */}
                        <div
                          className="mt-1 px-2 py-0.5 rounded-full micro font-bold"
                          style={{
                            backgroundColor: `${actionType.color}20`,
                            color: actionType.color,
                            border: `1px solid ${actionType.color}`,
                          }}
                        >
                          {directionInfo?.distance}m
                        </div>
                      </div>
                    </motion.div>

                    {/* 路径箭头链 - 连接当前和下一个 */}
                    {currentTarget && (
                      <svg
                        className="absolute"
                        style={{
                          width: '200%',
                          height: '200%',
                          left: '-50%',
                          top: '-50%',
                          pointerEvents: 'none',
                        }}
                        viewBox="0 0 100 100"
                      >
                        {Array.from({ length: 3 }).map((_, i) => (
                          <motion.circle
                            key={i}
                            r="1"
                            fill={actionType.color}
                            initial={{ opacity: 0 }}
                            animate={{
                              cx: [25, 50, 75],
                              cy: [50, 50, 50],
                              opacity: [0, 0.8, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.5,
                              ease: 'easeInOut',
                            }}
                          />
                        ))}
                      </svg>
                    )}
                  </div>
                )}

                {/* 已完成的点 - 简洁标记 */}
                {isPast && (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: actionType.color,
                      opacity: 0.5,
                      boxShadow: `0 0 8px ${actionType.color}60`,
                    }}
                  >
                    <span className="text-white micro">✓</span>
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 底部陀螺仪水平仪 */}
      {isPlaying && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-36 left-1/2 -translate-x-1/2"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-full px-6 py-2 border border-white/20">
            <div className="flex items-center gap-3">
              {/* 水平指示器 */}
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{
                    backgroundColor:
                      userDeviation < 15 ? '#51CF66' : userDeviation < 30 ? '#FFB800' : '#FF6B6B',
                  }}
                />
                <span
                  className="caption font-bold"
                  style={{
                    color: userDeviation < 15 ? '#51CF66' : userDeviation < 30 ? '#FFB800' : '#FF6B6B',
                  }}
                >
                  {userDeviation < 15 ? '完美对齐' : userDeviation < 30 ? '保持稳定' : '调整方向'}
                </span>
              </div>

              {/* 分隔线 */}
              <div className="w-px h-4 bg-white/20" />

              {/* 稳定性指示器 */}
              <div className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-white/60" />
                <div className="w-12 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#51CF66] rounded-full"
                    style={{
                      width: `${Math.max(0, 100 - userDeviation * 3)}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 增强版：3D方向罗盘 */}
      {isPlaying && directionInfo && nextTarget && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-1/2 right-4 -translate-y-1/2"
        >
          <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            {/* 罗盘主体 */}
            <div className="relative w-24 h-24">
              {/* 罗盘圆盘 */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20">
                {/* 刻度线 */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 45) - 90;
                  return (
                    <div
                      key={i}
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${angle}deg)`,
                      }}
                    >
                      <div 
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/30"
                        style={{
                          height: i % 2 === 0 ? '8px' : '4px',
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* 方向指示箭头 */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  rotate: directionInfo.angle,
                }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Navigation 
                      className="w-10 h-10" 
                      style={{ 
                        color: currentActionType?.color || '#00A8E8',
                        filter: `drop-shadow(0 2px 8px ${currentActionType?.color}60)`,
                      }}
                      fill={currentActionType?.color}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* 中心点 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: currentActionType?.color || '#00A8E8',
                    boxShadow: `0 0 12px ${currentActionType?.color}80`,
                  }}
                />
              </div>
            </div>

            {/* 方向文字提示 */}
            <div className="mt-3 text-center">
              <div className="caption font-bold text-white mb-0.5">
                {directionInfo.primary}
                {directionInfo.secondary && ` · ${directionInfo.secondary}`}
              </div>
              <div className="micro text-white/60">
                {directionInfo.distance}m
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 增强版：3D方向箭头指示器（屏幕中央） */}
      {isPlaying && directionInfo && nextTarget && userDeviation > 20 && (
        <DirectionArrowIndicator 
          direction={directionInfo.primary}
          secondary={directionInfo.secondary}
          color={currentActionType?.color || '#00A8E8'}
        />
      )}

      {/* 练习模式：虚拟辅助线 */}
      {practiceMode && isPlaying && nextTarget && (
        <PracticeGuideLines 
          currentTarget={currentTarget}
          nextTarget={nextTarget}
          actionType={currentActionType}
        />
      )}
    </div>
  );
}

// 新组件：3D方向箭头指示器
function DirectionArrowIndicator({ 
  direction, 
  secondary, 
  color 
}: { 
  direction: string; 
  secondary: string; 
  color: string;
}) {
  const getArrowIcon = (dir: string) => {
    switch (dir) {
      case '上': return <ArrowUp className="w-12 h-12" strokeWidth={3} />;
      case '下': return <ArrowDown className="w-12 h-12" strokeWidth={3} />;
      case '左': return <ArrowLeft className="w-12 h-12" strokeWidth={3} />;
      case '右': return <ArrowRight className="w-12 h-12" strokeWidth={3} />;
      case '前': return <ArrowUp className="w-12 h-12" strokeWidth={3} />;
      case '后': return <ArrowDown className="w-12 h-12" strokeWidth={3} />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      <motion.div
        animate={{
          y: direction === '上' ? [-10, -20, -10] : 
             direction === '下' ? [10, 20, 10] : 0,
          x: direction === '左' ? [-10, -20, -10] : 
             direction === '右' ? [10, 20, 10] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div 
          className="relative flex flex-col items-center gap-2"
          style={{
            filter: `drop-shadow(0 4px 12px ${color}60)`,
          }}
        >
          {/* 主方向箭头 */}
          <div style={{ color }}>
            {getArrowIcon(direction)}
          </div>

          {/* 次要方向 */}
          {secondary && (
            <div 
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: `${color}30`,
                color: color,
                border: `2px solid ${color}`,
              }}
            >
              {secondary}方向
            </div>
          )}

          {/* 动作文字 */}
          <div 
            className="font-bold px-4 py-2 rounded-xl"
            style={{
              backgroundColor: `${color}40`,
              color: 'white',
              border: `2px solid ${color}`,
              fontSize: '16px',
            }}
          >
            往{direction}移动
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 新组件：练习模式辅助线
function PracticeGuideLines({
  currentTarget,
  nextTarget,
  actionType,
}: {
  currentTarget: TrajectoryPoint;
  nextTarget: TrajectoryPoint;
  actionType: any;
}) {
  const screenX1 = 50 + currentTarget.x * 15;
  const screenY1 = 50 - currentTarget.y * 10 + currentTarget.z * 5;
  const screenX2 = 50 + nextTarget.x * 15;
  const screenY2 = 50 - nextTarget.y * 10 + nextTarget.z * 5;

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* 虚线连接 */}
      <motion.line
        x1={screenX1}
        y1={screenY1}
        x2={screenX2}
        y2={screenY2}
        stroke={actionType.color}
        strokeWidth="0.3"
        strokeDasharray="2,2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1 }}
      />

      {/* 中点标记 */}
      <motion.circle
        cx={(screenX1 + screenX2) / 2}
        cy={(screenY1 + screenY2) / 2}
        r="1"
        fill={actionType.color}
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 目标区域圆圈 */}
      <motion.circle
        cx={screenX2}
        cy={screenY2}
        r="8"
        fill="none"
        stroke={actionType.color}
        strokeWidth="0.3"
        strokeDasharray="4,2"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${screenX2}% ${screenY2}%` }}
      />
    </svg>
  );
}

// 辅助函数：生成SVG路径
function generateSVGPath(points: TrajectoryPoint[]) {
  if (points.length === 0) return '';

  const firstPoint = points[0];
  let path = `M ${50 + firstPoint.x * 15} ${50 - firstPoint.y * 10 + firstPoint.z * 5}`;

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    const x = 50 + point.x * 15;
    const y = 50 - point.y * 10 + point.z * 5;
    path += ` L ${x} ${y}`;
  }

  return path;
}