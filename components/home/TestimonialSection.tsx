'use client'

import GlareHover from '@/components/reactbits/effects/GlareHover'

export function TestimonialSection() {
  return (
    <section className="relative w-full">
      <style jsx>{`
        @keyframes glimmer {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        .glimmer-effect::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 70%
          );
          animation: glimmer 3s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      <GlareHover
        width="100%"
        height="100%"
        background="transparent"
        borderRadius="0px"
        borderColor="transparent"
        glareColor="#ffffff"
        glareOpacity={0.7}
        glareAngle={-60}
        glareSize={300}
        transitionDuration={1800}
        autoPlay={false}
        style={{ border: 'none' }}
        className="glimmer-effect"
      >
        {/* Blur overlay background - full width */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/7 pointer-events-none" />

        {/* Content container */}
        <div className="py-24 px-6 max-w-[1200px] mx-auto relative z-10">
          {/* Top separator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="text-center">
            <h3
              className="text-[36px] leading-[1.4] mb-12 max-w-4xl mx-auto"
              style={{
                lineHeight: '1.4',
                letterSpacing: '-0.01em',
              }}
            >
              <span className="text-muted-foreground">"We harness </span>
              <span style={{ color: '#666666' }} className="font-medium">your data</span>
              <span className="text-muted-foreground">, understand your audience, and use </span>
              <span style={{ color: '#666666' }} className="font-medium">AI</span>
              <span className="text-muted-foreground"> to help your brand rise above the noise. The best part? </span>
              <span style={{ color: '#666666' }} className="font-medium">We execute</span>
              <span className="text-muted-foreground">, too."</span>
            </h3>

            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
                OA
              </div>
              <p className="text-sm text-muted-foreground">Founder of ORB AI</p>
            </div>
          </div>

          {/* Bottom separator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </GlareHover>
    </section>
  )
}
