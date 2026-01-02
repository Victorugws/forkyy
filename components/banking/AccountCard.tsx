import GlareHover from '@/components/GlareHover'

export default function AccountCard() {
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
      <div className="bg-white/30 rounded-2xl border border-[#e6ebf3] p-10 h-full flex flex-col backdrop-blur-md">
      <div className="text-center text-[#717c9a] mb-3 font-medium">Orbis Cashback Credit</div>
      <div className="w-full flex justify-center mb-6">
        {/* Card Visual */}
        <div className="cursor-target rounded-2xl bg-gradient-to-br from-[#0a1624] via-[#142536] to-[#1e3450] w-[476px] h-[264px] text-left p-7 flex flex-col justify-between relative" style={{boxShadow: '0 16px 48px 0 rgba(10, 22, 36, 0.4)'}}>
          <div className="text-xl text-white font-serif mb-2 tracking-wide">Orbis</div>
          <div className="flex-1"></div>
          <div>
            <div className="text-lg text-white font-serif">Ivy<br/>Brooks</div>
            <div className="absolute top-6 right-8 bg-white rounded-full w-7 h-7 flex items-center justify-center">
              <span className="w-3 h-3 inline-block bg-gray-400 rounded-full"></span>
            </div>
            <div className="text-white text-2xl font-bold mt-3">$37.592 <span className="text-xs text-[#b7c3d1]">/ $70,000</span></div>
          </div>
          {/* Simulated Card EMV chip */}
          <div className="absolute bottom-7 right-8 w-8 h-6 rounded bg-gray-300" style={{boxShadow: 'inset 1px 1px 5px #d1dae9'}} />
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <button className="rounded-md px-6 py-2 bg-[#142536] text-white font-medium">Pay early</button>
        <button className="rounded-md px-6 py-2 bg-white border border-[#e3e8f7] text-[#142536] font-medium">View rewards</button>
      </div>
      </div>
    </GlareHover>
  );
}

