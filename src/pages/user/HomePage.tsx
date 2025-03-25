// import Navbar from "@/components/layout/Navbar"
import HeroSection from "@/components/home/HeroSection"
import CodeEditorSection from "@/components/home/CodeEditorSection"
import LeaderboardSection from "@/components/home/LeaderBoardSection"
import FAQSection from "@/components/home/FaqSection"
import PeopleOpenionSection from "@/components/home/PeopleOpenionSection"
import ContactSection from "@/components/home/ContactUsSection"
import Footer from "@/components/layout/Footer"
import Features from "@/components/home/FeatureSection"
const HomePage = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* <Navbar/> */}
      <HeroSection/>
      <Features/>
      <CodeEditorSection/>
      <LeaderboardSection/>
      <PeopleOpenionSection/>
      <FAQSection/>
      <ContactSection/>
      <Footer/>
    </div>
  )
}

export default HomePage