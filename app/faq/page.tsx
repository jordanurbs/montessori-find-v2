'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { additionalSections } from './sections';
import { finalSections } from './more-sections';

// Types
interface QuestionAnswer {
  q: string;
  a: React.ReactNode;
}

interface Section {
  title: string;
  id: string;
  questions: QuestionAnswer[];
}

// This file cannot export metadata with 'use client' directive
// Metadata must be in a separate layout.tsx file
 
export default function FAQPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());
  
  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const toggleQuestion = (questionId: string) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const initialSections: Section[] = [
    {
      title: "About Maria Montessori",
      id: "about-maria",
      questions: [
        {
          q: "Who was Maria Montessori?",
          a: "Maria Montessori (1870-1952) was an Italian physician and educator who developed the Montessori method of education. She was the first woman to graduate from the University of Rome Medical School and later became interested in education while working with children with special needs."
        },
        {
          q: "What are the key principles of Montessori education?",
          a: "The key principles include: 1) Respect for the child's natural development, 2) Prepared environment, 3) Self-directed learning, 4) Mixed-age classrooms, 5) Uninterrupted work periods, and 6) Teacher as guide rather than instructor."
        }
      ]
    },
    {
      title: "Common Misconceptions",
      id: "misconceptions",
      questions: [
        {
          q: "Is Montessori only for gifted or privileged children?",
          a: "No, Montessori education was originally developed for children from low-income families in Rome and is designed to benefit all children regardless of ability, socioeconomic status, or background. While private Montessori schools may be expensive in some areas, public Montessori options are increasingly available. The method adapts to each child's individual needs and pace, making it suitable for diverse learners across the ability spectrum."
        },
        {
          q: "Is Montessori too unstructured?",
          a: "Contrary to this common misconception, Montessori classrooms are highly structured environments with clear expectations and procedures. The structure lies in the carefully prepared environment, sequenced materials, and consistent ground rules rather than in rigid schedules or whole-group instruction. Children have freedom within clear boundaries, and the structure is designed to develop internal discipline rather than relying on external control."
        },
        {
          q: "Do Montessori children just play all day?",
          a: "Montessori education doesn't distinguish between 'work' and 'play' in the way traditional education often does. Children in Montessori classrooms engage in purposeful activities that develop skills and knowledge—activities they often find deeply enjoyable and satisfying. While it may look like play to outsiders, children are systematically building academic, social, and practical skills through their self-chosen work with materials designed for specific learning outcomes."
        },
        {
          q: "Is Montessori anti-fantasy or anti-creativity?",
          a: "Montessori education is not against fantasy or creativity, but it distinguishes between fantasy emerging from the child's own imagination and fantasy imposed by adults. Montessori education builds a foundation of reality-based experiences from which children's natural creativity can flourish. Art, music, storytelling, and creative expression are valued parts of Montessori education. The approach encourages children to develop their own creative thinking rather than consuming pre-packaged fantasy characters and narratives."
        },
        {
          q: "Are Montessori schools religious?",
          a: "Most Montessori schools are secular, though some are affiliated with religious organizations. Dr. Montessori's method itself is not religious but focuses on universal human development. Her approach to cosmic education does include spiritual development in a broad, non-denominational sense, emphasizing humanity's place in the universe and connection to all living things. Parents seeking either secular or religious education can typically find Montessori schools that align with their preferences."
        },
        {
          q: "Is Montessori only for preschoolers?",
          a: "No, although Montessori is perhaps best known for early childhood education (3-6 years), the method was designed for children from birth through adulthood. Montessori programs exist for all age groups: infant/toddler (birth to 3), Children's House/Primary (3-6), Elementary (6-12), Adolescent/Secondary (12-18), and even some university programs. Each level builds on the previous one with developmentally appropriate materials and approaches designed for the specific needs and characteristics of each plane of development."
        }
      ]
    },
    {
      title: "Long-term Benefits of Montessori Education",
      id: "benefits",
      questions: [
        {
          q: "What are the long-term benefits of Montessori education?",
          a: <div>
            <p className="mb-4">Research indicates several long-term benefits of Montessori education, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Stronger executive function skills (planning, organization, self-regulation)</li>
              <li>Greater social cognition and positive social interactions</li>
              <li>Higher levels of intrinsic motivation and love of learning</li>
              <li>Better academic outcomes, particularly in reading and mathematics</li>
              <li>More developed creative thinking and problem-solving abilities</li>
              <li>Greater sense of social justice and community responsibility</li>
              <li>Better ability to adapt to new environments and challenges</li>
              <li>Stronger sense of self and confidence in abilities</li>
              <li>More sophisticated critical thinking skills</li>
              <li>Higher likelihood of completing higher education</li>
            </ul>
          </div>
        },
        {
          q: "Are there studies supporting Montessori's effectiveness?",
          a: "Yes, a growing body of research supports the effectiveness of Montessori education. Studies by researchers such as Angeline Lillard have shown Montessori students demonstrate stronger academic outcomes, better social skills, and more developed executive functions compared to peers in conventional education. Follow-up studies of Montessori graduates indicate long-term benefits including higher college graduation rates and greater well-being measures. The most significant results are associated with programs that implement Montessori principles with high fidelity over extended periods."
        },
        {
          q: "How does Montessori prepare children for the real world?",
          a: <div>
            <p className="mb-4">Montessori education prepares children for the real world by developing:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Independence and self-reliance through practical life skills</li>
              <li>Initiative and intrinsic motivation that drive lifelong learning</li>
              <li>Adaptability and problem-solving through open-ended challenges</li>
              <li>Strong communication skills through mixed-age interactions</li>
              <li>Time management and personal responsibility</li>
              <li>Collaboration abilities balanced with individual accountability</li>
              <li>Critical thinking rather than rote memorization</li>
              <li>Global perspective and cultural awareness</li>
              <li>Entrepreneurial thinking and innovation</li>
              <li>Resilience and perseverance through meaningful work</li>
            </ul>
            <p className="mt-4">These skills align well with what employers and higher education institutions increasingly value in the 21st century: creativity, collaboration, critical thinking, and communication.</p>
          </div>
        },
        {
          q: "What careers do Montessori graduates typically pursue?",
          a: "Montessori graduates pursue diverse careers across all fields. While no comprehensive studies track all Montessori graduates' career choices, anecdotally, many pursue creative, entrepreneurial, and innovative paths. Notable Montessori alumni include founders of Google, Amazon, and Wikipedia; writers, actors, and musicians; scientists and researchers; social entrepreneurs; and leaders in various fields. The Montessori emphasis on intrinsic motivation, creativity, and self-direction may contribute to graduates seeking meaningful work aligned with their personal values and interests rather than following conventional career paths."
        },
        {
          q: "How can parents support Montessori principles as children grow older?",
          a: <div>
            <p className="mb-4">Parents can support Montessori principles as children grow by:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Continuing to respect children's independence and decision-making abilities</li>
              <li>Involving children in household responsibilities and community service</li>
              <li>Supporting intrinsic motivation by limiting external rewards</li>
              <li>Encouraging deep exploration of interests rather than surface-level exposure</li>
              <li>Providing access to diverse resources for self-directed learning</li>
              <li>Modeling lifelong learning and curiosity</li>
              <li>Maintaining order and beauty in the home environment</li>
              <li>Emphasizing process over product in learning experiences</li>
              <li>Supporting hands-on, experiential learning opportunities</li>
              <li>Respecting concentration and avoiding unnecessary interruptions</li>
              <li>Continuing to offer appropriate freedom within clear boundaries</li>
            </ul>
          </div>
        }
      ]
    }
  ];

  // Combine all sections
  const allSections = [...initialSections, ...additionalSections, ...finalSections];

  return (
    <>
      {/* Hero Section - Full Width */}
      <div className="relative w-full h-[300px] mb-12">
        <Image 
          src="/assets/graphics/backgrounds/pexels-karolina-grabowska-7296766.jpg" 
          alt="Montessori classroom materials" 
          fill 
          className="object-cover brightness-[0.85]"
          priority
        />
        {/* Semi-transparent white overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-70"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Find answers to common questions about Montessori education and our platform.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allSections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-emerald-600 hover:text-emerald-700"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(section.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    toggleSection(section.id);
                  }
                }}
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {allSections.map(section => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <h2 className="text-2xl font-bold text-emerald-900">{section.title}</h2>
                {openSections.has(section.id) ? (
                  <ChevronUp className="h-5 w-5 text-emerald-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-emerald-600" />
                )}
              </button>

              {openSections.has(section.id) && (
                <div className="p-6 space-y-4">
                  {section.questions.map((qa, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <button
                        onClick={() => toggleQuestion(`${section.id}-${index}`)}
                        className="w-full text-left flex items-center justify-between py-2"
                      >
                        <h3 className="text-lg font-bold text-emerald-800">{qa.q}</h3>
                        {openQuestions.has(`${section.id}-${index}`) ? (
                          <ChevronUp className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        )}
                      </button>
                      
                      {openQuestions.has(`${section.id}-${index}`) && (
                        <div className="mt-2 text-gray-600 prose max-w-none text-base font-normal">
                          {qa.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SEO-Optimized CTA Section */}
        <div className="mt-16 bg-emerald-50 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Find Montessori Schools Near Me
          </h2>
          <p className="text-gray-600 mb-6 text-center max-w-3xl mx-auto">
            Now that you understand the benefits of Montessori education, take the next step in your child's educational journey. MontessoriFind helps you discover and compare nearby Montessori schools with verified information and authentic parent reviews.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/schools">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Search Montessori Schools
              </Button>
            </Link>
            <Link href="/states">
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Browse Schools by State
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 