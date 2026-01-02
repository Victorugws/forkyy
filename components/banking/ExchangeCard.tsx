import GlareHover from '@/components/GlareHover'

export default function ExchangeCard() {
  return (
    <GlareHover
      width="100%"
      height="100%"
      background="transparent"
      borderRadius="16px"
      borderColor="transparent"
      glareColor="#ffffff"
      glareOpacity={0.2}
      glareAngle={-30}
      glareSize={300}
      transitionDuration={800}
      playOnce={false}
      className="h-full"
    >
      <div className="bg-white/30 rounded-2xl border border-[#e6ebf3] flex flex-col h-full p-8 backdrop-blur-md">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-[#717c9a]">Exchange</div>
      </div>
      <div>
        <div className="text-xs text-[#b7c3d1] mb-2">You send</div>
        <div className="flex items-center gap-2 mb-4">
          <input className="rounded-md border px-3 py-1 w-24 focus:outline-none bg-[#f3f6fa] text-[#192534]" value="15.500" readOnly />
          <span className="font-medium text-[#192534]">USD</span>
          <span className="ml-auto text-[#b7c3d1] text-xs">Balance: $25.316,65</span>
        </div>
        <div className="text-xs text-[#b7c3d1] mb-2">You receive</div>
        <div className="flex items-center gap-2 mb-5">
          <input className="rounded-md border px-3 py-1 w-32 focus:outline-none bg-[#f3f6fa] text-[#192534]" value="3.8943749" readOnly />
          <span className="font-medium text-[#192534]">ETH</span>
          <span className="ml-auto text-[#b7c3d1] text-xs">Available: 5.2251 ETH</span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#b7c3d1] mt-2">
          <div>Rate</div>
          <div>1 ETH = 3,852.93 USD</div>
        </div>
      </div>
      </div>
    </GlareHover>
  );
}

