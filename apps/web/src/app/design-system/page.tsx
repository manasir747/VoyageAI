"use client";
import React from "react";
import { TypographySection } from "./sections/TypographySection";
import { ColorPaletteSection } from "./sections/ColorPaletteSection";
import { SpacingSection } from "./sections/SpacingSection";
import { ButtonsSection } from "./sections/ButtonsSection";
import { CardsSection } from "./sections/CardsSection";
import { InputsSection } from "./sections/InputsSection";
import { NavigationSection } from "./sections/NavigationSection";
import { FeedbackSection } from "./sections/FeedbackSection";
import { DataDisplaySection } from "./sections/DataDisplaySection";
import { MotionSection } from "./sections/MotionSection";
import { ThreeSection } from "./sections/ThreeSection";
import { ThemeSection } from "./sections/ThemeSection";
import { FormsSection } from "./sections/FormsSection";
import { AccessibilitySection } from "./sections/AccessibilitySection";

export default function DesignSystemPage() {
  return (
    <div className="flex flex-col gap-24">
      <TypographySection />
      <ColorPaletteSection />
      <SpacingSection />
      <ButtonsSection />
      <CardsSection />
      <InputsSection />
      <NavigationSection />
      <FeedbackSection />
      <DataDisplaySection />
      <MotionSection />
      <ThreeSection />
      <ThemeSection />
      <FormsSection />
      <AccessibilitySection />
    </div>
  );
}
