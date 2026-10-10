import Hero3D from "../components/Hero3D";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import ServicesSection from "../components/ServicesSection";
import Contact from "./Contact";
import Certificates from "../components/Certificates";

export default function Home() {
  return (
    <>
      <Hero3D />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <Certificates />
      <ServicesSection />
      <Contact />
    </>
  );
}