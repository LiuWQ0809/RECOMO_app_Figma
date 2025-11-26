import { useState } from 'react';
import { Home, Video, User, Plus, Camera } from 'lucide-react';
import DiscoverPage from './components/DiscoverPage';
import CreatePage from './components/CreatePage';
import MyPage from './components/MyPage';
import TemplatePreparePage from './components/TemplatePreparePage';
import SequenceEditor from './components/SequenceEditor';
import recomoLogo from 'figma:asset/9f5ce0299f7520c70314ce051ea2cb2bae0543de.png';

export default function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'create' | 'my'>('discover');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isLiveShooting, setIsLiveShooting] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSequenceEditor, setShowSequenceEditor] = useState(false);
  const [savedShots, setSavedShots] = useState<any[]>([]);
  const [savedSequences, setSavedSequences] = useState<any[]>([]);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    // SequenceSetupModal只是选择音乐和场景的入口
    // 真正的AI匹配、场景扫描、参数调整在TemplatePreparePage中完成
    setIsLiveShooting(false);
    setActiveTab('create');
  };

  const handleBackToDiscover = () => {
    setSelectedTemplate(null);
    setIsLiveShooting(false);
    setIsPreviewMode(false);
    setActiveTab('discover');
  };

  const handleStartShooting = (template: any) => {
    setSelectedTemplate(template);
    setIsLiveShooting(true);
    setIsPreviewMode(false);
    // Already on 'create' tab
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setIsLiveShooting(true);
    setIsPreviewMode(true);
    // Already on 'create' tab
  };

  const handleSaveShot = (shot: any) => {
    setSavedShots([...savedShots, shot]);
  };

  const handleSaveSequence = (sequence: any) => {
    setSavedSequences([...savedSequences, sequence]);
    setShowSequenceEditor(false);
    setActiveTab('my');
  };

  const handleOpenSequenceEditor = () => {
    setShowSequenceEditor(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      {/* Mobile Container - 9:16 Aspect Ratio */}
      <div className="w-full max-w-[393px] h-[852px] bg-[#0A0A0A] text-white overflow-hidden flex flex-col rounded-[56px] shadow-[0_25px_100px_rgba(0,0,0,0.95)] relative border-[16px] border-[#0A0A0A]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {showSequenceEditor ? (
            <SequenceEditor
              savedShots={savedShots}
              onSave={handleSaveSequence}
              onBack={() => setShowSequenceEditor(false)}
            />
          ) : (
            <>
              {activeTab === 'discover' && <DiscoverPage onTemplateSelect={handleTemplateSelect} />}
              {activeTab === 'create' && (
                selectedTemplate && !isLiveShooting ? (
                  <TemplatePreparePage 
                    template={selectedTemplate} 
                    onBack={handleBackToDiscover}
                    onStartShooting={handleStartShooting}
                    onPreview={handlePreview}
                  />
                ) : (
                  <CreatePage 
                    activeTemplate={isLiveShooting ? selectedTemplate : null}
                    onSaveShot={handleSaveShot}
                    isPreview={isPreviewMode}
                  />
                )
              )}
              {activeTab === 'my' && (
                <MyPage 
                  savedShots={savedShots}
                  savedSequences={savedSequences}
                  onOpenSequenceEditor={handleOpenSequenceEditor}
                />
              )}
            </>
          )}
        </div>

        {/* Bottom Navigation - Hide when in Sequence Editor */}
        {!showSequenceEditor && (
          <nav className="absolute bottom-0 left-0 right-0 h-[70px] bg-[#0A0A0A] border-t border-white/[0.06] pb-[20px] z-40">
            <div className="h-full flex items-center justify-around relative px-8">
              {/* Discover Tab */}
              <button
                onClick={() => setActiveTab('discover')}
                className="flex items-center justify-center w-12 h-12 transition-all active:scale-95"
                title="发现"
              >
                <Home
                  className={`h-6 w-6 ${
                    activeTab === 'discover' ? 'text-brand' : 'text-white/40'
                  }`}
                  strokeWidth={2}
                />
              </button>

              {/* Create Tab - Custom REC Design */}
              <button
                onClick={() => {
                  setActiveTab('create');
                }}
                className="flex items-center justify-center w-12 h-12 transition-all active:scale-95"
                title="创作"
              >
                {/* REC Badge */}
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  activeTab === 'create' 
                    ? 'bg-brand/20 border border-brand/40' 
                    : 'bg-white/[0.08] border border-white/[0.12]'
                }`}>
                  {/* Recording Dot */}
                  <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeTab === 'create'
                      ? 'bg-[#FF4444] shadow-[0_0_8px_rgba(255,68,68,0.6)]'
                      : 'bg-white/40'
                  }`} />
                  {/* REC Text */}
                  <span className={`text-[10px] font-bold tracking-wider transition-all ${
                    activeTab === 'create' ? 'text-brand' : 'text-white/60'
                  }`}>
                    REC
                  </span>
                </div>
              </button>

              {/* My Tab */}
              <button
                onClick={() => setActiveTab('my')}
                className="flex items-center justify-center w-12 h-12 transition-all active:scale-95"
                title="我的"
              >
                <User
                  className={`h-6 w-6 ${
                    activeTab === 'my' ? 'text-brand' : 'text-white/40'
                  }`}
                  strokeWidth={2}
                />
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}