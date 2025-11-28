import { useState, useEffect, useRef } from 'react';
import { Wifi, Heart, MessageCircle, Share2, Bookmark, Play, Star, Download, ChevronLeft, Zap, TrendingUp, Sparkles, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import DeviceStatusSheet from './DeviceStatusSheet';
import SequenceSetupModal from './SequenceSetupModal';
import danceGroupImage from 'figma:asset/fb7629f5125b5fa4733c62a78701629976c3294e.png';
import rockRollImage from 'figma:asset/c8b687d4bb1c12f7a9786630586f09977659b7cd.png';
import marioShowImage from 'figma:asset/98eb1ef0a52839e06b4e1139cd02fcec67be6459.png';
import golferImage from 'figma:asset/d927901e7682ac4e85fcfd5486c41b2a1c483e71.png';
import reidTravelImage from 'figma:asset/8c202670263e15a12c2606c46b3a2cea7b943ecf.png';

// Mock data
// 插入本地 Pokerface 视频到首位，videoUrl 与 thumbnail 使用 /data 路径
const mockFeedData = [
  {
    id: 100,
    videoUrl: '/data/Pokerface.mp4',
    thumbnail: '/data/Pokerface.png',
    forceThumbnail: true,
    title: 'PokerFace',
    author: 'XianBo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    likes: 18600,
    comments: 723,
    sequenceName: '追光者',
    sequenceCode: 'C2',
    tag: '官方',
    duration: '0:30',
    downloads: 6800,
    rating: 4.9,
    difficulty: 'medium',
    credits: 100,
    isLiked: false,
    isSaved: false,
    distance: '2.8m',
    speed: '中速',
    time: '30s',
  },

  {
    id: 0,
    videoUrl: '/data/飞书20251126-163535.mp4',
    thumbnail: '/data/20251126-163618.jpg',
    forceThumbnail: true,
    title: 'Farewell-SpaceT8',
    author: '94强',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    likes: 13500,
    comments: 480,
    sequenceName: 'Farewell-SpaceT8',
    sequenceCode: 'C1',
    tag: '官方',
    duration: '0:30',
    downloads: 4200,
    rating: 4.9,
    difficulty: 'medium',
    credits: 95,
    isLiked: false,
    isSaved: false,
    distance: '3.0m',
    speed: '中速',
    time: '30s',
    type: 'dance',
    musicName: 'Space Farewell',
    bpm: 128,
    hasARGuide: true,
  },
  {
    id: 1,
    videoUrl: '/data/飞书20251124-172645.mp4',
    thumbnail: '/data/20251124-185456.jpg',
    forceThumbnail: true,
    title: '下午茶',
    author: '本地视频',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    likes: 8900,
    comments: 342,
    sequenceName: '下午茶',
    sequenceCode: 'C3',
    tag: '官方',
    duration: '0:28',
    downloads: 3200,
    rating: 4.9,
    difficulty: 'medium',
    credits: 80,
    isLiked: false,
    isSaved: false,
    distance: '2.5m',
    speed: '中速',
    time: '28s',
    type: 'dance',
    musicName: 'Feel the Beat',
    bpm: 122,
    hasARGuide: true,
  },
  {
    id: 2,
    videoUrl: 'https://example.com/video2.mp4',
    thumbnail: rockRollImage,
    title: 'Rock&Roll',
    author: "K'",
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    likes: 15200,
    comments: 589,
    sequenceName: '追光者',
    sequenceCode: 'C2',
    tag: '官方',
    duration: '0:35',
    downloads: 5600,
    rating: 4.9,
    difficulty: 'hard',
    credits: 120,
    isLiked: false,
    isSaved: false,
    distance: '3.2m',
    speed: '快速',
    time: '35s',
  },
  {
    id: 3,
    videoUrl: 'https://example.com/video3.mp4',
    thumbnail: marioShowImage,
    title: 'Mario Show',
    author: 'Marc',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    likes: 12800,
    comments: 456,
    sequenceName: '惊艳亮相',
    sequenceCode: 'C6',
    tag: '官方',
    duration: '0:20',
    downloads: 4200,
    rating: 4.8,
    difficulty: 'easy',
    credits: 60,
    isLiked: false,
    isSaved: false,
    distance: '1.8m',
    speed: '中速',
    time: '20s',
  },
  {
    id: 4,
    videoUrl: 'https://example.com/video4.mp4',
    thumbnail: golferImage,
    title: '下场打高尔夫啦！',
    author: 'Golfer-VF',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    likes: 6700,
    comments: 198,
    sequenceName: '视野展开',
    sequenceCode: 'C1',
    tag: '官方',
    duration: '0:32',
    downloads: 2800,
    rating: 4.8,
    difficulty: 'medium',
    credits: 90,
    isLiked: false,
    isSaved: false,
    distance: '4.5m',
    speed: '中速',
    time: '32s',
  },
  {
    id: 5,
    videoUrl: 'https://example.com/video5.mp4',
    thumbnail: reidTravelImage,
    title: '剑桥下午茶时光',
    author: 'Reid',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    likes: 9200,
    comments: 367,
    sequenceName: '聚焦时刻',
    sequenceCode: 'C3',
    duration: '0:26',
    downloads: 3400,
    rating: 4.9,
    difficulty: 'easy',
    credits: 70,
    isLiked: false,
    isSaved: false,
    distance: '1.2m',
    speed: '慢速',
    time: '26s',
  },
  {
    id: 6,
    videoUrl: 'https://example.com/video6.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop',
    title: '日系穿搭分享',
    author: 'Ting',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    likes: 2300,
    comments: 45,
    sequenceName: '追光者',
    sequenceCode: 'C2',
    tag: '官方',
    duration: '0:22',
    downloads: 1200,
    rating: 4.7,
    difficulty: 'easy',
    isLiked: false,
    isSaved: false,
  },
  {
    id: 7,
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=1200&fit=crop',
    title: '旅行VLOG片段',
    author: '旅行日记',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    likes: 1800,
    comments: 56,
    sequenceName: '视野展开',
    sequenceCode: 'C1',
    duration: '0:20',
    downloads: 720,
    rating: 4.7,
    difficulty: 'easy',
    isLiked: false,
    isSaved: false,
  },
  {
    id: 8,
    thumbnail: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&h=1200&fit=crop',
    title: '化妆技巧分享',
    author: '美妆博主小K',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    likes: 3100,
    comments: 124,
    sequenceName: '聚焦时刻',
    sequenceCode: 'C3',
    duration: '0:15',
    downloads: 2100,
    rating: 4.9,
    difficulty: 'easy',
    isLiked: false,
    isSaved: false,
  },
  {
    id: 9,
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop',
    title: '咖啡店探店',
    author: '美食探索家',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    likes: 1450,
    comments: 67,
    sequenceName: '空间漫步',
    sequenceCode: 'C5',
    duration: '0:28',
    downloads: 980,
    rating: 4.6,
    difficulty: 'medium',
    isLiked: false,
    isSaved: false,
  },
];

const categories = ['推荐', '关注', '热门', '官方模版', '教程'];

const difficultyConfig = {
  easy: { label: '简单', color: '#00DC82' },
  medium: { label: '中级', color: '#FFB800' },
  hard: { label: '专业', color: '#FF6B6B' },
};

export default function DiscoverPage({
  onTemplateSelect,
}: {
  onTemplateSelect: (template: any) => void;
}) {
  const [viewMode, setViewMode] = useState<'grid' | 'scroll'>('grid');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('推荐');
  const [deviceSheetOpen, setDeviceSheetOpen] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(true);
  const [sequenceSetupOpen, setSequenceSetupOpen] = useState(false);
  const [templateToUse, setTemplateToUse] = useState<any>(null);

  const handleCardClick = (item: any) => {
    setSelectedItem(item);
    setViewMode('scroll');
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedItem(null);
  };

  const handleUseTemplate = (item: any) => {
    setTemplateToUse(item);
    setSequenceSetupOpen(true);
  };

  const handleSequenceComplete = (config: any) => {
    if (templateToUse) {
      onTemplateSelect({
        ...templateToUse,
        musicConfig: config.music,
        sceneConfig: config.scene,
      });
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#0A0A0A] overflow-hidden">
      {viewMode === 'grid' ? (
        <GridView
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onCardClick={handleCardClick}
          onUseTemplate={handleUseTemplate}
          deviceConnected={deviceConnected}
          onDeviceClick={() => setDeviceSheetOpen(true)}
        />
      ) : (
        <ScrollView
          selectedItem={selectedItem}
          allItems={mockFeedData}
          onBack={handleBackToGrid}
          onUseTemplate={handleUseTemplate}
        />
      )}

      {/* Device Status Sheet */}
      <DeviceStatusSheet 
        isOpen={deviceSheetOpen} 
        onClose={() => setDeviceSheetOpen(false)}
        deviceConnected={deviceConnected}
        onToggleConnection={(connected) => setDeviceConnected(connected)}
      />

      {/* Sequence Setup Modal */}
      <SequenceSetupModal
        sequenceName={templateToUse?.sequenceName}
        isOpen={sequenceSetupOpen}
        onClose={() => setSequenceSetupOpen(false)}
        onComplete={handleSequenceComplete}
      />
    </div>
  );
}

// Grid View - 两列分类浏览模式
function GridView({
  activeCategory,
  onCategoryChange,
  onCardClick,
  onUseTemplate,
  deviceConnected,
  onDeviceClick,
}: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onCardClick: (item: any) => void;
  onUseTemplate: (item: any) => void;
  deviceConnected: boolean;
  onDeviceClick: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div 
        className="flex-none bg-[#0A0A0A] z-20" 
        style={{ paddingTop: 'max(44px, env(safe-area-inset-top))' }}
      >
        {/* Top Bar */}
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">发现</h1>
          
          <div className="flex items-center gap-3">
            {/* Search Icon - Subtle */}
            <button className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center active:scale-95 transition-all">
              <Search className="w-4.5 h-4.5 text-white/60" strokeWidth={2} />
            </button>
            
            {/* Device Status */}
            <button
              onClick={onDeviceClick}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/[0.08] transition-all active:scale-95"
            >
              <Wifi className={`w-4 h-4 ${deviceConnected ? 'text-[#00DC82]' : 'text-white/50'}`} strokeWidth={2} />
              <span className="caption text-white font-medium">Recomo Pro</span>
              {deviceConnected && (
                <div className="w-2 h-2 bg-[#00DC82] rounded-full shadow-[0_0_8px_rgba(0,220,130,0.6)]" />
              )}
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex-none px-4 py-1.5 rounded-full transition-all ${
                activeCategory === category
                  ? 'bg-[#00A8E8] text-white'
                  : 'bg-white/[0.08] text-white/60'
              }`}
            >
              <span className="caption font-medium whitespace-nowrap">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 p-2 pb-[70px]">
          {mockFeedData.map((item) => (
            <GridCard
              key={item.id}
              item={item}
              onClick={() => onCardClick(item)}
              onUseClick={() => onUseTemplate(item)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// Grid Card - 优化后的两列卡片
function GridCard({ item, onClick, onUseClick }: { item: any; onClick: () => void; onUseClick: () => void }) {
  const difficulty = difficultyConfig[item.difficulty as keyof typeof difficultyConfig];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumbError, setThumbError] = useState(false);

  useEffect(() => {
    setThumbError(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [item.videoUrl]);
  
  return (
    <div className="flex flex-col bg-[#1A1A1A] rounded-xl overflow-hidden">
      {/* Thumbnail */}
      <button onClick={onClick} className="relative aspect-[3/4] overflow-hidden">
        {item.videoUrl && !thumbError && !item.forceThumbnail ? (
          <video
            ref={videoRef}
            src={item.videoUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => {
              const v = videoRef.current;
              if (v) {
                v.pause();
                v.currentTime = 0;
              }
            }}
            onError={() => setThumbError(true)}
          />
        ) : (
          <ImageWithFallback
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" strokeWidth={0} />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
          <span className="micro text-white font-medium">{item.duration}</span>
        </div>

        {/* Official Badge */}
        {item.tag && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-gradient-to-r from-[#00A8E8] to-[#0080FF] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-white" strokeWidth={2.5} />
            <span className="micro text-white font-bold">{item.tag}</span>
          </div>
        )}

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">
            {item.title}
          </h3>
          <div className="flex items-center gap-1.5">
            <ImageWithFallback
              src={item.avatar}
              alt={item.author}
              className="w-4 h-4 rounded-full"
            />
            <span className="micro text-white/80 font-medium truncate">{item.author}</span>
          </div>
        </div>
      </button>

      {/* Sequence Info - 优化后的简洁版本 */}
      <div className="p-2.5 space-y-2">
        {/* Sequence Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#00A8E8] to-[#0080FF] flex items-center justify-center flex-none">
              <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="caption text-white font-bold truncate">{item.sequenceCode}</span>
            <span 
              className="micro px-1.5 py-0.5 rounded" 
              style={{ 
                backgroundColor: `${difficulty.color}20`,
                color: difficulty.color,
                fontWeight: 600,
              }}
            >
              {difficulty.label}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUseClick();
            }}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-[#00A8E8] to-[#0080FF] text-white caption font-bold active:scale-95 transition-transform shadow-[0_2px_8px_rgba(0,168,232,0.3)]"
          >
            拍同款
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-white/50">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" strokeWidth={2} />
            <span className="micro font-medium">
              {item.downloads >= 1000 ? `${(item.downloads / 1000).toFixed(1)}K` : item.downloads}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-[#FFB800] fill-[#FFB800]" strokeWidth={0} />
            <span className="micro font-bold text-white">{item.rating}</span>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#FFB800]/20 border border-[#FFB800]/30">
            <Zap className="w-2.5 h-2.5 text-[#FFB800]" strokeWidth={2.5} fill="#FFB800" />
            <span className="micro font-bold text-[#FFB800]">{item.credits}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Scroll View - 全屏滚动模式（新增使用按钮）
function ScrollView({
  selectedItem,
  allItems,
  onBack,
  onUseTemplate,
}: {
  selectedItem: any;
  allItems: any[];
  onBack: () => void;
  onUseTemplate: (item: any) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 滚动到选中的item
  useEffect(() => {
    if (selectedItem && scrollContainerRef.current) {
      const selectedIndex = allItems.findIndex(item => item.id === selectedItem.id);
      if (selectedIndex !== -1) {
        const scrollHeight = scrollContainerRef.current.scrollHeight;
        const containerHeight = scrollContainerRef.current.clientHeight;
        const scrollPosition = (scrollHeight / allItems.length) * selectedIndex;
        
        scrollContainerRef.current.scrollTo({
          top: scrollPosition,
          behavior: 'auto',
        });
      }
    }
  }, [selectedItem, allItems]);

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
          <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Feed */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory">
        {allItems.map((item) => (
          <FeedCard 
            key={item.id} 
            item={item} 
            onSelect={() => onUseTemplate(item)} 
          />
        ))}
      </div>
    </div>
  );
}

// Feed Card - 全屏卡片（新增使用按钮）
function FeedCard({ item, onSelect }: { item: any; onSelect: () => void }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    }
  }, [item.videoUrl]);

  return (
    <div 
      className="relative w-full bg-[#0A0A0A] snap-start flex-none"
      style={{ height: '100%' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {item.videoUrl && !videoError ? (
          <video
            ref={videoRef}
            src={item.videoUrl}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            onError={() => setVideoError(true)}
            poster={item.thumbnail}
          />
        ) : (
          <ImageWithFallback
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-[90px] z-10 flex flex-col items-center gap-5">
        {/* Avatar */}
        <button className="relative">
          <ImageWithFallback
            src={item.avatar}
            alt={item.author}
            className="w-12 h-12 rounded-full border-2 border-white/20"
          />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#FF6B6B] rounded-full flex items-center justify-center border-2 border-[#0A0A0A]">
            <span className="text-white text-xs font-bold leading-none">+</span>
          </div>
        </button>

        {/* Like */}
        <button 
          className="flex flex-col items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
        >
          <div className="w-11 h-11 rounded-full bg-white/[0.1] backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all">
            <Heart 
              className={`w-6 h-6 transition-all ${liked ? 'text-[#FF6B6B] fill-[#FF6B6B]' : 'text-white'}`}
              strokeWidth={2}
            />
          </div>
          <span className="micro text-white font-semibold">
            {liked ? item.likes + 1 : item.likes >= 1000 ? `${(item.likes / 1000).toFixed(1)}k` : item.likes}
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

        {/* 拍同款按钮 */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FF9500] active:scale-95 transition-all shadow-[0_4px_12px_rgba(255,184,0,0.4)]"
        >
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} fill="white" />
          <div className="flex flex-col items-start">
            <span className="micro text-white font-bold leading-tight">拍同款</span>
            <span className="micro text-white/90 font-medium leading-tight">{item.credits}积分</span>
          </div>
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
            {item.sequenceName}
          </span>
        </div>

        {/* Sequence Quick Info */}
        <div className="flex items-center gap-2 text-white/60">
          <span className="micro">{item.distance}</span>
          <span className="text-white/30">·</span>
          <span className="micro">{item.speed}</span>
          <span className="text-white/30">·</span>
          <span className="micro">{item.time}</span>
        </div>
      </div>
    </div>
  );
}
