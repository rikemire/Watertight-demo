/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseStudy, Testimonial, ProjectCategory } from "./types";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-waterproofing-taylorville",
    title: "The Wet-Season Basement Rescue",
    category: ProjectCategory.STRUCTURAL_WATERPROOFING,
    location: "Taylorville, IL",
    year: "2025",
    challenge: "A historic residential brick home in downtown Taylorville suffered from recurring, severe wet-season flooding. Water pressure cracked the old floor slab, pushing over 2 inches of muddy water into the basement during heavy rains, destroying stored items and causing severe mold outbreaks.",
    solution: "The crew excavated a complete interior perimeter channel. Installed a dual-pump heavy-duty sump basin, wrapped perforated drain tile in synthetic filter fabric, backfilled with clean river stone, and poured an advanced polymer-reinforced concrete slab. Applied highly advanced multi-layer crystalline sealant along all masonry joints.",
    result: "The basement is now 100% bone-dry, under warranty, and ready for luxury finishing. Our testing verified zero moisture ingress even during 3 consecutive days of severe local storms.",
    beforeImage: "/src/assets/images/before_basement_1780652532122.png",
    afterImage: "/src/assets/images/after_basement_1780652546044.png",
    beforeTitle: "FLOODED CELLAR",
    afterTitle: "SEALED & DRY",
    tags: ["Interior Drainage", "Sump Pump", "Crystalline Seal", "Mold Remediation"],
    featured: true
  },
  {
    id: "cs-concrete-foundation-taylor",
    title: "Structural Foundation Reinforcement",
    category: ProjectCategory.CONCRETE_FOUNDATIONS,
    location: "Taylorville, IL",
    year: "2024",
    challenge: "Severe soil sliding on a sloping site caused a 2.5-inch lateral bowing of the main concrete foundation wall. The upper living room floor was sagging, and exterior masonry joints were splitting apart, threatening structural collapse.",
    solution: "Excavated the exterior foundation down to the solid footing. Installed high-capacity structural wall anchors backed by heavy steel exterior plates. Poured robust reinforced horizontal tiebacks and sealed the outer wall with an elastomeric waterproofing membrane before backfilling with structural compaction gravel.",
    result: "Permanently stabilized and leveled the foundation wall, drawing the bowing back into engineering spec tolerance. Structural integrity was backed by a 50-year transferable guarantee.",
    beforeImage: "/src/assets/images/before_foundation_1780652560428.png",
    afterImage: "/src/assets/images/after_foundation_1780652575170.png",
    beforeTitle: "WALL BOWED 2.5\"",
    afterTitle: "ANCHORED SECURE",
    tags: ["Wall Anchors", "Excavation", "Compacted Gravel", "Soil Stabilization"],
    featured: true
  },
  {
    id: "cs-residential-remodel-taylor",
    title: "Luxury Sub-grade Family Den Remodel",
    category: ProjectCategory.RESIDENTIAL_REMODELS,
    location: "Taylorville, IL",
    year: "2025",
    challenge: "An outdated, dark, and damp basement was completely unusable of any living functions. The homeowners wanted a clean, spacious family media room, a full bar, and a guest suite, but were deeply terrified of potential water leaks destroying a major drywall investment.",
    solution: "Tested and guaranteed moisture-barrier integrity. Framed all walls with cold-rolled light-gauge structural steel (immune to wood rot), insulated with moisture-proof closed-cell spray foam, installed sub-floor thermal dry panels, and trimmed out with commercial-grade sound-absorbing ceiling and smart lighting.",
    result: "Transformed a bleak subterranean cellar into a breathtaking 1,200 sq.ft. luxury entertainment suite, fully climate-controlled and built onto a bulletproof waterproof base layer.",
    beforeImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
    afterImage: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800",
    beforeTitle: "MESSY EXCAVATION",
    afterTitle: "LUXURY DEN",
    tags: ["Basement Living", "Steel Framing", "Insulation", "Custom Finish"],
    featured: false
  },
  {
    id: "cs-commercial-buildout-taylor",
    title: "Heavy Equipment Warehouse Footings",
    category: ProjectCategory.COMMERCIAL_BUILDOUTS,
    location: "Taylorville, IL",
    year: "2026",
    challenge: "A local logistics company required high-strength concrete foundation work to support custom heavy-payload forklifts and industrial shelving. Standard industrial warehouse slabbing would fracture under the extreme local point-loads.",
    solution: "Engineered a dense double-curtain Grade 60 rebar layout on an 8-inch crushed stone subbase. Poured a specialized 8,000 PSI high-early-strength concrete concrete footing with modern synthetic fiber additives and a hardener sealer finish.",
    result: "Created a dust-free super-flat slab tailored to host heavy industrial warehousing payloads with zero cracking or lateral stress marks recorded under heavy equipment tests.",
    beforeImage: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800",
    afterImage: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&q=80&w=800",
    beforeTitle: "RAW CONCRETE",
    afterTitle: "INDUSTRIAL SLAB",
    tags: ["High-PSI Concrete", "Rebar Curtains", "Industrial Slab", "Fiber Additives"],
    featured: false
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "testi-1",
    clientName: "David Henderson",
    location: "Taylorville, IL",
    projectType: "Structural Waterproofing",
    rating: 5,
    content: "Watertight lives up to the reputation! We had water pooling in our cellar every spring. Their crew came out, explained the entire process, dug out the interior trench, and replaced our old sump. We had record rainfall last week and the cellar remained dusty and bone-dry. Professional crew and impeccable clean up!",
    date: "April 2026",
    projectImage: "/src/assets/images/after_basement_1780652546044.png"
  },
  {
    id: "testi-2",
    clientName: "Sarah & Mike Miller",
    location: "Taylorville, IL",
    projectType: "Foundation Repair",
    rating: 5,
    content: "We were selling our home but the home inspection flagged a bowing foundation. Watertight came to the rescue. They installed heavy steel wall anchors and stabilized everything with a fully transferable warranty that saved our home sale. The buyers were ecstatic with the paperwork. Absolute lifesavers!",
    date: "October 2024",
    projectImage: "/src/assets/images/after_foundation_1780652575170.png"
  },
  {
    id: "testi-3",
    clientName: "Robert Vance",
    location: "Taylorville, IL",
    projectType: "Basement Remodel",
    rating: 5,
    content: "Unbelievable transformation. I still can't believe this is the same basement I used to dread walking down to. Prompt, on budget, and incredibly tidy. Highly recommend for any major concrete or remodel project.",
    date: "February 2025",
    projectImage: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800"
  }
];

