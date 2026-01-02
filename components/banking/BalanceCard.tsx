import GlareHover from '@/components/GlareHover'

export default function BalanceCard() {
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
      <div className="bg-white/30 rounded-2xl border border-[#e6ebf3] h-full p-8 flex flex-col justify-between backdrop-blur-md">
      <div className="mb-6">
        <div className="text-center text-[#717c9a] text-sm mb-2 font-medium">Business Banking</div>
        <div className="text-[2rem] leading-tight font-serif font-medium text-[#192534] text-center">
          You have <span className="text-[#2a445b] font-bold">$25.316,65</span> in<br/>
          your chequing account with<br/>
          <span className="text-[#2a445b] font-bold">$7.210,45</span> in the way.
        </div>
        <div className="my-6">
          <div className="text-lg text-[#192534] text-center font-normal">
            48% <span className="text-xs text-[#b7c3d1]">increase in earnings</span>
          </div>
          {/* Chart placeholder (sim svg/chart) */}
          <div className="mt-3 relative h-12 flex items-end">
            <div className="w-full h-12">
              <svg width="100%" height="48" viewBox="0 0 190 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffcc89" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ffcc89" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffa64d" />
                    <stop offset="50%" stopColor="#ffcc89" />
                    <stop offset="100%" stopColor="#ffd699" />
                  </linearGradient>
                </defs>
                {/* Area fill under the line */}
                <path d="M2 42 L2 35 C8 33, 15 38, 22 34 C28 31, 32 26, 38 29 C44 32, 48 38, 54 33 C60 28, 65 22, 72 25 C78 28, 82 35, 88 31 C94 27, 98 18, 104 20 C110 22, 114 32, 120 28 C126 24, 130 15, 136 17 C142 19, 146 28, 152 31 C158 34, 164 38, 170 35 C176 32, 180 26, 186 29 L186 42 Z" fill="url(#chartGradient)" />
                {/* Main line with gradient */}
                <path d="M2 35 C8 33, 15 38, 22 34 C28 31, 32 26, 38 29 C44 32, 48 38, 54 33 C60 28, 65 22, 72 25 C78 28, 82 35, 88 31 C94 27, 98 18, 104 20 C110 22, 114 32, 120 28 C126 24, 130 15, 136 17 C142 19, 146 28, 152 31 C158 34, 164 38, 170 35 C176 32, 180 26, 186 29" stroke="url(#lineGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* Subtle highlight points */}
                <circle cx="104" cy="20" r="2" fill="#ffcc89" opacity="0.8" />
                <circle cx="152" cy="31" r="2" fill="#ffcc89" opacity="0.8" />
                <circle cx="186" cy="29" r="2.5" fill="#ffa64d" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-center mt-2">
        <button className="rounded-md px-6 py-2 bg-[#192534] text-white font-medium">Start a transfer</button>
        <button className="rounded-md px-6 py-2 bg-white border border-[#e3e8f7] text-[#142536] font-medium">Make a deposit</button>
      </div>
      </div>
    </GlareHover>
  );
}

