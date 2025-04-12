"use client";
import React from "react";
import featuresData from "./featuresData";
import SingleFeature from "./SingleFeature";
import SectionHeader from "../common/SectionHeader";

const Feature = () => {
  return (
    <>
      {/* ===== Features Start ===== */}
      <section id="features" className="py-16 md:py-20 lg:py-24 xl:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12 xl:px-16">
          {/* Section Title */}
          <SectionHeader
            headerInfo={{
              title: "Coachem Features",
              subtitle: "Core Features of Coachem",
              description: `Discover the advanced tools that revolutionize your coaching management. With Coachem, organizing lessons, communicating with students, and tracking progress becomes simple and intuitive, allowing you to focus on what you love: teaching sports.`,
            }}
          />

          {/* Features Grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:mt-16 xl:gap-12">
            {featuresData.map((feature, key) => (
              <SingleFeature feature={feature} key={key} />
            ))}
          </div>
        </div>
      </section>
      {/* ===== Features End ===== */}
    </>
  );
};

export default Feature;