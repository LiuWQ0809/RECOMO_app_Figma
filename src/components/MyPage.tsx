import { useState } from 'react';
import { Settings, Heart, MapPin, Video, ChevronRight, Edit, Trash2, Share2, MoreHorizontal, Play, Camera, CircleDollarSign, Award, CheckCircle, Gift, TrendingUp, Users, Zap, Cube, MessageCircle, Bookmark } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import CreationDetailPage from './CreationDetailPage';
import profilePhoto from 'figma:asset/7792a4842bfc9a91894e01ca62d0bd0e0831cef5.png';
import creation1 from 'figma:asset/714fd775517f0af84582062b41025b60f690efb0.png';
import creation2 from 'figma:asset/a647dc02f79ba5567d27dcb4ced7b8f6489f5e23.png';

type Tab = 'creations' | 'sequences' | 'scenes' | 'likes';

export default function MyPage({ 
  savedShots = [],
  savedSequences = [],
  onOpenSequenceEditor
}: {
  savedShots?: any[];
  savedSequences?: any[];
  onOpenSequenceEditor?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('creations');
  const [showPointsDetail, setShowPointsDetail] = useState(false);
  const [selectedCreation, setSelectedCreation] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'scroll'>('grid');

  // Mock creations data with stats and full details
  const mockCreations = [
    {
      id: 1,
      videoUrl: 'https://example.com/video1.mp4',
      thumbnail: creation1,
      title: '樱花季的浪漫',
      author: 'Ting',
      avatar: profilePhoto,
      likes: 2340,
      comments: 156,
      shares: 89,
      usedCount: 156,
      duration: '0:22',
      views: 12500,
      isLiked: false,
      isSaved: false,
      createdAt: '2024-03-15',
      credits: 50, // 添加积分信息
      sequence: {
        id: 'seq1',
        name: 'C2 急速倒运镜',
        stepCount: 5,
        duration: 22,
        thumbnail: creation1,
      },
      pois: [
        {
          id: 'poi1',
          name: '樱花树林',
          type: 'scene' as const,
          thumbnail: creation1,
          scanTime: '2024-03-15 14:30',
          accuracy: 95,
        },
        {
          id: 'poi2',
          name: '石板小径',
          type: 'scene' as const,
          thumbnail: creation1,
          scanTime: '2024-03-15 14:32',
          accuracy: 88,
        },
      ],
    },
    {
      id: 2,
      videoUrl: 'https://example.com/video2.mp4',
      thumbnail: creation2,
      title: '夏日海边写真',
      author: 'Ting',
      avatar: profilePhoto,
      likes: 1890,
      comments: 98,
      shares: 67,
      usedCount: 98,
      duration: '0:18',
      views: 9800,
      isLiked: false,
      isSaved: false,
      createdAt: '2024-03-10',
      credits: 75,
      sequence: {
        id: 'seq2',
        name: 'A3 环绕拍摄',
        stepCount: 4,
        duration: 18,
        thumbnail: creation2,
      },
      pois: [
        {
          id: 'poi3',
          name: '海滩',
          type: 'scene' as const,
          thumbnail: creation2,
          scanTime: '2024-03-10 16:20',
          accuracy: 92,
        },
      ],
    },
  ];

  const handleCreationClick = (creation: any) => {
    setSelectedCreation(creation);
    setViewMode('scroll');
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedCreation(null);
  };

  const handleRecreate = (creation: any) => {
    console.log('Recreate:', creation);
    // TODO: Navigate to create page with this template
  };

  // 如果在滚动模式，显示全屏滚动视图
  if (viewMode === 'scroll') {
    return (
      <MyCreationsScrollView
        selectedItem={selectedCreation}
        allItems={mockCreations}
        onBack={handleBackToGrid}
        onRecreate={handleRecreate}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-none bg-[#0A0A0A] border-b border-white/[0.06]" style={{ paddingTop: '44px' }}>
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-none">
              <ImageWithFallback
                src={profilePhoto}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#00DC82] to-[#00B368] rounded-full flex items-center justify-center border-[3px] border-[#0A0A0A] shadow-lg">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="truncate" style={{ fontSize: '22px', fontWeight: 700 }}>Ting</h2>
              <p className="caption text-tertiary truncate">旅行与美食博主 🌍✨</p>
            </div>
            <button className="flex-none p-2.5 rounded-full bg-white/10 border border-white/12 active:scale-95 transition-all flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Points Card - 新增积分卡片 */}
          <button
            onClick={() => setShowPointsDetail(true)}
            className="w-full mb-4 p-4 rounded-2xl bg-gradient-to-br from-[#FFB800]/20 via-[#00A8E8]/20 to-[#00DC82]/20 border border-white/10 active:scale-98 transition-all relative overflow-hidden"
          >
            {/* 背景光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFB800]/10 via-transparent to-[#00DC82]/10 animate-pulse" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FF8C00] flex items-center justify-center shadow-[0_4px_16px_rgba(255,184,0,0.4)]">
                  <CircleDollarSign className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <div className="caption text-white/70 mb-0.5">积分余额</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-bold" style={{ fontSize: '24px' }}>8,520</span>
                    <span className="caption text-white/70">pts</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right mr-2">
                  <div className="micro text-[#00DC82] font-bold">+120</div>
                  <div className="micro text-white/50">今日收益</div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" strokeWidth={2} />
              </div>
            </div>
          </button>

          {/* Stats */}
          <div className="flex items-center justify-around py-3 px-4 rounded-2xl solid-card mb-4">
            <div className="text-center flex-1 flex flex-col items-center">
              <div className="body-l text-white font-bold">10K</div>
              <div className="caption text-tertiary">粉丝</div>
            </div>
            <div className="w-px h-8 bg-white/10 flex-none" />
            <div className="text-center flex-1 flex flex-col items-center">
              <div className="body-l text-white font-bold">340</div>
              <div className="caption text-tertiary">关注</div>
            </div>
            <div className="w-px h-8 bg-white/10 flex-none" />
            <div className="text-center flex-1 flex flex-col items-center">
              <div className="body-l text-white font-bold">15K</div>
              <div className="caption text-tertiary">点赞</div>
            </div>
          </div>

          <button className="w-full py-3 bg-white/[0.1] border border-white/10 rounded-full caption text-white font-semibold hover:bg-white/[0.15] transition-all active:scale-95 flex items-center justify-center">
            编辑资料
          </button>
        </div>
      </div>

      {/* Tabs - Fixed */}
      <div className="flex-none bg-[#0A0A0A] border-b border-white/[0.06]">
        <div className="flex items-center justify-center px-5">
          <button
            onClick={() => setActiveTab('creations')}
            className={`flex-1 py-3 caption transition-colors border-b-2 flex items-center justify-center ${
              activeTab === 'creations'
                ? 'text-[#00A8E8] border-[#00A8E8]'
                : 'text-tertiary border-transparent'
            }`}
            style={{ fontWeight: activeTab === 'creations' ? 600 : 400 }}
          >
            作品
          </button>
          <button
            onClick={() => setActiveTab('sequences')}
            className={`flex-1 py-3 caption transition-colors border-b-2 flex items-center justify-center ${
              activeTab === 'sequences'
                ? 'text-[#00A8E8] border-[#00A8E8]'
                : 'text-tertiary border-transparent'
            }`}
            style={{ fontWeight: activeTab === 'sequences' ? 600 : 400 }}
          >
            Sequences
          </button>
          <button
            onClick={() => setActiveTab('scenes')}
            className={`flex-1 py-3 caption transition-colors border-b-2 flex items-center justify-center ${
              activeTab === 'scenes'
                ? 'text-[#00A8E8] border-[#00A8E8]'
                : 'text-tertiary border-transparent'
            }`}
            style={{ fontWeight: activeTab === 'scenes' ? 600 : 400 }}
          >
            场景
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-3 caption transition-colors border-b-2 flex items-center justify-center ${
              activeTab === 'likes'
                ? 'text-[#00A8E8] border-[#00A8E8]'
                : 'text-tertiary border-transparent'
            }`}
            style={{ fontWeight: activeTab === 'likes' ? 600 : 400 }}
          >
            喜欢
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="pb-[70px]">
          {activeTab === 'creations' && (
            <CreationsTab 
              creations={mockCreations} 
              onCreationClick={handleCreationClick}
            />
          )}
          {activeTab === 'sequences' && <SequencesTab sequences={savedSequences} onOpenSequenceEditor={onOpenSequenceEditor} />}
          {activeTab === 'scenes' && <ScenesTab />}
          {activeTab === 'likes' && <LikesTab />}
        </div>
      </div>

      {/* Points Detail Sheet */}
      {showPointsDetail && (
        <PointsDetailSheet onClose={() => setShowPointsDetail(false)} />
      )}

      {/* Creation Detail Page */}
      {selectedCreation && (
        <CreationDetailPage
          creation={selectedCreation}
          onClose={() => setSelectedCreation(null)}
          onUseSequence={(sequenceId) => {
            console.log('Use sequence:', sequenceId);
            setSelectedCreation(null);
          }}
          onUsePOI={(poiId) => {
            console.log('Use POI:', poiId);
          }}
        />
      )}
    </div>
  );
}

// Points Detail Sheet - 积分详情弹窗
function PointsDetailSheet({ onClose }: { onClose: () => void }) {
  const earningMethods = [
    {
      icon: CheckCircle,
      title: '每日签到',
      points: '+10',
      description: '连续签到获得更多奖励',
      color: '#00DC82',
    },
    {
      icon: Award,
      title: '完成任务',
      points: '+50-200',
      description: '完成创作任务和挑战',
      color: '#FFB800',
    },
    {
      icon: Video,
      title: '发布作品',
      points: '+30',
      description: '分享你的创作到社区',
      color: '#00A8E8',
    },
    {
      icon: Zap,
      title: '创建 Sequence',
      points: '+100',
      description: '上传原创运镜方案',
      color: '#FF6B6B',
    },
    {
      icon: Users,
      title: '被使用收益',
      points: '+5/次',
      description: '其他用户使用你的 Sequence/POI',
      color: '#A855F7',
    },
    {
      icon: TrendingUp,
      title: '人气创作者',
      points: '+500',
      description: '作品获得 1000+ 使用',
      color: '#EC4899',
    },
  ];

  const recentEarnings = [
    { date: '今天 14:32', action: '创建 Sequence「街拍运镜」', points: '+100', color: '#FF6B6B' },
    { date: '今天 10:15', action: '用户使用了你的 POI 建模', points: '+5', color: '#A855F7' },
    { date: '今天 09:00', action: '每日签到', points: '+10', color: '#00DC82' },
    { date: '昨天 18:20', action: '发布作品「系穿搭」', points: '+30', color: '#00A8E8' },
    { date: '昨天 15:45', action: '用户使用了 C2 运镜方案', points: '+5', color: '#A855F7' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#1C1C1E] rounded-t-3xl border-t border-white/10 animate-slide-up max-h-[85vh] overflow-y-auto"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#1C1C1E] px-5 pt-4 pb-3 border-b border-white/[0.06] z-10">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h3 className="body-l font-bold text-white">我的积分</h3>
            <button
              onClick={onClose}
              className="caption font-semibold text-brand active:scale-95 transition-all"
            >
              完成
            </button>
          </div>
        </div>

        {/* Total Points */}
        <div className="p-5 pb-4">
          <div className="text-center py-6 px-4 rounded-2xl bg-gradient-to-br from-[#FFB800]/20 via-[#00A8E8]/20 to-[#00DC82]/20 border border-white/10 relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFB800]/5 via-transparent to-[#00DC82]/5" />
            <div className="relative">
              <div className="caption text-white/70 mb-2">当前余额</div>
              <div className="flex items-baseline justify-center gap-2 mb-3">
                <CircleDollarSign className="w-8 h-8 text-[#FFB800]" strokeWidth={2.5} />
                <span className="text-white font-bold" style={{ fontSize: '40px' }}>8,520</span>
                <span className="body text-white/70">pts</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="micro text-white/50">本周收益</div>
                  <div className="caption text-[#00DC82] font-bold">+450</div>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="text-center">
                  <div className="micro text-white/50">本月收益</div>
                  <div className="caption text-[#00DC82] font-bold">+1,820</div>
                </div>
              </div>
            </div>
          </div>

          {/* Points Store Entrance */}
          <button className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#FF6B6B]/10 via-[#FFB800]/10 to-[#FF6B6B]/10 border border-[#FFB800]/30 active:scale-95 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent group-active:opacity-0 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#FF8C00] flex items-center justify-center shadow-lg">
                  <Gift className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <div className="body font-bold text-white mb-0.5 flex items-center gap-2">
                    积分商城
                    <span className="micro px-1.5 py-0.5 rounded bg-[#FF6B6B] text-white font-bold">HOT</span>
                  </div>
                  <div className="caption text-white/70">精选好礼 · 限时兑换</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/50 flex-none" strokeWidth={2} />
            </div>
          </button>

          {/* Earning Methods */}
          <div className="mb-6">
            <h4 className="body font-bold text-white mb-3">获取积分</h4>
            <div className="space-y-2">
              {earningMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-none"
                      style={{ backgroundColor: `${method.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: method.color }} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="caption font-bold text-white">{method.title}</span>
                        <span className="caption font-bold" style={{ color: method.color }}>
                          {method.points}
                        </span>
                      </div>
                      <p className="micro text-white/50">{method.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Earnings */}
          <div>
            <h4 className="body font-bold text-white mb-3">最近收益</h4>
            <div className="space-y-2">
              {recentEarnings.map((earning, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.05] border border-white/[0.08]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="caption text-white font-semibold mb-0.5">{earning.action}</div>
                    <div className="micro text-white/50">{earning.date}</div>
                  </div>
                  <div 
                    className="caption font-bold flex-none ml-3"
                    style={{ color: earning.color }}
                  >
                    {earning.points}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sign In Button */}
          <button className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#00A8E8] to-[#0080FF] text-white body font-bold active:scale-95 transition-all shadow-[0_4px_16px_rgba(0,168,232,0.4)] flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" strokeWidth={2.5} />
            <span>每日签到领积分</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function CreationsTab({ creations, onCreationClick }: { creations: any[]; onCreationClick: (creation: any) => void }) {
  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-2">
        {creations.map((item) => (
          <div 
            key={item.id} 
            className="flex flex-col"
            onClick={() => onCreationClick(item)}
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group transition-all active:scale-95 mb-1.5">
              <ImageWithFallback
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  {/* Stats Row */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="flex items-center gap-0.5 flex-1">
                      <Heart className="w-3 h-3 text-white flex-none" strokeWidth={2} />
                      <span className="micro font-semibold text-white">
                        {item.likes >= 1000 ? `${(item.likes / 1000).toFixed(1)}K` : item.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 flex-1">
                      <Zap className="w-3 h-3 text-[#FFB800] flex-none" strokeWidth={2} />
                      <span className="micro font-semibold text-white">
                        {item.usedCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {item.duration && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded">
                  <span className="micro text-white font-medium">{item.duration}</span>
                </div>
              )}
            </div>
            <div className="px-0.5">
              <h4 className="caption text-white font-medium line-clamp-1 mb-0.5">{item.title}</h4>
              <div className="flex items-center gap-2 micro text-white/50">
                <span>{item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}K` : item.views} 播放</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SequencesTab({ sequences, onOpenSequenceEditor }: { sequences: any[]; onOpenSequenceEditor?: () => void }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white" style={{ fontSize: '17px' }}>我的 Sequences</h3>
        <button className="caption text-brand font-semibold flex items-center justify-center">+ 新建</button>
      </div>
      
      {sequences.map((seq) => (
        <div key={seq.id} className="solid-card p-4">
          <div className="flex items-start justify-between mb-2 gap-3">
            <h4 className="body font-semibold text-white flex-1 line-clamp-2">{seq.name}</h4>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#00DC82]/20 border border-[#00DC82]/40 flex-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00DC82]" />
              <span className="micro text-[#00DC82] whitespace-nowrap">就绪</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-secondary mb-3 caption">
            <span className="whitespace-nowrap">{seq.stepCount} 个步骤</span>
            <span className="text-white/20">|</span>
            <span className="whitespace-nowrap">{Math.floor(seq.totalDuration / 60)} 分钟</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 mb-3 overflow-x-auto scrollbar-hide">
            <code className="caption text-brand font-mono whitespace-nowrap">{seq.description}</code>
          </div>
          
          {seq.outputs && (
            <div className="flex items-center justify-center gap-3 px-3 py-2 rounded-xl bg-[#00A8E8]/10 border border-[#00A8E8]/20 mb-3">
              <div className="flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 text-brand flex-none" />
                <span className="caption text-secondary whitespace-nowrap">{seq.outputs.videos} 视频</span>
              </div>
              {seq.outputs.photos > 0 && (
                <>
                  <div className="w-px h-3 bg-white/20 flex-none" />
                  <div className="flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-brand flex-none" />
                    <span className="caption text-secondary whitespace-nowrap">{seq.outputs.photos} 照片</span>
                  </div>
                </>
              )}
            </div>
          )}
          
          <div className="flex gap-2 justify-center">
            <button className="flex-1 py-2.5 bg-white/[0.1] border border-white/[0.1] rounded-xl caption font-semibold text-white hover:bg-white/[0.15] transition-all active:scale-95 flex items-center justify-center">
              编辑
            </button>
            <button className="flex-1 btn-primary-sm whitespace-nowrap flex items-center justify-center">
              启动
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScenesTab() {
  const scenes = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop' },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=400&fit=crop' },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=400&fit=crop' },
    { id: 4, thumbnail: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=400&fit=crop' },
    { id: 5, thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop' },
    { id: 6, thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop' },
  ];

  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-2">
        {scenes.map((item) => (
          <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group active:scale-95 transition-all">
            <ImageWithFallback
              src={item.thumbnail}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <div className="absolute top-2 right-2 flex items-center justify-center">
              <Heart className="h-4 w-4 text-brand fill-brand drop-shadow-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LikesTab() {
  const likedItems = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop' },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=400&fit=crop' },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=400&fit=crop' },
    { id: 4, thumbnail: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=400&fit=crop' },
    { id: 5, thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop' },
    { id: 6, thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop' },
  ];

  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-2">
        {likedItems.map((item) => (
          <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group active:scale-95 transition-all">
            <ImageWithFallback
              src={item.thumbnail}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <div className="absolute top-2 right-2 flex items-center justify-center">
              <Heart className="h-4 w-4 text-brand fill-brand drop-shadow-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 全屏滚动视图组件 - 参考 DiscoverPage 的 ScrollView
function MyCreationsScrollView({
  selectedItem,
  allItems,
  onBack,
  onRecreate,
}: {
  selectedItem: any;
  allItems: any[];
  onBack: () => void;
  onRecreate: (creation: any) => void;
}) {
  return (
    <div className="h-full w-full flex flex-col bg-[#0A0A0A]">
      {/* Back Button */}
      <div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pointer-events-none"
        style={{ paddingTop: 'max(48px, calc(env(safe-area-inset-top) + 4px))' }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all pointer-events-auto border border-white/10"
        >
          <ChevronRight className="w-5 h-5 text-white rotate-180" strokeWidth={2.5} />
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory">
        {allItems.map((item) => (
          <MyCreationFeedCard
            key={item.id}
            item={item}
            onRecreate={() => onRecreate(item)}
          />
        ))}
      </div>
    </div>
  );
}

// Feed Card - 全屏卡片 (参考 DiscoverPage 的 FeedCard)
function MyCreationFeedCard({ item, onRecreate }: { item: any; onRecreate: () => void }) {
  const [liked, setLiked] = useState(item.isLiked);
  const [saved, setSaved] = useState(item.isSaved);
  const [likesCount, setLikesCount] = useState(item.likes);

  return (
    <div
      className="relative w-full bg-[#0A0A0A] snap-start flex-none"
      style={{ height: 'calc(100vh - 88px)' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-5">
        {/* Avatar */}
        <button className="relative">
          <ImageWithFallback
            src={item.avatar}
            alt={item.author}
            className="w-12 h-12 rounded-full border-2 border-white/20"
          />
        </button>

        {/* Like */}
        <button
          className="flex flex-col items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
            setLikesCount(liked ? likesCount - 1 : likesCount + 1);
          }}
        >
          <div className="w-11 h-11 rounded-full bg-white/[0.1] backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all">
            <Heart
              className={`w-6 h-6 transition-all ${liked ? 'text-[#FF6B6B] fill-[#FF6B6B]' : 'text-white'}`}
              strokeWidth={2}
            />
          </div>
          <span className="micro text-white font-semibold">
            {likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
          </span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-white/[0.1] backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all">
            <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <span className="micro text-white font-semibold">{item.comments}</span>
        </button>

        {/* Save */}
        <button
          className="flex flex-col items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setSaved(!saved);
          }}
        >
          <div className="w-11 h-11 rounded-full bg-white/[0.1] backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all">
            <Bookmark
              className={`w-6 h-6 transition-all ${saved ? 'text-[#00A8E8] fill-[#00A8E8]' : 'text-white'}`}
              strokeWidth={2}
            />
          </div>
          <span className="micro text-white font-semibold">Save</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-white/[0.1] backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all">
            <Share2 className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        </button>

        {/* 一键复现按钮 - 自己的作品不需要积分 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRecreate();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#00A8E8] to-[#0080FF] active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,168,232,0.4)]"
        >
          <Camera className="w-4 h-4 text-white" strokeWidth={2.5} />
          <span className="micro text-white font-bold leading-tight">拍同款</span>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute left-0 right-16 bottom-0 z-5 px-4 pb-[90px] pt-8">
        {item.tag && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00A8E8]/20 backdrop-blur-sm border border-[#00A8E8]/30 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00A8E8]" />
            <span className="micro text-white font-semibold">{item.tag}</span>
          </div>
        )}

        <h3 className="text-white mb-2 leading-relaxed" style={{ fontSize: '15px', fontWeight: 600 }}>
          {item.title}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-white font-medium" style={{ fontSize: '13px' }}>
            @{item.author}
          </span>
          <span className="text-white/40">·</span>
          <span className="text-white/70" style={{ fontSize: '13px' }}>
            {item.sequence?.name}
          </span>
        </div>

        {/* Creation Stats */}
        <div className="flex items-center gap-2 text-white/60">
          <div className="flex items-center gap-1">
            <Play className="w-3 h-3" strokeWidth={2} />
            <span className="micro">
              {item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}K` : item.views} 播放
            </span>
          </div>
          <span className="text-white/30">·</span>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#FFB800]" strokeWidth={2} />
            <span className="micro">{item.usedCount} 次使用</span>
          </div>
          <span className="text-white/30">·</span>
          <span className="micro">{item.createdAt}</span>
        </div>
      </div>
    </div>
  );
}