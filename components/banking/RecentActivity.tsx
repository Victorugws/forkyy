import GlareHover from '@/components/GlareHover'

export default function RecentActivity() {
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
        <div className="text-sm text-[#717c9a]">Recent activity</div>
        <button className="rounded bg-[#f3f6fa] px-4 py-1 text-[#192534] text-xs font-medium border">Week</button>
      </div>
      <div className="flex flex-col divide-y divide-[#e6ebf3]">
        <div className="flex justify-between py-3">
          <div className="text-[#192534]">From Dominic Fletcher <span className="text-[#717c9a]">Receiving</span></div>
          <div className="text-green-600 font-bold">+ $2.500 <span className="text-sm text-[#b7c3d1]">Dec 14</span></div>
        </div>
        <div className="flex justify-between py-3">
          <div className="text-[#192534]">To Sebastian Turner <span className="text-[#717c9a]">Sending</span></div>
          <div className="text-red-600 font-bold">- $12.423 <span className="text-sm text-[#b7c3d1]">Dec 13</span></div>
        </div>
        <div className="flex justify-between py-3 opacity-50">
          <div className="text-[#192534]">To Theodore Hawkins <span className="text-[#717c9a]">Sending</span></div>
          <div className="text-[#717c9a] font-bold">- $12.567</div>
        </div>
      </div>
      </div>
    </GlareHover>
  );
}

