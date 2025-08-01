// src/components/FeaturesSection.tsx

import React from 'react';
import {
  FaUpload,
  FaBrain,
  FaFileAlt,
  FaRegLightbulb,
  FaFileContract,
  FaMagic,
 // Import IconType for the icon prop
} from 'react-icons/fa';

// 1. Define interface for FeatureCard props
interface FeatureCardProps {
  icon: any; // IconType is the type for react-icons components
  title: string;
  description: string;
}

// 2. Define FeatureCard as a React functional component with its props type
const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div
      id='features'
      className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800
                 flex flex-col items-center text-center
                 transform transition-all duration-500 ease-in-out
                 hover:scale-105 hover:shadow-2xl hover:border-purple-600"
    >
      {/* group class is implicitly used by the group-hover:rotate-6 on the icon div */}
      <div className="text-purple-500 text-5xl mb-6 transform transition-transform duration-500 ease-in-out group-hover:rotate-6">
        <Icon /> {/* IconType allows rendering directly */}
      </div>
      <h3 className="text-white text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
    </div>
  );
};

// 3. Define interface for a single feature object in the features array
interface Feature {
  icon: any;
  title: string;
  description: string;
}

// 4. Define FeaturesSection as a React functional component
const FeaturesSection: React.FC = () => {
  const features: Feature[] = [ // Explicitly type the features array
    {
      icon: FaUpload,
      title: "Effortless Profile Upload",
      description: "Seamlessly upload your organization's profile in PDF, Markdown, or Word formats. Our system intelligently processes your existing documents.",
    },
    {
      icon: FaBrain,
      title: "Search and Get Best Grants",
      description: "Our AI Agent Searches grants from best webites and ranks according to your description so you can the best grants available.",
    },
    {
      icon: FaFileAlt,
      title: "Intuitive Project Details",
      description: "Provide current project specifics through a guided, user-friendly form, ensuring all critical information is captured accurately.",
    },
    {
      icon: FaRegLightbulb,
      title: "Intelligent Content Generation",
      description: "The AI combines your summarized profile with project details to generate tailored grant content, from compelling cover letters to concise executive summaries.",
    },
    {
      icon: FaFileContract,
      title: "Variety of Template Options",
      description: "Get variety of templates like modern, luxury, elegant and many more according to your fit for the succesfull grant proposal.",
    },
    {
      icon: FaMagic,
      title: "Streamlined Workflow",
      description: "Reduce manual effort and accelerate your grant writing process, allowing you to focus on your mission, not paperwork.",
    },
  ];

  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 animate-fade-in-up">
          Unlock Your Grant Potential
        </h2>
        <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto animate-fade-in-up delay-200">
          Our AI-powered assistant streamlines the entire grant writing process, helping non-profit organizations secure the funding they deserve.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="group animate-fade-in-up" style={{ animationDelay: `${200 * (index + 3)}ms` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;