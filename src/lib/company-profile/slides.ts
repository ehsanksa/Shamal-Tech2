export type CompanyProfileHighlight = {
  label: string
  value: string
}

export type CompanyProfileItem = {
  title: string
  body: string
}

export type CompanyProfileServiceIcon =
  | 'inspection'
  | 'cad-bim'
  | 'agriculture'
  | 'construction'
  | 'environmental'
  | 'ai'
  | 'bathymetric'
  | 'mining'
  | 'special'
  | 'aerial'
  | 'security'
  | 'gis'
  | 'oil-gas'
  | 'traffic'

export type CompanyProfileServiceItem = {
  label: string
  icon: CompanyProfileServiceIcon
}

export type CompanyProfileStaff = {
  name: string
  role: string
  photo?: string
}

/** Hierarchical org chart (Key Staff slide). */
export type CompanyProfileOrgChart = {
  executives: [CompanyProfileStaff, CompanyProfileStaff]
  deputy: CompanyProfileStaff
  departmentHead: CompanyProfileStaff
  managers: [CompanyProfileStaff, CompanyProfileStaff, CompanyProfileStaff]
}

export type CompanyProfileContactPerson = {
  name: string
  role: string
  email: string
}

/** PDF-style case study: service intro + project narrative */
export type CompanyProfileCaseStudy = {
  title: string
  intro?: string
  narrative: string
}

export type CompanyProfileSlide =
  | {
      id: string
      kind: 'cover'
      title: string
      subtitle: string
      tagline: string
      address: string
    }
  | {
      id: string
      kind: 'content'
      section: string
      title: string
      lead?: string
      bullets?: string[]
      highlights?: CompanyProfileHighlight[]
      tags?: string[]
      services?: CompanyProfileServiceItem[]
      items?: CompanyProfileItem[]
      staff?: CompanyProfileStaff[]
      orgChart?: CompanyProfileOrgChart
      caseStudies?: CompanyProfileCaseStudy[]
      showCertLogos?: boolean
      showPartnerLogos?: boolean
    }
  | {
      id: string
      kind: 'clients'
      section: string
      title: string
      lead?: string
    }
  | {
      id: string
      kind: 'contact'
      section: string
      title: string
      lead?: string
      contacts: CompanyProfileContactPerson[]
      website: string
    }