export const INDUSTRY_BADGES = [
  {
    title: "IL License #",
    value: "055-198302",
    description: "Fully licensed by the state of Illinois"
  },
  {
    title: "Bonded Protection",
    value: "$1,500,000",
    description: "Full performance and indemnity bonding"
  },
  {
    title: "General Liability",
    value: "$2,000,000",
    description: "Comprehensive active liability coverage"
  },
  {
    title: "Workman's Comp",
    value: "Verified Active",
    description: "100% crew safety coverage and protection"
  }
];

export const WARRANTY_INFOS = [
  {
    term: "Lifetime",
    title: "Structural Waterproofing",
    description: "We guarantee zero sub-grade water intrusion for the life of the structure. Fully transferable to the next homeowner if you sell.",
    icon: "shield"
  },
  {
    term: "50 Years",
    title: "Wall Stabilizers & Anchors",
    description: "Our engineered piering systems and heavy wall wall anchors are protected against lateral movement or deflection.",
    icon: "award"
  },
  {
    term: "10 Years",
    title: "Concrete Floor Slabs",
    description: "Covers material fracturing, high-stress cracking, or subbase hollows. Follows strict high-PSI rebar curing protocols.",
    icon: "drill"
  },
  {
    term: "5 Years",
    title: "Sump Pump Systems",
    description: "Provides full parts & labor replacement protection on dual Pro-Series dual pumping configurations.",
    icon: "refresh-cw"
  }
];
