import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/home/HeroSection'

const ExperienceSelector = dynamic(() => import('@/components/home/ExperienceSelector'), {
  loading: () => <div className="py-24 animate-pulse bg-gray-100" />
})
const FeaturedDishes = dynamic(() => import('@/components/home/FeaturedDishes'), {
  loading: () => <div className="py-24 animate-pulse bg-gray-50" />
})
const WhyChooseUs = dynamic(() => import('@/components/home/WhyChooseUs'), {
  loading: () => <div className="py-24 animate-pulse bg-gray-900" />
})
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
  loading: () => <div className="py-24 animate-pulse bg-gray-900" />
})
const LiveKitchenPreview = dynamic(() => import('@/components/home/LiveKitchenPreview'), {
  loading: () => <div className="py-24 animate-pulse bg-gray-50" />
})
const CTASection = dynamic(() => import('@/components/home/CTASection'), {
  loading: () => <div className="py-24 animate-pulse bg-gray-900" />
})

export default function Home() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<div className="py-24" />}>
        <ExperienceSelector />
        <FeaturedDishes />
        <WhyChooseUs />
        <Testimonials />
        <LiveKitchenPreview />
        <CTASection />
      </Suspense>
    </>
  )
}
