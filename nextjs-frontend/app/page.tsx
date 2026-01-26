import HeroSection from '@/components/home/HeroSection'
import ExperienceSelector from '@/components/home/ExperienceSelector'
import FeaturedDishes from '@/components/home/FeaturedDishes'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import LiveKitchenPreview from '@/components/home/LiveKitchenPreview'
import CTASection from '@/components/home/CTASection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ExperienceSelector />
      <FeaturedDishes />
      <WhyChooseUs />
      <LiveKitchenPreview />
      <CTASection />
    </>
  )
}
