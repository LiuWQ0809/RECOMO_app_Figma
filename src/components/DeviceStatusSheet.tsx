import { X, Wifi, WifiOff, Battery, Signal, Bluetooth, Plus, ChevronRight } from 'lucide-react';

interface DeviceStatusSheetProps {
  isOpen: boolean;
  onClose: () => void;
  deviceConnected: boolean;
  onToggleConnection: (connected: boolean) => void;
}

export default function DeviceStatusSheet({ 
  isOpen, 
  onClose, 
  deviceConnected,
  onToggleConnection 
}: DeviceStatusSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="bg-[#1C1C1E] rounded-t-[24px] max-h-[85vh] overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <h2 className="body-l font-bold text-white">设备状态</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center active:scale-90 transition-transform"
            >
              <X className="w-5 h-5 text-white/70" strokeWidth={2} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto scrollbar-hide px-5 pb-8" style={{ maxHeight: 'calc(85vh - 80px)' }}>
            
            {/* Connected Device */}
            {deviceConnected && (
              <div className="mt-4 mb-6">
                <h3 className="caption font-semibold text-white/50 mb-3 uppercase tracking-wide">当前设备</h3>
                
                <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.08] overflow-hidden">
                  {/* Device Header */}
                  <div className="p-4 border-b border-white/[0.06]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(0,168,232,0.3)]">
                          <Wifi className="w-6 h-6 text-white" strokeWidth={2} />
                        </div>
                        <div>
                          <h4 className="body font-bold text-white mb-0.5">Recomo Pro</h4>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00DC82] shadow-[0_0_8px_rgba(0,220,130,0.6)]" />
                            <span className="caption text-[#00DC82] font-medium">已连接</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onToggleConnection(false)}
                        className="px-3 py-1.5 bg-white/[0.08] rounded-lg caption font-medium text-white/70 border border-white/[0.06] active:scale-95 transition-all"
                      >
                        断开
                      </button>
                    </div>

                    {/* Device Stats Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                        <div className="flex items-center gap-2 mb-1">
                          <Battery className="w-3.5 h-3.5 text-[#00DC82]" strokeWidth={2} />
                          <span className="micro text-tertiary">电量</span>
                        </div>
                        <div className="body font-bold text-white">85%</div>
                      </div>

                      <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                        <div className="flex items-center gap-2 mb-1">
                          <Signal className="w-3.5 h-3.5 text-[#00A8E8]" strokeWidth={2} />
                          <span className="micro text-tertiary">信号</span>
                        </div>
                        <div className="body font-bold text-white">强</div>
                      </div>

                      <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                        <div className="flex items-center gap-2 mb-1">
                          <Bluetooth className="w-3.5 h-3.5 text-[#00A8E8]" strokeWidth={2} />
                          <span className="micro text-tertiary">蓝牙</span>
                        </div>
                        <div className="body font-bold text-white">5.0</div>
                      </div>
                    </div>
                  </div>

                  {/* Device Details */}
                  <div className="p-4 space-y-2">
                    <DetailRow label="序列号" value="RC-20241118-001" />
                    <DetailRow label="固件版本" value="v2.3.1" />
                    <DetailRow label="最后同步" value="2分钟前" />
                    <DetailRow label="存储空间" value="128GB / 256GB" />
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4">
                    <button className="w-full py-3 bg-white/[0.08] rounded-xl caption font-semibold text-white border border-white/[0.08] active:scale-95 transition-all flex items-center justify-center gap-2">
                      <ChevronRight className="w-4 h-4" strokeWidth={2} />
                      <span>设备设置</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Disconnected State */}
            {!deviceConnected && (
              <div className="mt-4 mb-6">
                <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.08] p-6 text-center">
                  <div className="w-16 h-16 bg-white/[0.06] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <WifiOff className="w-8 h-8 text-white/30" strokeWidth={2} />
                  </div>
                  <h4 className="body font-semibold text-white mb-2">未连接设备</h4>
                  <p className="caption text-tertiary mb-4 leading-relaxed">
                    请打开 Recomo 设备并确保蓝牙已开启
                  </p>
                  <button 
                    onClick={() => onToggleConnection(true)}
                    className="btn-primary-sm mx-auto"
                  >
                    搜索设备
                  </button>
                </div>
              </div>
            )}

            {/* Available Devices */}
            <div>
              <h3 className="caption font-semibold text-white/50 mb-3 uppercase tracking-wide">可用设备</h3>
              
              <div className="space-y-2">
                <AvailableDeviceCard 
                  name="Recomo Mini"
                  status="附近"
                  battery={92}
                  onConnect={() => {}}
                />
                <AvailableDeviceCard 
                  name="Recomo Air"
                  status="附近"
                  battery={68}
                  onConnect={() => {}}
                />
              </div>
            </div>

            {/* Add Device */}
            <div className="mt-6">
              <button className="w-full p-4 bg-[#0A0A0A] rounded-2xl border border-dashed border-white/[0.12] flex items-center justify-center gap-2 text-white/70 hover:border-white/[0.2] hover:text-white transition-all active:scale-98">
                <Plus className="w-5 h-5" strokeWidth={2} />
                <span className="body font-medium">添加新设备</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 详细信息行
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="caption text-tertiary">{label}</span>
      <span className="caption text-white font-medium">{value}</span>
    </div>
  );
}

// 可用设备卡片
function AvailableDeviceCard({ 
  name, 
  status, 
  battery,
  onConnect 
}: { 
  name: string; 
  status: string; 
  battery: number;
  onConnect: () => void;
}) {
  return (
    <button
      onClick={onConnect}
      className="w-full bg-[#0A0A0A] rounded-xl border border-white/[0.08] p-4 flex items-center justify-between active:scale-98 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/[0.06] rounded-xl flex items-center justify-center">
          <Wifi className="w-5 h-5 text-white/50" strokeWidth={2} />
        </div>
        <div className="text-left">
          <div className="body font-semibold text-white mb-0.5">{name}</div>
          <div className="flex items-center gap-2">
            <span className="caption text-tertiary">{status}</span>
            <span className="text-white/20">·</span>
            <span className="caption text-tertiary">{battery}%</span>
          </div>
        </div>
      </div>
      <div className="px-3 py-1.5 bg-brand-gradient rounded-lg">
        <span className="caption font-semibold text-white">连接</span>
      </div>
    </button>
  );
}
