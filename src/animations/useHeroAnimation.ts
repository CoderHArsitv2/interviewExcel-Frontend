"use client";

import { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HeroAnimationProps {
  containerRef: RefObject<HTMLDivElement | null>;
  badgeRef: RefObject<HTMLDivElement | null>;
  headlineRef: RefObject<HTMLHeadingElement | null>;
  subtextRef: RefObject<HTMLParagraphElement | null>;
  ctaGroupRef: RefObject<HTMLDivElement | null>;
  trustBarRef: RefObject<HTMLDivElement | null>;
  mockupRef: RefObject<HTMLDivElement | null>;
  cardFloat1Ref?: RefObject<HTMLDivElement | null>;
  cardFloat2Ref?: RefObject<HTMLDivElement | null>;
}

export function useHeroAnimation({
  containerRef,
  badgeRef,
  headlineRef,
  subtextRef,
  ctaGroupRef,
  trustBarRef,
  mockupRef,
  cardFloat1Ref,
  cardFloat2Ref,
}: HeroAnimationProps) {
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (badgeRef.current) {
        tl.from(badgeRef.current, {
          y: -25,
          opacity: 0,
          duration: 0.6,
        });
      }

      if (headlineRef.current) {
        tl.from(
          headlineRef.current,
          {
            y: 35,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.3"
        );
      }

      if (subtextRef.current) {
        tl.from(
          subtextRef.current,
          {
            y: 25,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        );
      }

      if (ctaGroupRef.current) {
        tl.from(
          ctaGroupRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3"
        );
      }

      if (trustBarRef.current) {
        tl.from(
          trustBarRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3"
        );
      }

      if (mockupRef.current) {
        tl.from(
          mockupRef.current,
          {
            scale: 0.94,
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "back.out(1.3)",
          },
          "-=0.6"
        );
      }

      const floatingCards = [cardFloat1Ref?.current, cardFloat2Ref?.current].filter(Boolean);
      if (floatingCards.length > 0) {
        tl.from(
          floatingCards,
          {
            scale: 0,
            opacity: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: "back.out(1.5)",
          },
          "-=0.4"
        );
      }

      // Continuous gentle floating animation
      if (cardFloat1Ref?.current) {
        gsap.to(cardFloat1Ref.current, {
          y: "-=10",
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (cardFloat2Ref?.current) {
        gsap.to(cardFloat2Ref.current, {
          y: "+=12",
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.4,
        });
      }
    },
    { scope: containerRef }
  );
}
