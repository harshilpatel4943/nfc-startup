import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { QuickActions } from '../components/sections/QuickActions';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { StorySection } from '../components/sections/StorySection';
import { MenuPreviewSection } from '../components/sections/MenuPreviewSection';
import { GallerySection } from '../components/sections/GallerySection';
import { ReviewSection } from '../components/sections/ReviewSection';
import { InstagramSection } from '../components/sections/InstagramSection';
import { ContactLocationSection } from '../components/sections/ContactLocationSection';
import { Footer } from '../components/sections/Footer';

interface HomePageProps {
  onOpenMenu: () => void;
  onOpenWifi: () => void;
  onOpenReviews: () => void;
  onOpenFeedback: () => void;
  onOpenInstagram: () => void;
  onOpenContact: () => void;
  onOpenLoyalty: () => void;
  onOpenSudoku: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenMenu,
  onOpenWifi,
  onOpenReviews,
  onOpenFeedback,
  onOpenInstagram,
  onOpenContact,
  onOpenLoyalty,
  onOpenSudoku,
}) => {
  return (
    <div className="w-full">
      {/* 1. Mobile Full Viewport Hero */}
      <HeroSection
        onExploreMenu={onOpenMenu}
        onOpenWifi={onOpenWifi}
        onOpenReviews={onOpenReviews}
      />

      {/* 2. Quick Guest Utilities Grid (3D Animated) */}
      <QuickActions
        onOpenMenu={onOpenMenu}
        onOpenReviews={onOpenReviews}
        onOpenFeedback={onOpenFeedback}
        onOpenInstagram={onOpenInstagram}
        onOpenWifi={onOpenWifi}
        onOpenContact={onOpenContact}
        onOpenLoyalty={onOpenLoyalty}
        onOpenSudoku={onOpenSudoku}
      />

      {/* 3. Step Inside The Cave - Visual Editorial */}
      <ExperienceSection />

      {/* 4. Short Cave Storytelling Block */}
      <StorySection />

      {/* 5. Signature Dishes Preview */}
      <MenuPreviewSection onOpenFullMenu={onOpenMenu} />

      {/* 6. Visual Gallery */}
      <GallerySection />

      {/* 7. Google Reviews 5-Star Conversion */}
      <ReviewSection />

      {/* 8. Instagram Showcase */}
      <InstagramSection />

      {/* 9. Contact & Directions */}
      <ContactLocationSection />

      {/* 10. Compact Footer */}
      <Footer
        onOpenMenu={onOpenMenu}
        onOpenReviews={onOpenReviews}
        onOpenFeedback={onOpenFeedback}
        onOpenWifi={onOpenWifi}
        onOpenInstagram={onOpenInstagram}
      />
    </div>
  );
};
