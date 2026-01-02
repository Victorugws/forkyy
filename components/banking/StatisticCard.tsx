import GlareHover from '@/components/GlareHover'

export default function StatisticCard() {
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
        <div className="text-sm text-[#717c9a]">Your statistic</div>
        <button className="rounded bg-[#f3f6fa] px-4 py-1 text-[#192534] text-xs font-medium border">Month</button>
      </div>
      <div className="text-3xl font-bold text-[#192534] mb-2">74%</div>
      <div className="text-xs text-[#b7c3d1] mb-5">increase in earnings</div>
      <div className="flex-1 flex items-end w-full">
        {/* Chart placeholder */}
        <svg width="100%" height="48" viewBox="0 0 184 48" fill="none">
          <path d="M2 42C15 40 35 27 51 29C67 31 73 40 90 32C105 25 124 38 134 31C144 24 153 9 182 17" stroke="#ffcc89" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      </div>
    </GlareHover>
  );
}