export const COMPANY_PROFILE_SLIDES: CompanyProfileSlide[] = [
  {
    id: 'cover',
    kind: 'cover',
    title: 'Shamal Technologies',
    subtitle: 'Saudi Geospatial Data Company',
    tagline:
      'We provide end-to-end solutions from data acquisition to data visualization and analytics using world-leading technology to empower leaders to make data-informed decisions and reduce operational costs.',
    address:
      'Office No: 1109, 11th Floor, The Headquarters Business Park, Jeddah 23511, Kingdom of Saudi Arabia',
  },
  {
    id: 'who-we-are',
    kind: 'content',
    section: '01',
    title: 'Who We Are',
    lead:
      'Shamal Technologies is a leading provider of smart data solutions in the Kingdom of Saudi Arabia. As a fully Saudi-owned and funded company, we proudly support Vision 2030 by investing in local talent, with over 93% Saudi workforce undergoing continuous development.',
    bullets: [
      'Our advanced solutions cover ground, aerial, and marine data acquisition, offering clients high-precision datasets, complete visibility, and a deeper understanding of their environment.',
      'We operate across industries using market-leading drone systems and cutting-edge data processing methodologies to ensure best-in-class services and deliverables.',
    ],
    showPartnerLogos: true,
    tags: ['Jeddah', 'Riyadh', 'Jubail', 'Tabuk', 'Thuwal'],
  },
  {
    id: 'key-staff',
    kind: 'content',
    section: '02',
    title: 'Key Staff',
    orgChart: {
      executives: [
        {
          name: 'Haitham Al-Jahdali',
          role: 'Founder & CEO',
          photo: '/media/company-profile/staff/haitham.png',
        },
        {
          name: 'Lama Al-Jahdali',
          role: 'Co-Founder',
          photo: '/media/company-profile/staff/lama.jpeg',
        },
      ],
      deputy: {
        name: 'Dr. Hisham Malak',
        role: 'Deputy CEO',
        photo: '/media/company-profile/staff/hisham.png',
      },
      departmentHead: {
        name: 'Eyad Alamoudi',
        role: 'Projects Head',
        photo: '/media/company-profile/staff/eyad.jpeg',
      },
      managers: [
        {
          name: 'Nawaf Alsahli',
          role: 'Operation Manager',
          photo: '/media/company-profile/staff/nawaf.png',
        },
        {
          name: 'Ahmed Hadeel',
          role: 'Geomatics Department Manager',
          photo: '/media/company-profile/staff/ahmed-hadeel.png',
        },
        {
          name: 'Khalid Shami',
          role: 'Senior Project Management',
          photo: '/media/company-profile/staff/khalid.png',
        },
      ],
    },
  },
  {
    id: 'our-services',
    kind: 'content',
    section: '03',
    title: 'Our Services',
    lead: 'End-to-end geospatial and drone solutions across Saudi Arabia.',
    services: [
      { label: 'Inspection', icon: 'inspection' },
      { label: 'Scan/CAD to BIM', icon: 'cad-bim' },
      { label: 'Agriculture Monitoring', icon: 'agriculture' },
      { label: 'Construction Monitoring', icon: 'construction' },
      { label: 'Environmental Monitoring', icon: 'environmental' },
      { label: 'AI Application Development', icon: 'ai' },
      { label: 'Bathymetric & Underwater Survey', icon: 'bathymetric' },
      { label: 'Mining & Exploration', icon: 'mining' },
      { label: 'Special Projects', icon: 'special' },
      { label: 'Aerial Survey', icon: 'aerial' },
      { label: 'Security Surveillance', icon: 'security' },
      { label: 'GIS and Remote Sensing', icon: 'gis' },
      { label: 'Oil & Gas', icon: 'oil-gas' },
      { label: 'Traffic Count & Analysis', icon: 'traffic' },
    ],
  },
  {
    id: 'products',
    kind: 'content',
    section: '04',
    title: 'Products',
    items: [
      {
        title: 'DJI Professional Solutions',
        body:
          'Integrated Drones & Payload Systems: Dock 3, Matrice 400, FlyCart 100, Zenmuse L3, Zenmuse P1, Zenmuse H30, Zenmuse S1.',
      },
      {
        title: 'Mono Satellite Imagery',
        body:
          'High-resolution 2D optical imagery captured from a single viewing angle, typically offering spatial resolutions from 30 cm to 1 m. Mono imagery is optimized for large-area mapping, land-use classification, asset inventory, and environmental monitoring, providing frequent revisit capability and consistent baseline datasets for change detection and planning applications.',
      },
      {
        title: 'Stereo Satellite Imagery',
        body:
          'Stereo imagery consists of two images of the same location captured from different viewing angles, enabling 3D terrain reconstruction. It supports the generation of Digital Surface Models (DSM) and Digital Terrain Models (DTM) with vertical accuracies typically in the range of 0.5–1.0 m, making it suitable for construction progress monitoring, volume calculations, slope analysis, and infrastructure design at scales up to 1:10,000.',
      },
      {
        title: 'Tri-Stereo Satellite Imagery',
        body:
          'Tri-stereo imagery captures three images (forward, nadir, and backward) in a single orbital pass, significantly reducing occlusions and improving height accuracy. This dataset enables high-precision 3D mapping with vertical accuracies of ≤0.5 m, supporting dense urban modeling, complex terrain analysis, and critical infrastructure projects at mapping scales of 1:5,000 or better.',
      },
    ],
  },
  {
    id: 'inventory-datasets',
    kind: 'content',
    section: '05',
    title: 'Inventory & Datasets',
    bullets: [
      'Drones: DJI M400, 350, Dock 3, M30T, FPV, Mavic 3 (Cine, Pro & enterprise), Quantum Systems Trinity F90+ Pro, CW-15.',
      'Payloads: DJI Zenmuse P1, L1, H20, H20T, X7, Sony RXR1, Emesent Hovermap, MicaSense Altum, MicaSense RedEdge-MX.',
    ],
    items: [
      {
        title: 'LiDAR Point Cloud',
        body:
          'Produces very precise point clouds used for topographic mapping and 3D modeling, enabling creation of digital twins of the surveyed area.',
      },
      {
        title: 'Multispectral Imagery',
        body:
          'Multispectral sensors deliver index data essential for assessing plant health, monitoring environmental changes, and conducting mineral exploration surveys.',
      },
      {
        title: 'Detail Visual Inspection',
        body:
          'Specialized visual inspection payloads are used for tasks such as flare stack checks, tower inspections and confined space inspections to detect damage and document findings.',
      },
      {
        title: 'Thermal Imagery',
        body:
          'Thermal cameras are crucial for thermographic analysis, helping to locate defects, identify issues, and support operations such as night-time surveillance.',
      },
      {
        title: 'UT Thickness Measurement',
        body:
          'Measures the remaining thickness of surfaces, walls, and plates, including Dry Film Thickness (DFT), which is essential for infrastructure integrity checks.',
      },
      {
        title: 'Magnetic Reading',
        body:
          'Magnetic sensors generate high-resolution, accurate magnetic maps that are vital for mineral exploration.',
      },
      {
        title: 'Visual Imagery (RGB)',
        body:
          'Our drones carry RGB cameras that capture high-resolution, highly accurate images, ideal for producing detailed maps and 3D models.',
      },
      {
        title: 'Radargram GPR',
        body:
          'Ground-penetrating radar (GPR) payloads produce radargrams used in mineral exploration and geotechnical surveys, accurately mapping subsurface structures.',
      },
    ],
  },
  {
    id: 'accreditations',
    kind: 'content',
    section: '06',
    title: 'Accreditations',
    lead:
      'Shamal is proudly accredited by the General Authority of Civil Aviation (GACA) and holds ISO certifications, demonstrating our commitment to maintaining the highest standards of safety, quality, and operational excellence in the drone industry.',
    bullets: [
      "Shamal Technologies' operations meet international levels of standardization. All activities, solutions, and services are entirely legalized and approved by the Saudi General Authority of Civil Aviation (GACA). Our drone pilots are GACA 107 certified and insured for third-party liability.",
      'Shamal Technologies are proud to have recently obtained ISO 9001, ISO 14001, ISO 45001 and ISO 27001 certification which underlines our commitment to meeting the quality expected by our clients, whilst operating with the health and safety of our teams at the front of mind, and ensuring we operate in an environmentally sound manner.',
      'Shamal Technologies has engineers certified with the Saudi Council of Engineers (SCE), ensuring full compliance with national engineering standards and professional regulations in the Kingdom of Saudi Arabia.',
    ],
    showCertLogos: true,
  },
  {
    id: 'sectors',
    kind: 'content',
    section: '07',
    title: 'Sectors We Serve',
    tags: [
      'Transportation',
      'Real Estate',
      'Heritage',
      'Utilities',
      'Oil & Gas',
      'Government',
      'Construction',
      'Agriculture & Environment',
      'Marine',
      'Education',
      'Application Development',
      'Mining',
    ],
  },
  {
    id: 'oil-gas',
    kind: 'content',
    section: '08',
    title: 'Oil & Gas Capabilities',
    lead:
      'Shamal Technologies delivers advanced visual intelligence, inspection, and monitoring services for critical infrastructure, leveraging aerial, satellite, robotic, and sensor-based technologies to provide safe, accurate, and actionable asset insights.',
    bullets: [
      'Aerial visual inspections for complex and hard-to-access assets',
      'High-resolution imaging for condition assessment and defect identification',
      'Satellite and drone-based monitoring for large-scale assets and facilities',
      'Digital inspection workflows with structured, client-ready reporting',
      'Our approach reduces risk, eliminates the need for scaffolding or rope access, and enables faster, safer inspections across onshore, offshore, and industrial environments.',
    ],
    items: [
      {
        title: 'Inspection & Asset Integrity',
        body:
          'Visual inspections of towers, stacks, flares, tanks, pipe racks, bridges, and structures; confined-space inspections without manned entry; high-resolution imagery for welds, corrosion, coatings, and structural defects.',
      },
      {
        title: 'Thermography & Emissions Monitoring',
        body:
          'Drone-based thermographic inspections for furnaces, heaters, and ducting; Optical Gas Imaging (OGI) for hydrocarbon leak detection; methane and CO₂ emissions monitoring aligned with OGMP 2.0.',
      },
      {
        title: 'Ultrasonic Testing & Advanced Measurement',
        body:
          'Drone-based ultrasonic thickness measurements; internal and external UT inspections in hazardous or inaccessible areas; location-tagged measurements integrated with 3D models.',
      },
      {
        title: 'Marine & Underwater Inspections',
        body:
          'Mini-ROV inspections for tanks, piers, jetties, bridges, and underwater structures.',
      },
      {
        title: 'Deliverables',
        body:
          'High-resolution inspection imagery; location-referenced findings and measurements; structured inspection and condition assessment reports — enabling safer inspections, reduced downtime, and data-driven maintenance decisions.',
      },
    ],
  },
  {
    id: 'case-studies-1',
    kind: 'content',
    section: '09',
    title: 'Project Case Studies',
    caseStudies: [
      {
        title: 'Asset Inspection — SEC Western Region',
        intro:
          'Traditional inspection methods, like manual climbing and ground photography, put workers at risk and deliver inconsistent and incomplete data. Drones revolutionize inspections by offering a safer, more reliable, and comprehensive alternative. Get an up-to-date view of your assets with georeferenced data that is easy to prioritize and analyze. Shamal’s immersive drone-powered photographs and thermal imagery provide a detailed and accurate record of the state of your assets, helping you identify maintenance issues and keep meticulous historical records for better asset lifecycle management. Shamal has partnered with world-leading software providers to bring you advanced data visualization for critical infrastructure.',
        narrative:
          'In 2023, Shamal worked alongside our partners, international infrastructure drone inspection company CyberHawk, to undertake the inspection of over 3,000 towers and over 2,000 km of power lines in the Western Region. Focusing primarily on RGB and thermal data capture and analysis, the team was also responsible for undertaking corona UV data capture through the deployment of the M300 multi-rotor drone system and a combination of market-leading payloads. Through a combination of CyberHawk’s experience and Shamal’s local knowledge, the towers and power lines were captured efficiently and within program through rigorous planning and SOPs.',
      },
      {
        title: 'Construction Survey Monitoring — NEOM',
        intro:
          'Tight deadlines and stringent budgets are the realities of construction — Shamal’s drone solutions equip project teams with the data they need to optimize every aspect of delivery. Leverage highly accurate distance, area, and volumetric measurements directly from your true-to-scale imagery and create detailed maps and site plans for effective planning and resource allocation. Providing a critical layer of context to BIM and GIS workflows, enhancing spatial accuracy and real-time insights throughout the project lifecycle.',
        narrative:
          'Shamal has operated daily flights in the NEOM region for over two years, often with multiple teams, the majority of this work has been to support construction monitoring requirements across each of the major sites. Our field teams have delivered highly accurate surveys for site planning activities, providing the client with high resolution imagery including orthophotos, point clouds and digital elevation models. This data is fully compatible with existing digital construction workflows, seamlessly integrating with both BIM and GIS software. Working directly for the CEO\'s office, Shamal have also been providing videography for macro-level progress updates and comparison of every major NEOM project.',
      },
    ],
  },
  {
    id: 'case-studies-2',
    kind: 'content',
    section: '10',
    title: 'Project Case Studies (continued)',
    caseStudies: [
      {
        title: 'Environmental Monitoring — Mangrove Monitoring',
        intro:
          'Gather data across vast landscapes in a fraction of the time and enhance decision making with best-practice environmental monitoring processes. Drones can revolutionize this process by covering larger areas more quickly and with greater detail. High resolution video and still imagery, multispectral datasets, point clouds, and bathymetric surveys can all be delivered by Shamal’s expert team with precision and efficiency.',
        narrative:
          'Shamal, in collaboration with the National Centre for Wildlife, King Abdulaziz University, and O2 Marine, is monitoring mangrove health along the Red Sea coast from Jazan to NEOM. High-resolution RGB and multispectral data are being captured for NDVI calculations to assess vegetation health. Drone precision is critical for detecting subtle differences in red and near-infrared light, enabling targeted interventions and deeper ecosystem understanding.',
      },
      {
        title: 'Traffic Count & Traffic Analysis — Saudi Arabia',
        intro:
          'Gather accurate traffic data across complex urban and highway environments in a fraction of the time and support data-driven transportation planning with best-practice traffic survey methodologies. Advanced video-based traffic counting and AI-driven analytics transform how traffic data is collected and analyzed.',
        narrative:
          'Shamal, through its strategic collaboration with Trans Analyst, has delivered multiple traffic count and traffic analysis projects across Saudi Arabia, including Riyadh, Jeddah, Makkah, Madinah, Jubail, and NEOM. Surveys included automatic and manual traffic counts, turning movement counts, classified vehicle counts, peak hour analysis, and origin–destination studies using HD cameras and AI-based processing technologies. These studies provided high-accuracy traffic datasets (97–99%) to support transport planning, congestion management, and infrastructure optimization.',
      },
      {
        title: 'Security Surveillance — Autonomous Drone-in-a-Box',
        intro:
          'Enhance site security and situational awareness across large and complex environments with advanced aerial surveillance solutions. Autonomous drone-based surveillance provides rapid aerial coverage, real-time monitoring, and intelligent detection capabilities.',
        narrative:
          'Shamal Technologies successfully conducted a Drone-in-a-Box Proof of Concept (PoC) for autonomous security surveillance at a large industrial facility, validating the use of drones for continuous situational awareness. The solution enabled scheduled autonomous patrols, day and night monitoring using RGB and thermal sensors, and real-time detection and tracking of humans and vehicles within defined security zones.',
      },
      {
        title: 'Satellite Data — Construction Progress Monitoring (ROSHN / PIF)',
        intro:
          'Shamal Technologies is an authorized distributor of high-resolution satellite data, providing access to Mono, Stereo, and Tri-Stereo satellite imagery solutions to support mapping, urban planning, construction monitoring, and infrastructure development across the Kingdom of Saudi Arabia.',
        narrative:
          'Shamal Technologies supplied high-resolution Stereo Satellite Imagery to ROSHN (Public Investment Fund) for construction progress monitoring across three major residential developments: Sedra, Al-Manar, and Al-Arous. The stereo datasets enabled accurate 3D visualization, terrain modeling, and progress assessment across large construction sites, supporting project monitoring, planning verification, and data-driven decision-making without the need for frequent ground surveys.',
      },
      {
        title: 'Special Projects — Waste Management Compliance',
        intro:
          'Shamal is a hub of innovation — whilst we intentionally specialize in our key industries, we are always exploring ways to create new solutions where spatial insights, accessibility, and precision will provide value, improve efficiency and increase safety. Nothing is off the table — let’s start a conversation and create something together.',
        narrative:
          'Shamal, in partnership with KAUST Beacon Development (KBD) and on behalf of MEWA, surveyed multiple mining sites across KSA to assess environmental compliance, focusing on waste management. RGB and multispectral data, along with 3D mesh models, were captured for analysis. AI-driven models identified waste piles, and stockpile analysis provided insights into material volumes.',
      },
    ],
  },
  {
    id: 'partnerships-culture',
    kind: 'content',
    section: '11',
    title: 'Our Culture of Strategic Partnerships',
    bullets: [
      'Shamal Technologies prides itself on the strategic partnerships that we build and grow with our key clients, working closely to deliver the outcomes that our clients wish to achieve, in alignment with their digital roadmaps.',
      'We firmly believe that collaboration and openness should be the core values of any partnership and have formed close working relationships with some of the most innovative, and market-leading clients and technology vendors in our sector, specializing in the joint-delivery of client scopes, while focusing primarily on high quality, value-driven, data-centric services.',
      'Continuous improvement is at the heart of everything we do, allowing us to balance being both innovative and programmatic in our approach to our work.',
    ],
  },
  {
    id: 'clients',
    kind: 'clients',
    section: '12',
    title: 'Our Key Clients',
    lead:
      'Since 2019 we have collaborated with key clients, in multiple markets, across KSA, gaining a strong reputation as an industry-leading service provider. We are selective in the projects that we undertake, ensuring all contracts allow us to deliver to the highest standard, and present an opportunity for strategic growth.',
  },
  {
    id: 'contact',
    kind: 'contact',
    section: '13',
    title: 'Get in Touch',
    website: 'shamal.sa',
    contacts: [
      { name: 'Haitham Al-Jahdali', role: 'CEO', email: 'h.aljahdali@shamal.sa' },
      { name: 'Dr. Hisham Malak', role: 'Deputy CEO', email: 'hamalak@shamal.sa' },
      { name: 'Lama Al-Jahdali', role: 'Co-Founder', email: 'l.aljahdali@shamal.sa' },
    ],
  },
]
