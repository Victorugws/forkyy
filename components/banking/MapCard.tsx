import Image from 'next/image'
import GlareHover from '@/components/GlareHover'

export default function MapCard() {
  return (
    <GlareHover
      width="100%"
      height="600px"
      background="transparent"
      borderRadius="16px"
      borderColor="transparent"
      glareColor="#ffffff"
      glareOpacity={0.2}
      glareAngle={-30}
      glareSize={300}
      transitionDuration={800}
      playOnce={false}
      className="w-full"
    >
      <div className="bg-white/30 rounded-2xl border border-[#e6ebf3] p-6 h-[600px] backdrop-blur-md w-full">
      <div className="text-lg font-semibold text-[#192534] mb-4">Global Operations Map</div>
      <div className="w-full h-full rounded-xl relative overflow-hidden">
        <Image
          src="/images/europe-3483539.jpg"
          alt="Europe Map"
          fill
          className="object-cover"
          priority
        />
      </div>
      </div>
    </GlareHover>
  );
}

