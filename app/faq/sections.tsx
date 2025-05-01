import React from 'react';

// Types
export interface QuestionAnswer {
  q: string;
  a: React.ReactNode;
}

export interface Section {
  title: string;
  id: string;
  questions: QuestionAnswer[];
}

// The first three sections are in the main page component
// Additional sections are defined here
export const additionalSections: Section[] = [
  {
    title: "Montessori for Children with Special Needs",
    id: "special-needs",
    questions: [
      {
        q: "What if my child needs special accommodations?",
        a: <div>
          <p className="mb-4">Montessori schools often make reasonable accommodations while maintaining their educational philosophy. These might include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modified presentations of materials</li>
            <li>Additional adult support or lower student-teacher ratios</li>
            <li>Collaboration with therapists and specialists</li>
            <li>Environmental adaptations (seating, noise reduction, visual supports)</li>
            <li>Assistive technology when appropriate</li>
            <li>Individualized education plans integrated with Montessori curriculum</li>
            <li>Additional structure or visual schedules if needed</li>
          </ul>
          <p className="mt-4">The best approach is a partnership between parents, teachers, and specialists to create consistent strategies across home and school environments.</p>
        </div>
      },
      {
        q: "Is Montessori appropriate for children with special needs?",
        a: <div>
          <p className="mb-4">Yes, Montessori education can be particularly beneficial for many children with special needs due to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Individualized pacing and curriculum</li>
            <li>Hands-on, multi-sensory learning approach</li>
            <li>Freedom of movement within the environment</li>
            <li>Focus on independence and self-regulation</li>
            <li>Consistent, orderly environments with clear expectations</li>
            <li>Natural supports through mixed-age grouping</li>
            <li>Concrete materials progressing to abstract concepts</li>
            <li>Minimal overstimulation in a prepared environment</li>
            <li>Emphasis on developing executive function skills</li>
          </ul>
          <p className="mt-4">Dr. Montessori actually began her work with children who had various disabilities, developing her methods through observing their learning needs. Today, many children with ADHD, autism spectrum disorders, dyslexia, and other learning differences thrive in Montessori settings with appropriate support.</p>
        </div>
      },
      {
        q: "How does Montessori accommodate different learning styles?",
        a: <div>
          <p className="mb-4">Montessori naturally accommodates diverse learning styles through:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Visual learners</strong>: Clear demonstrations, visual materials, and organized environments</li>
            <li><strong>Auditory learners</strong>: Sound-based language materials, precise vocabulary, and small group discussions</li>
            <li><strong>Kinesthetic learners</strong>: Hands-on materials, freedom of movement, and embodied learning</li>
            <li><strong>Tactile learners</strong>: Manipulatives for all concepts and sensorial exploration</li>
          </ul>
          <p className="mt-4">The method's emphasis on multiple pathways to understanding concepts means children can approach learning in ways that make sense to them. Materials often incorporate multiple senses simultaneously (visual, tactile, kinesthetic), allowing children to use their preferred learning modalities while developing others.</p>
        </div>
      },
      {
        q: "Can Montessori help children with attention issues?",
        a: <div>
          <p className="mb-4">Montessori environments often benefit children with attention issues through:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Freedom to move rather than being required to sit still</li>
            <li>Ability to choose activities that capture interest</li>
            <li>Hands-on learning that engages multiple senses</li>
            <li>Activities that naturally develop concentration and focus</li>
            <li>Clear beginnings and endings to activities</li>
            <li>Visual organization and predictable routines</li>
            <li>Fewer distractions in a carefully prepared environment</li>
            <li>Opportunities to develop self-regulation through practical activities</li>
            <li>Individual pacing without time pressure</li>
            <li>Grace and courtesy lessons that teach appropriate social skills</li>
          </ul>
          <p className="mt-4">Many children who struggle in traditional settings find they can focus better in Montessori environments where their need for movement and engagement is respected.</p>
        </div>
      },
      {
        q: "Do Montessori schools accept children with disabilities?",
        a: <div>
          <p className="mb-4">Policies vary by school, but many Montessori schools welcome children with disabilities and learning differences. Factors affecting inclusion include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The specific needs of the child and available support resources</li>
            <li>The school's experience and teacher training in special education</li>
            <li>The physical accessibility of the environment</li>
            <li>The school's philosophy regarding inclusion</li>
            <li>Required staff-to-student ratios for proper support</li>
          </ul>
          <p className="mt-4">Parents should discuss their child's specific needs during the admissions process. Some Montessori schools specialize in serving children with particular disabilities, while others offer inclusive environments where children with various abilities learn together.</p>
        </div>
      }
    ]
  },
  {
    title: "Finding the Right Montessori School",
    id: "finding-school",
    questions: [
      {
        q: "Are all Montessori schools accredited or certified?",
        a: <div>
          <p className="mb-4">No, the name "Montessori" is not trademarked, so any school can use it regardless of their adherence to authentic Montessori principles. Schools may have varying levels of authenticity and accreditation:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Accredited by AMI (Association Montessori Internationale)</strong>: Adheres closely to Dr. Montessori's original methods</li>
            <li><strong>Accredited by AMS (American Montessori Society)</strong>: Follows core Montessori principles with some adaptations</li>
            <li><strong>Other Montessori organizations</strong>: Various regional or national Montessori organizations offer their own accreditation</li>
            <li><strong>Self-identified Montessori</strong>: May incorporate some Montessori elements without formal accreditation</li>
            <li><strong>Montessori-inspired</strong>: Acknowledges influence without claiming full implementation</li>
          </ul>
          <p className="mt-4">Accreditation indicates that the school meets certain standards but doesn't guarantee quality. Personal visits and observation are essential in evaluating any school.</p>
        </div>
      },
      {
        q: "What should I look for when visiting a Montessori school?",
        a: <div>
          <p className="mb-4">When visiting a potential Montessori school, look for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Mixed-age classrooms with 3-year age groupings</li>
            <li>Uninterrupted work periods of at least 2-3 hours</li>
            <li>Complete sets of authentic Montessori materials in good condition</li>
            <li>Children choosing their own work independently</li>
            <li>Teachers giving individual or small group lessons</li>
            <li>Children working at tables or on floor mats</li>
            <li>A calm, orderly atmosphere with engaged children</li>
            <li>Evidence of all curriculum areas (practical life, sensorial, language, math, cultural)</li>
            <li>Children helping themselves and each other</li>
            <li>Respectful interactions between adults and children</li>
            <li>Clear ground rules consistently applied</li>
            <li>Beautiful, orderly, child-sized environments</li>
            <li>Teachers with recognized Montessori training</li>
            <li>Policies aligned with Montessori philosophy (minimal homework, no external rewards)</li>
          </ul>
        </div>
      },
      {
        q: "How much does Montessori education cost?",
        a: <div>
          <p className="mb-4">Montessori education costs vary widely depending on:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Location</strong>: Urban schools typically cost more than rural ones</li>
            <li><strong>Age level</strong>: Infant/toddler programs often cost more due to lower teacher-student ratios</li>
            <li><strong>School type</strong>: Private, public charter, or public magnet options</li>
            <li><strong>Non-profit vs. for-profit status</strong>: Non-profit schools may offer lower tuition</li>
            <li><strong>Accreditation</strong>: Fully accredited schools with AMI/AMS-trained teachers may charge more</li>
          </ul>
          <p className="mt-4">Private Montessori schools generally range from $5,000 to $20,000+ annually depending on these factors. Public Montessori options (charter schools, magnet programs) provide free or low-cost alternatives where available, though these may have waiting lists or admission lotteries.</p>
        </div>
      },
      {
        q: "Are there public Montessori schools?",
        a: <div>
          <p className="mb-4">Yes, public Montessori options have been growing since the 1970s. These include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Public Montessori magnet schools</strong>: Specialized programs within public school districts</li>
            <li><strong>Public Montessori charter schools</strong>: Publicly funded but independently operated</li>
            <li><strong>Montessori programs within conventional public schools</strong>: Individual classrooms using Montessori methods</li>
          </ul>
          <p className="mt-4">There are over 500 public Montessori programs in the United States. These schools typically follow Montessori principles while meeting state educational requirements, though they may make some adaptations to accommodate mandatory testing or curriculum requirements. Access varies greatly by location, and many have waiting lists or admission lotteries.</p>
        </div>
      },
      {
        q: "What questions should I ask when interviewing a Montessori school?",
        a: <div>
          <p className="mb-4">Important questions to ask include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>What training do your teachers have? Is it from AMI, AMS, or another organization?</li>
            <li>How long are your uninterrupted work periods?</li>
            <li>How do you handle discipline and conflict resolution?</li>
            <li>How do you assess student progress and report to parents?</li>
            <li>What is your policy on homework, testing, and grades?</li>
            <li>How do you accommodate different learning styles and needs?</li>
            <li>What is your teacher turnover rate?</li>
            <li>How do you involve parents in the school community?</li>
            <li>What happens when children finish your program? Where do they typically go next?</li>
            <li>How closely does your school adhere to traditional Montessori principles?</li>
            <li>What adaptations, if any, have you made to the Montessori method?</li>
            <li>How much outdoor time do children have each day?</li>
            <li>What is your screen/technology policy?</li>
            <li>How do you support transitions into and out of your program?</li>
          </ul>
        </div>
      }
    ]
  },
  {
    title: "Implementing Montessori at Home",
    id: "montessori-at-home",
    questions: [
      {
        q: "How can I incorporate Montessori principles at home?",
        a: <div>
          <p className="mb-4">You can implement Montessori at home by:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Creating child-accessible spaces with low shelves, hooks, and tools</li>
            <li>Organizing toys and materials on shelves rather than in bins</li>
            <li>Providing child-sized furniture and tools that work properly</li>
            <li>Rotating materials to maintain interest and reduce clutter</li>
            <li>Setting up "yes spaces" where children can explore safely</li>
            <li>Involving children in household tasks like cooking, cleaning, and laundry</li>
            <li>Slowing down to allow children to do things themselves</li>
            <li>Using natural materials and limiting plastic toys</li>
            <li>Creating order and predictable routines</li>
            <li>Respecting concentration by not interrupting focused activity</li>
            <li>Offering limited, meaningful choices throughout the day</li>
            <li>Modeling grace and courtesy in daily interactions</li>
          </ul>
        </div>
      },
      {
        q: "What are some simple Montessori activities for toddlers?",
        a: <div>
          <p className="mb-4">Simple Montessori-inspired activities for toddlers include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pouring activities (dry beans, rice, water)</li>
            <li>Practical life skills (dressing frames, food preparation, cleaning)</li>
            <li>Nature collections and sensory exploration</li>
            <li>Matching and sorting activities (colors, shapes, objects)</li>
            <li>Simple puzzles with knobs</li>
            <li>Language baskets with small objects to name</li>
            <li>Art activities with one medium at a time</li>
            <li>Music with quality instruments rather than electronic toys</li>
            <li>Gross motor challenges like climbing, balancing, and carrying</li>
            <li>Fine motor practice like threading, pincer grasp activities, and opening/closing</li>
          </ul>
        </div>
      },
      {
        q: "How do I set up a Montessori-friendly bedroom?",
        a: <div>
          <p className="mb-4">A Montessori-friendly bedroom typically includes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>A floor bed or low bed the child can get in and out of independently</li>
            <li>A low wardrobe or accessible drawers for clothing</li>
            <li>A small table and chair for activities</li>
            <li>A reading corner with books displayed facing outward</li>
            <li>Simple, beautiful decorations at the child's eye level</li>
            <li>Natural materials and calming colors</li>
            <li>Limited toys and materials, rotated regularly</li>
            <li>A mirror mounted securely at child height</li>
            <li>Child-accessible personal care items</li>
            <li>Good organization with a place for everything</li>
          </ul>
        </div>
      },
      {
        q: "Can Montessori principles work alongside other parenting approaches?",
        a: <div>
          <p className="mb-4">Yes, Montessori principles can complement many parenting approaches, particularly those that emphasize:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Respect for the child</li>
            <li>Positive discipline</li>
            <li>Child development knowledge</li>
            <li>Nurturing independence</li>
            <li>Creating order and predictability</li>
            <li>Supporting intrinsic motivation</li>
          </ul>
          <p className="mt-4">Montessori principles blend well with aspects of RIE (Resources for Infant Educarers), positive discipline, attachment parenting, and other respectful parenting approaches. The key is identifying shared values like respect, independence, and supporting the child's natural development.</p>
        </div>
      },
      {
        q: "How much does it cost to implement Montessori at home?",
        a: <div>
          <p className="mb-4">Implementing Montessori at home doesn't have to be expensive. While official Montessori materials can be costly, many principles can be applied with minimal investment:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Rearranging furniture for accessibility (free)</li>
            <li>Using household items for practical life activities (minimal cost)</li>
            <li>Making DIY versions of materials (variable cost)</li>
            <li>Finding secondhand wooden toys and natural materials (moderate cost)</li>
            <li>Investing in a few quality items rather than many plastic toys (initial investment but longer-lasting)</li>
          </ul>
          <p className="mt-4">Focus on the principles (independence, order, beauty, purpose) rather than buying specific branded items. Many Montessori-aligned items can be found at regular stores or made from materials you already have.</p>
        </div>
      }
    ]
  },
  {
    title: "History of the Montessori Method",
    id: "history",
    questions: [
      {
        q: "When and where did the Montessori method begin?",
        a: "The Montessori method officially began on January 6, 1907, when Maria Montessori opened the first Casa dei Bambini (Children's House) in the San Lorenzo district of Rome, Italy. This school served children from low-income families and became the testing ground for her revolutionary educational approach."
      },
      {
        q: "How did the Montessori method spread globally?",
        a: "The method gained international attention quickly. By 1909, Dr. Montessori began giving training courses to educators. The first Montessori school in the United States opened in 1911 in Tarrytown, New York. Alexander Graham Bell and his wife were early advocates who established the Montessori Educational Association in the U.S. Despite some periods of declining interest (particularly during the World Wars), the method experienced a significant resurgence in the 1960s and continues to grow worldwide today."
      },
      {
        q: "How did Montessori education evolve over time?",
        a: "Dr. Montessori continued refining her methods throughout her life, developing materials and approaches for children from birth through adolescence. While maintaining her core principles, she expanded the curriculum to include \"cosmic education\" and peace education. After her death in 1952, her son Mario Montessori continued her work, and various Montessori organizations formed to preserve and extend her educational philosophy."
      },
      {
        q: "Are all Montessori schools the same?",
        a: "No, Montessori schools vary considerably because the name \"Montessori\" is not trademarked or protected. Some schools follow authentic Montessori principles with AMI (Association Montessori Internationale) or AMS (American Montessori Society) certified teachers and complete sets of materials, while others may incorporate only some aspects of the method. This variation is why parents are encouraged to visit and research schools thoroughly."
      }
    ]
  },
  {
    title: "Core Montessori Principles",
    id: "core-principles",
    questions: [
      {
        q: "What are the fundamental principles of Montessori education?",
        a: <div>
          <p className="mb-4">The core Montessori principles include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Respect for the child and their natural development</li>
            <li>The absorbent mind (children's unique ability to effortlessly absorb their environment)</li>
            <li>Sensitive periods (optimal windows for learning specific skills)</li>
            <li>Freedom within limits</li>
            <li>Mixed-age classrooms</li>
            <li>Self-directed learning</li>
            <li>Prepared environments</li>
            <li>Specialized educational materials</li>
            <li>Trained teachers who observe and guide rather than direct</li>
            <li>The development of the whole child—physical, social, emotional, and cognitive</li>
          </ul>
        </div>
      },
      {
        q: "What is meant by 'follow the child' in Montessori?",
        a: "'Follow the child' means observing and responding to each child's unique interests, abilities, and developmental timeline rather than imposing a standardized curriculum. Teachers observe what captures each child's attention and readiness for new challenges, then introduce materials and concepts accordingly. This approach respects children as individuals with their own learning paths."
      },
      {
        q: "What does 'freedom within limits' mean in Montessori education?",
        a: "'Freedom within limits' refers to the balance between providing children with choices and independence while maintaining clear boundaries and expectations. Children are free to choose activities, work at their own pace, and move around the classroom, but within a structured environment with established ground rules for respectful behavior toward others and materials."
      },
      {
        q: "What is the 'absorbent mind' concept?",
        a: "The absorbent mind refers to Dr. Montessori's observation that children from birth to approximately age six possess an extraordinary ability to absorb information and experiences from their environment effortlessly and unconsciously. Unlike adults who learn through conscious effort, young children absorb language, culture, and sensory impressions directly into their developing minds, forming the foundation of their intelligence and personality."
      },
      {
        q: "What are 'sensitive periods' in Montessori philosophy?",
        a: "Sensitive periods are specific timeframes when children are naturally drawn to acquiring particular skills or knowledge. During these windows, learning occurs more easily and joyfully. Examples include sensitive periods for language (0-6 years), order (2-4 years), refinement of senses (2-6 years), writing (3.5-4.5 years), and reading (4.5-5.5 years). Montessori education aims to identify and support these periods with appropriate materials and activities."
      },
      {
        q: "How does Montessori view child development?",
        a: "Montessori views child development as occurring in four distinct planes from birth to adulthood (0-6, 6-12, 12-18, and 18-24 years), each with unique characteristics and developmental needs. Dr. Montessori believed that children construct themselves through meaningful interactions with their environment, build independence through purposeful work, and develop at their own pace according to their internal developmental timetable."
      },
      {
        q: "What is the Montessori view on discipline?",
        a: "Montessori discipline is based on developing self-discipline rather than imposing external control. The approach focuses on clear, consistent boundaries; natural and logical consequences; positive redirection; grace and courtesy lessons; and helping children develop internal motivation and respect for others. The goal is to guide children toward making appropriate choices independently rather than controlling their behavior through rewards and punishments."
      }
    ]
  }
];

// More sections to be continued in another file due to size limitations 