'use client'

import { motion } from 'motion/react'
import { Sparkles, MousePointer2, Search, Zap, Target, Eye } from 'lucide-react'

export function HyperBrowserDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">Hyper Browser Experience</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900">
          Next-Generation Browser Interaction
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          An intelligent, context-aware browsing experience that brings visual search,
          adaptive interactions, and AI-powered analysis to every element on the page.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        {/* Feature 1: Adaptive Target Cursor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl w-fit mb-4">
            <MousePointer2 className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Adaptive Target Cursor</h3>
          <p className="text-gray-600 mb-4">
            Your cursor intelligently morphs to match the boundaries of significant elements,
            expanding to the corners of text, images, and interactive components.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              <span>Expands to element corners</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              <span>Highlights googleable content</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              <span>Visual feedback on significance</span>
            </div>
          </div>
        </motion.div>

        {/* Feature 2: Smart Element Detection */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl w-fit mb-4">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Element Detection</h3>
          <p className="text-gray-600 mb-4">
            Automatically identifies significant content: headings, images, paragraphs,
            links, products, and videos with intelligent significance scoring.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span>Text blocks & paragraphs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span>Images & videos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span>Products & interactive elements</span>
            </div>
          </div>
        </motion.div>

        {/* Feature 3: Visual Search */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl w-fit mb-4">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Visual Search Integration</h3>
          <p className="text-gray-600 mb-4">
            Like iPhone's visual lookup - hold any element to trigger AI-powered search,
            analysis, and contextual information retrieval.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span>Long-press to analyze (600ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span>Progress indicator during hold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span>Instant analysis results</span>
            </div>
          </div>
        </motion.div>

        {/* Feature 4: Hyper Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl w-fit mb-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Analysis</h3>
          <p className="text-gray-600 mb-4">
            Get instant access to web searches, related images, knowledge panels,
            and AI-generated summaries for any element you select.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
              <span>Google search results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
              <span>Related images & videos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
              <span>Knowledge panels & facts</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* How to Use */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Search className="h-6 w-6 text-purple-600" />
          How to Use
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <h3 className="font-semibold text-gray-900">Hover Over Content</h3>
            <p className="text-sm text-gray-600">
              Move your cursor over any text, image, or element. The cursor will
              automatically expand to match significant elements.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <h3 className="font-semibold text-gray-900">Hold to Analyze</h3>
            <p className="text-sm text-gray-600">
              Press and hold (600ms) on any highlighted element to trigger the
              hyper analysis overlay with comprehensive information.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <h3 className="font-semibold text-gray-900">Explore Results</h3>
            <p className="text-sm text-gray-600">
              Browse through search results, images, knowledge panels, and related
              topics in the beautiful analysis interface.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Element Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported Element Types</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Headings', score: '90%', color: 'purple' },
            { label: 'Images', score: '85%', color: 'pink' },
            { label: 'Videos', score: '85%', color: 'blue' },
            { label: 'Products', score: '80%', color: 'green' },
            { label: 'Paragraphs', score: '75%', color: 'yellow' },
            { label: 'Links', score: '70%', color: 'orange' },
            { label: 'Buttons', score: '65%', color: 'red' },
            { label: 'Text Blocks', score: '60%', color: 'indigo' },
          ].map((type, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-lg font-bold text-gray-900">{type.label}</div>
              <div className="text-sm text-gray-500">Significance</div>
              <div className="text-lg font-semibold text-purple-600">{type.score}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
