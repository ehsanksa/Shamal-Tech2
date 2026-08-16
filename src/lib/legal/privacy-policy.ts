import {
  LEGAL_COMPANY,
  LEGAL_LAST_UPDATED_DISPLAY,
  LEGAL_LAST_UPDATED_ISO,
  type LegalDocument,
} from './types'

export const privacyPolicyDocument: LegalDocument = {
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  badge: 'Legal',
  metaTitle: 'Privacy Policy',
  metaDescription:
    'Privacy Policy of Shamal Technologies. How we collect, use, store, and protect personal, business, and geospatial data under Saudi PDPL, MOC E-Commerce Law, NCA, GEOSA, GACA, and related Kingdom of Saudi Arabia regulations.',
  keywords: [
    'Shamal Technologies privacy policy',
    'Saudi PDPL',
    'personal data protection Saudi Arabia',
    'drone survey data privacy',
    'geospatial data protection KSA',
    'SDAIA PDPL rights',
  ],
  lastUpdated: LEGAL_LAST_UPDATED_DISPLAY,
  lastUpdatedIso: LEGAL_LAST_UPDATED_ISO,
  intro:
    'This Privacy Policy explains how **Shamal Technologies** ("Shamal", "we", "us", or "our") collects, uses, stores, discloses, and protects personal data, business information, and geospatial datasets in connection with our website at [shamal.sa](https://shamal.sa), our products, training programmes, and professional drone, mapping, and geospatial services across the Kingdom of Saudi Arabia. By using our website, submitting forms, purchasing products or training, or engaging our services, you acknowledge this Policy. Related contractual terms are set out in our [Terms & Conditions](/terms-and-conditions).',
  related: { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  sections: [
    {
      id: 'introduction',
      title: '1. Introduction',
      blocks: [
        {
          type: 'paragraph',
          text: 'Shamal Technologies is a Saudi geospatial and drone technology company. We provide end-to-end solutions from data acquisition to processing, visualisation, and analytics for government, industrial, and enterprise clients. This Policy is designed to align with applicable Saudi Arabian laws and recognised sector guidance, including:',
        },
        {
          type: 'list',
          items: [
            'The Personal Data Protection Law (PDPL) issued by Royal Decree No. M/19 dated 9 / 2 / 1443 H, as amended, together with its Implementing Regulation and related rules issued under the supervision of the Saudi Data and Artificial Intelligence Authority (SDAIA).',
            'The E-Commerce Law issued by Royal Decree No. M/126 dated 7 / 11 / 1440 H and implementing regulations of the Ministry of Commerce (MOC), insofar as they apply to our website, product quotations, and online training offerings.',
            'National Cybersecurity Authority (NCA) Essential Cybersecurity Controls and related cybersecurity guidelines applicable to our systems and operations.',
            'Communications, Space & Technology Commission (CST) requirements relevant to information and communications technology, space-related data services, and authorised technology operations.',
            'General Authority for Survey and Geospatial Information (GEOSA) requirements governing geospatial data collection, standards, storage, processing, and distribution in the Kingdom.',
            'General Authority of Civil Aviation (GACA) regulations governing remotely piloted aircraft systems (RPAS), aerial surveying, flight permissions, and operational safety.',
            'Saudi Central Bank (SAMA) digital business, electronic payment, and consumer data-protection principles, to the extent they apply when we process payments through licensed payment service providers.',
            'Saudi Arabian Riyal Interbank Express (SARIE) operating rules and related banking standards, to the extent they apply to Saudi Riyal transfers made to or from Shamal through licensed banks.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Where we process data for a government entity or a critical-infrastructure operator, additional contractual, classification, and localisation requirements may apply, including SDAIA National Data Governance rules and sector-specific instructions. Those requirements prevail for the relevant project to the extent they are stricter than this Policy.',
        },
        {
          type: 'note',
          text: 'This Policy applies to visitors of shamal.sa, newsletter subscribers, enquiry and quotation contacts, training participants, job applicants, suppliers, and clients. It does not apply to third-party websites linked from our site, which are governed by their own privacy notices.',
        },
      ],
    },
    {
      id: 'company-information',
      title: '2. Company Information',
      blocks: [
        {
          type: 'paragraph',
          text: 'The data controller for personal data processed through this website and in connection with our commercial services is **Shamal Technologies**, a fully Saudi-owned company headquartered in Jeddah, Kingdom of Saudi Arabia.',
        },
        {
          type: 'list',
          items: [
            `Legal / trading name: ${LEGAL_COMPANY.name}`,
            `Registered office: ${LEGAL_COMPANY.address}`,
            `Website: ${LEGAL_COMPANY.website}`,
            `General contact: ${LEGAL_COMPANY.email}`,
            `Telephone: ${LEGAL_COMPANY.phone}`,
            'Operations: nationwide coverage including Jeddah, Riyadh, Jubail, Tabuk, Thuwal, NEOM, and other project locations across the Kingdom',
          ],
        },
        {
          type: 'paragraph',
          text: 'Shamal Technologies is accredited for drone operations by GACA, maintains GACA Part 107 certified and insured remote pilots, and holds ISO 9001, ISO 14001, ISO 45001, and ISO 27001 certifications. Our engineers include professionals registered with the Saudi Council of Engineers (SCE). We are an authorised seller of DJI Enterprise solutions in the Kingdom and an authorised distributor of selected high-resolution satellite imagery products.',
        },
        {
          type: 'paragraph',
          text: 'For personal data requests under the PDPL, please write to [hello@shamal.sa](mailto:hello@shamal.sa) with the subject line "Personal Data Request". We will handle requests in accordance with Section 12 of this Policy.',
        },
      ],
    },
    {
      id: 'information-we-collect',
      title: '3. Information We Collect',
      blocks: [
        {
          type: 'paragraph',
          text: 'We collect information that is necessary to operate our website, respond to enquiries, deliver professional services, sell or lease equipment, administer training, manage supplier and employment relationships, and comply with Saudi law. The categories below summarise what we may collect. Subsequent sections describe personal data, business data, and website analytics in more detail.',
        },
        {
          type: 'list',
          items: [
            'Identity and contact details submitted through our contact form, quotation cart, newsletter, training interest or registration forms, procurement request, careers applications, and related channels.',
            'Commercial and project information needed to scope, price, permit, execute, and deliver drone survey, LiDAR, photogrammetry, GIS, inspection, environmental, bathymetric, and software engagements.',
            'Geospatial, imagery, LiDAR, bathymetric, thermal, multispectral, inspection, and related datasets captured or processed under client instruction.',
            'Technical and usage data generated by our website, training platform, chatbot, and first-party analytics.',
            'Payment, invoicing, and banking information required to issue quotations, invoices, and to receive or make Saudi Riyal payments.',
            'Information you choose to provide in correspondence, meetings, site visits, or support interactions.',
          ],
        },
        {
          type: 'paragraph',
          text: 'We do not knowingly collect personal data from children. Our website, products, training, and professional services are directed to businesses, government entities, and adults. If you believe a minor has submitted personal data to us, contact [hello@shamal.sa](mailto:hello@shamal.sa) and we will take appropriate steps to delete it, unless retention is required by law.',
        },
      ],
    },
    {
      id: 'personal-data-collection',
      title: '4. Personal Data Collection',
      blocks: [
        {
          type: 'paragraph',
          text: 'Under the PDPL, personal data means any data that identifies, or can reasonably be used to identify, an individual. Depending on how you interact with Shamal, we may process the following personal data:',
        },
      ],
      subsections: [
        {
          id: 'personal-data-sources',
          title: '4.1 Sources',
          blocks: [
            {
              type: 'list',
              items: [
                'Information you provide directly (forms, email, telephone, WhatsApp, events, site meetings, training enrolment, job applications).',
                'Information provided by your employer or contracting organisation when they nominate you as a project contact, trainee, or authorised representative.',
                'Information generated in the course of service delivery (for example, names of site escorts, HSE contacts, or persons appearing incidentally in survey or inspection imagery).',
                'Limited technical identifiers created by our website and security tools, as described in Section 6.',
              ],
            },
          ],
        },
        {
          id: 'personal-data-categories',
          title: '4.2 Categories of personal data',
          blocks: [
            {
              type: 'list',
              items: [
                'Identity data: name, job title, employer, professional registration (for example SCE), nationality where required for site access or GACA/security permitting.',
                'Contact data: email address, telephone or WhatsApp number, office address, and preferred language.',
                'Enquiry and commercial data: subject of enquiry, selected services or products, project location, industry, budget range, and message content.',
                'Training data: course interest, enrolment, attendance, assessment or progress records, and payment status for Shamal Academy programmes.',
                'Recruitment data: CV, qualifications, eligibility to work in the Kingdom, and interview notes for applicants.',
                'Imagery incidental to operations: individuals may appear in aerial, terrestrial, marine, or inspection imagery captured for a client project. Such imagery is treated as project data under the client contract and Section 14.',
                'Security and anti-abuse data: Cloudflare Turnstile verification tokens, honeypot and rate-limiting signals, and similar measures used to protect forms from automated abuse.',
              ],
            },
          ],
        },
        {
          id: 'sensitive-personal-data',
          title: '4.3 Sensitive personal data',
          blocks: [
            {
              type: 'paragraph',
              text: 'We do not seek to collect sensitive personal data (such as health, biometric templates, religious or political beliefs, or criminal records) through our public website. Limited health or access-related information may be processed only where required for site HSE, confined-space or industrial-facility access, or as mandated by a client site owner, and then only on a need-to-know basis. Biometric or facial-recognition templates are not created from survey imagery as a product of our standard mapping or inspection workflows unless a client contract expressly requires a defined, lawful processing activity and appropriate safeguards.',
            },
          ],
        },
      ],
    },
    {
      id: 'business-data-collection',
      title: '5. Business Data Collection',
      blocks: [
        {
          type: 'paragraph',
          text: 'In addition to personal data of individuals, we collect and process business, project, and operational data belonging to our clients, suppliers, and partners. This may include:',
        },
        {
          type: 'list',
          items: [
            'Company name, commercial registration details (when provided), VAT or tax identifiers, authorised signatories, and billing addresses.',
            'Project names, scopes of work, coordinates or site descriptions, schedules, access constraints, and health, safety, and environment (HSE) requirements.',
            'Purchase orders, statements of work, technical specifications, CAD/BIM references, and existing GIS or survey control data supplied by the client.',
            'Equipment quotations, serial numbers, warranty and support records for DJI Enterprise systems, docks, payloads, and related products.',
            'Satellite imagery product orders (mono, stereo, and tri-stereo) and licensed-use conditions imposed by upstream data providers.',
            'Internal project-management records, including tasks and correspondence maintained in our operational systems.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Business data is processed to perform contracts, prepare quotations, obtain flight and site permissions, deliver professional services, support after-sales and training, and meet legal, audit, and quality-management obligations (including ISO 9001 and ISO 27001). Where business data includes personal data of employees or contractors, that personal data remains subject to the PDPL and this Policy.',
        },
      ],
    },
    {
      id: 'analytics-cookies',
      title: '6. Website Analytics & Cookies',
      blocks: [
        {
          type: 'paragraph',
          text: 'Our public website uses a combination of strictly necessary technologies, preference storage, first-party analytics, and security widgets. We do not use third-party advertising cookies to profile visitors for cross-site advertising.',
        },
      ],
      subsections: [
        {
          id: 'cookies-necessary',
          title: '6.1 Strictly necessary and security technologies',
          blocks: [
            {
              type: 'list',
              items: [
                'Session cookies required for authenticated areas (for example, CMS administration and Shamal Academy / training platform sessions).',
                'Cloudflare Turnstile, used on public forms to distinguish human users from automated bots. Turnstile may set cookies or similar identifiers as described in Cloudflare’s documentation.',
                'Anti-spam honeypot fields and server-side rate limiting on public forms.',
              ],
            },
          ],
        },
        {
          id: 'cookies-preferences',
          title: '6.2 Preference and functional storage',
          blocks: [
            {
              type: 'paragraph',
              text: 'We store language preference and theme preference in your browser’s local storage so the site can remember English or Arabic and light or dark appearance. Product quotation selections are stored locally in your browser until you submit an RFQ or clear them. These items are not sent to us until you choose to submit a form.',
            },
          ],
        },
        {
          id: 'cookies-analytics',
          title: '6.3 First-party analytics',
          blocks: [
            {
              type: 'paragraph',
              text: 'We operate a first-party analytics function that records aggregated website usage to improve content, services, and sales support. A temporary session identifier is stored in session storage (not a persistent advertising cookie) and is sent with page-view and selected interaction events to our own `/api/analytics/track` endpoint. We use this information to understand which pages, products, and enquiry paths are used, not to sell advertising profiles.',
            },
            {
              type: 'paragraph',
              text: 'Analytics events may include page URL, referrer, a session identifier, and limited metadata (for example, that a quotation was submitted). We do not combine analytics with your form identity unless you have submitted an enquiry in the same workflow and the association is needed to understand conversion of that enquiry.',
            },
          ],
        },
        {
          id: 'cookies-third-party',
          title: '6.4 Embedded and third-party content',
          blocks: [
            {
              type: 'paragraph',
              text: 'Certain pages embed Google Maps (contact location) or Vimeo players (training content). Those providers may set their own cookies or collect technical data under their privacy policies when you load the embedded content. Training checkout may also redirect you to Stripe or STC Pay / Amazon Payment Services hosted pages, which apply their own notices.',
            },
          ],
        },
        {
          id: 'cookies-control',
          title: '6.5 Your choices',
          blocks: [
            {
              type: 'paragraph',
              text: 'You may block or delete cookies through your browser settings. Disabling strictly necessary cookies may prevent login to training or administration areas and may impair form security checks. Clearing local storage will reset language, theme, and any unsubmitted quotation cart. For PDPL rights relating to analytics identifiers, see Section 12.',
            },
          ],
        },
      ],
    },
    {
      id: 'marketing-communications',
      title: '7. Marketing Communications',
      blocks: [
        {
          type: 'paragraph',
          text: 'If you subscribe to our newsletter or otherwise consent to receive updates, we will send information about drone technology, geospatial services, products, events, and Shamal Academy programmes. Subscription is voluntary. You may unsubscribe at any time by using the unsubscribe method provided in the message or by emailing [hello@shamal.sa](mailto:hello@shamal.sa).',
        },
        {
          type: 'paragraph',
          text: 'We may also send service, transactional, and contract messages that are not marketing, including quotation follow-up, training enrolment confirmations, invoice notices, project coordination, safety or permit updates, and responses to enquiries you initiated. These communications are processed as necessary to perform a contract or take steps at your request, or to pursue a legitimate operational interest that does not conflict with PDPL requirements.',
        },
        {
          type: 'paragraph',
          text: 'We do not sell personal data. We do not share newsletter lists with unaffiliated third parties for their independent marketing. Promotional pop-ups on our website are first-party notices about our own training and product offerings.',
        },
      ],
    },
    {
      id: 'purpose-of-processing',
      title: '8. Purpose of Data Processing',
      blocks: [
        {
          type: 'paragraph',
          text: 'We process personal and business data only for specified, explicit, and legitimate purposes, including:',
        },
        {
          type: 'list',
          items: [
            'Responding to contact, quotation, procurement, and partnership enquiries.',
            'Preparing technical and commercial proposals, statements of work, and product quotations.',
            'Performing contracts for drone surveying, LiDAR, photogrammetry, GIS and remote sensing, construction monitoring, asset inspection, environmental monitoring, bathymetric survey, AI and software development, satellite imagery supply, and related geospatial services.',
            'Obtaining and documenting GACA flight permissions, site access, and other regulatory or client-site authorisations.',
            'Delivering, hosting, and supporting Shamal Academy training, including enrolment and (where applicable) payment.',
            'Processing payments through licensed banks and payment service providers, issuing invoices, and maintaining accounting records required under Saudi law.',
            'Operating, securing, and improving shamal.sa, including fraud and bot prevention.',
            'Recruitment and human-resources administration for applicants and personnel.',
            'Quality, information-security, environmental, and occupational-health management under our ISO certifications.',
            'Complying with legal obligations, court orders, and lawful requests of competent Saudi authorities, including SDAIA, MOC, CST, GEOSA, GACA, NCA, and other regulators as applicable.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Legal bases under the PDPL include: your consent (for example, newsletter subscription and certain optional cookies or marketing); performance of a contract or steps at your request before entering a contract; compliance with a legal obligation; and our legitimate operational interests where processing is necessary, proportionate, and does not prejudice your rights (for example, website security, first-party analytics, and B2B relationship management). Where consent is the basis, you may withdraw it without affecting the lawfulness of processing carried out before withdrawal.',
        },
      ],
    },
    {
      id: 'data-storage-security',
      title: '9. Data Storage & Security',
      blocks: [
        {
          type: 'paragraph',
          text: 'We store personal data, business records, and project deliverables in systems selected to support confidentiality, integrity, and availability. Measures include access control, encryption in transit, credential management, backup, logging, and administrative procedures consistent with ISO 27001 and NCA guidance applicable to our organisation.',
        },
        {
          type: 'list',
          items: [
            'Website, CMS, and application data are hosted on professionally managed cloud infrastructure with restricted administrative access.',
            'Media and selected project files may be stored on object storage (including Amazon Web Services S3 or equivalent) with access controls.',
            'Email and operational correspondence are processed through our corporate mail systems.',
            'Payment card data is not stored on Shamal servers. Card and STC Pay transactions are handled by Stripe or Amazon Payment Services / STC Pay on their hosted checkout pages.',
            'Survey and inspection datasets are stored according to the client contract, data-classification instructions, and any localisation or transfer restrictions imposed by the client or by Saudi law.',
          ],
        },
        {
          type: 'paragraph',
          text: 'No method of electronic storage or transmission is completely secure. We implement appropriate organisational and technical measures and review them as threats and regulations evolve. You are responsible for keeping credentials for training or client portals confidential and for notifying us promptly of suspected unauthorised access.',
        },
      ],
    },
    {
      id: 'third-party-providers',
      title: '10. Third-Party Service Providers',
      blocks: [
        {
          type: 'paragraph',
          text: 'We use carefully selected processors and service providers who support our operations. They are permitted to process data only on our instructions (or as required by law) and are expected to implement appropriate security. Categories include:',
        },
        {
          type: 'list',
          items: [
            'Cloud hosting, content delivery, and object storage providers.',
            'Cloudflare, for website security and Turnstile bot management on public forms.',
            'Email delivery and corporate productivity tools.',
            'ClickUp and similar project-management or CRM tools used to track enquiries, training leads, and delivery tasks.',
            'Stripe, for certain Shamal Academy / training payments.',
            'STC Pay via Amazon Payment Services (PayFort), for commercial payments after proposal approval and other enabled electronic payments.',
            'Licensed Saudi banks, for invoices, SARIE transfers, and treasury operations.',
            'Google, for maps embedding on the contact page.',
            'Vimeo, for streaming selected training videos.',
            'Upstream satellite imagery licensors and equipment manufacturers (including DJI and payload vendors) where order fulfilment or warranty support requires it.',
            'Professional advisers (legal, audit, insurance) and, where required, GACA, GEOSA, or client-site security authorities in connection with permits and compliance.',
          ],
        },
        {
          type: 'paragraph',
          text: 'We do not authorise these providers to use personal data for their own unrelated marketing. Some providers are independent controllers for their own platforms (for example, payment schemes and map or video embeds you choose to load). Their notices apply to that processing.',
        },
      ],
    },
    {
      id: 'international-transfers',
      title: '11. International Data Transfers',
      blocks: [
        {
          type: 'paragraph',
          text: 'Shamal is established in the Kingdom of Saudi Arabia. Some processors and tools we use operate from, or replicate data to, facilities outside the Kingdom (for example, global cloud, payment, security, video, or project-management platforms). Where personal data is transferred outside the Kingdom, we do so in accordance with the PDPL, its Implementing Regulation, and SDAIA transfer rules, including where applicable:',
        },
        {
          type: 'list',
          items: [
            'Transfers to jurisdictions or organisations recognised as providing an appropriate level of protection.',
            'Appropriate contractual, organisational, and technical safeguards, including encryption and access limitation.',
            'Necessity for contract performance, payment processing, or the establishment, exercise, or defence of legal claims.',
            'Your consent, where required and obtained.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Geospatial and project datasets that are classified, security-sensitive, or subject to GEOSA, national-security, or client localisation requirements are not transferred outside the Kingdom except as expressly permitted by the client contract and applicable Saudi law. Government and critical-infrastructure clients may impose additional residency conditions, which we will follow for those engagements.',
        },
      ],
    },
    {
      id: 'pdpl-rights',
      title: '12. User Rights under PDPL',
      blocks: [
        {
          type: 'paragraph',
          text: 'Subject to the PDPL, its Implementing Regulation, and any lawful exceptions (including national security, legal claims, and rights of others), individuals whose personal data we process have the following rights:',
        },
        {
          type: 'list',
          items: [
            '**Right to be informed** about the collection and processing of your personal data, including through this Policy.',
            '**Right of access** to your personal data and to obtain a copy in a clear format, within the statutory period.',
            '**Right to request correction** of inaccurate, incomplete, or outdated personal data.',
            '**Right to request destruction** of personal data that is no longer required for the purposes for which it was collected, subject to legal and contractual retention duties.',
            '**Right to withdraw consent** where processing is based on consent, without affecting prior lawful processing.',
            '**Right to lodge a complaint** with SDAIA if you believe your PDPL rights have been infringed.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Additional rights provided under the PDPL and Implementing Regulation — including restriction of processing, objection in applicable cases, and data portability where technically feasible and legally required — will be honoured in accordance with those instruments.',
        },
        {
          type: 'paragraph',
          text: 'To exercise your rights, email [hello@shamal.sa](mailto:hello@shamal.sa) with the subject "Personal Data Request", your name, contact details, the nature of the request, and sufficient information for us to verify your identity and locate the data. We may request additional verification to prevent unauthorised disclosure. We will respond within the timeframes required by the PDPL. We may refuse or limit a request where the PDPL permits, including where disclosure would adversely affect the rights of others, legal privilege, ongoing investigations, or security-sensitive geospatial operations.',
        },
        {
          type: 'note',
          text: 'SDAIA is the competent authority for the PDPL in the Kingdom of Saudi Arabia. Complaint procedures and guidance are published by SDAIA. You may also contact us first so we can attempt to resolve your concern directly.',
        },
      ],
    },
    {
      id: 'data-retention',
      title: '13. Data Retention Policy',
      blocks: [
        {
          type: 'paragraph',
          text: 'We retain personal and business data only for as long as necessary for the purposes described in this Policy, including legal, accounting, tax, warranty, quality, and dispute-resolution requirements. Indicative periods include:',
        },
        {
          type: 'list',
          items: [
            'Website enquiry, quotation, and newsletter records: retained while the relationship is active and thereafter for a period aligned with limitation periods and anti-fraud needs, typically up to five (5) years after last contact unless a longer period is required.',
            'Contracts, invoices, and accounting records: retained for the minimum periods required under Saudi commercial, tax, and Zakat/VAT rules, and in any event not less than the statutory bookkeeping period.',
            'Training enrolment and payment records: retained for the duration of the programme and thereafter as required for certification evidence, accounting, and legal claims.',
            'Recruitment records for unsuccessful applicants: retained for a limited period (typically up to twelve (12) months) unless you consent to a longer talent-pool retention or law requires otherwise.',
            'Project geospatial datasets and deliverables: retained as specified in the client contract. In the absence of a stated period, we retain working files for the warranty and defect-liability period and archive or securely destroy them thereafter, unless the client instructs longer retention or law requires it.',
            'Analytics session data: retained in identifiable form for a short operational window and then aggregated or deleted.',
            'Security logs: retained for a period sufficient for incident investigation, consistent with NCA-oriented logging practices.',
          ],
        },
        {
          type: 'paragraph',
          text: 'When retention expires, we securely delete, anonymise, or irreversibly aggregate the data, except where a legal hold, regulatory investigation, or unresolved dispute requires continued preservation.',
        },
      ],
    },
    {
      id: 'geospatial-privacy',
      title: '14. Drone Survey & Geospatial Data Privacy',
      blocks: [
        {
          type: 'paragraph',
          text: 'A core part of our business is the collection, processing, storage, and delivery of geospatial and remotely sensed data. This includes photogrammetry, LiDAR point clouds, orthophotos, digital surface and terrain models, bathymetric and underwater survey data, thermal and multispectral imagery, ultrasonic and magnetic readings, GPR radargrams, satellite imagery, inspection imagery, traffic-count video analytics, and derived GIS products.',
        },
      ],
      subsections: [
        {
          id: 'geospatial-purpose',
          title: '14.1 Purpose limitation',
          blocks: [
            {
              type: 'paragraph',
              text: 'Survey and inspection data are collected for the client’s documented purpose (for example, construction monitoring, asset integrity, environmental assessment, mapping, or security surveillance PoC) and for related quality, safety, and regulatory compliance. We do not use client project datasets for unrelated commercial products without the client’s written authorisation, except for internal training of our staff under confidentiality controls, or as required by law.',
            },
          ],
        },
        {
          id: 'geospatial-people',
          title: '14.2 Individuals appearing in survey data',
          blocks: [
            {
              type: 'paragraph',
              text: 'Aerial, terrestrial, and marine capture may incidentally include people, vehicles, or property. We do not operate a public facial-recognition service. Where a project is designed to detect persons or vehicles for a security or traffic-analytics purpose, processing is performed under the client’s instructions and applicable Saudi law, including PDPL rules on surveillance and, where required, notices at the site. Clients are responsible for ensuring they have a lawful basis and any required notices or permits for monitoring on their premises.',
            },
          ],
        },
        {
          id: 'geospatial-geosa',
          title: '14.3 GEOSA, classification, and distribution',
          blocks: [
            {
              type: 'paragraph',
              text: 'Collection, accuracy standards, metadata, storage, and distribution of geospatial information in the Kingdom are subject to GEOSA requirements and any applicable national mapping, coordinate-reference (including KSA-GRF / SANSRS where specified), and data-sharing rules. Certain categories of geospatial data may be restricted, classified, or subject to prior approval before copying, publishing, or transferring, including outside the Kingdom. We will not publish or commercially redistribute restricted geospatial data except as permitted by GEOSA, the client contract, and competent authorities.',
            },
          ],
        },
        {
          id: 'geospatial-gaca',
          title: '14.4 GACA and flight operations',
          blocks: [
            {
              type: 'paragraph',
              text: 'RPAS operations are conducted by GACA-authorised personnel in accordance with GACA regulations, approved operations manuals, insurance, and flight permissions. Imagery is captured only within the authorised operational envelope. We do not use drone operations to collect personal data covertly. Additional restrictions apply near airports, military and security sites, critical infrastructure, and special development zones such as NEOM, and we comply with applicable NOTAMs and airspace restrictions.',
            },
          ],
        },
        {
          id: 'geospatial-client',
          title: '14.5 Client instructions',
          blocks: [
            {
              type: 'paragraph',
              text: 'Where we process geospatial data solely on documented client instructions, the client is typically the controller of that project data and Shamal acts as a processor (or equivalent under the PDPL) for those datasets, while remaining controller of our own business records. Mixed roles are defined in the relevant contract. Clients must not instruct us to collect data in violation of Saudi law.',
            },
          ],
        },
      ],
    },
    {
      id: 'client-confidentiality',
      title: '15. Client Confidentiality',
      blocks: [
        {
          type: 'paragraph',
          text: 'We treat client identities, project scopes, site information, unpublished deliverables, and commercially sensitive correspondence as confidential, except where disclosure is required by law, necessary for subcontractors bound by confidentiality, already public through no fault of ours, or authorised by the client. Personnel and subcontractors with access to client data are subject to confidentiality obligations and need-to-know access.',
        },
        {
          type: 'paragraph',
          text: 'Public case studies, marketing imagery, or project references are used only with client permission or where the information is already lawfully public. Government, defence, energy, and critical-infrastructure projects may be subject to stricter non-disclosure and security-vetting requirements, which take precedence.',
        },
      ],
    },
    {
      id: 'ip-protection',
      title: '16. Intellectual Property Protection',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ownership of survey deliverables, software, methodologies, and website content is governed by our [Terms & Conditions](/terms-and-conditions) and the applicable client or supplier contract. In privacy terms, we protect intellectual property and trade secrets using the same access-control and confidentiality measures described in this Policy.',
        },
        {
          type: 'paragraph',
          text: 'Satellite imagery, DJI software, third-party GIS platforms, and manufacturer firmware remain subject to their licensors’ terms. We process licence-holder contact and order data as needed to fulfil authorised distribution and support, not to claim ownership of those third-party products.',
        },
      ],
    },
    {
      id: 'cybersecurity-measures',
      title: '17. Cybersecurity Measures',
      blocks: [
        {
          type: 'paragraph',
          text: 'Shamal maintains an information-security programme aligned with ISO 27001 and informed by NCA Essential Cybersecurity Controls and related guidelines. Measures include, as appropriate to the system and data classification:',
        },
        {
          type: 'list',
          items: [
            'Role-based access control, unique user accounts, and least-privilege administration of production systems.',
            'Encryption of data in transit (HTTPS/TLS) for the public website and supported services.',
            'Bot management, form protection, and monitoring for abusive traffic.',
            'Secure software development and change-control practices for our websites and internal tools.',
            'Backup, recovery, and incident-response procedures, including evaluation of notification duties under the PDPL and NCA incident-reporting expectations where a breach of personal data or a reportable cybersecurity incident occurs.',
            'Personnel awareness and confidentiality obligations.',
            'Physical and procedural controls for field operations, including custody of storage media used on survey aircraft and payloads.',
          ],
        },
        {
          type: 'paragraph',
          text: 'If we become aware of a personal-data breach that requires notification under the PDPL, we will notify SDAIA and affected individuals as required by law, and we will notify affected clients in accordance with the relevant contract.',
        },
      ],
    },
    {
      id: 'legal-disclosure',
      title: '18. Legal Disclosure Requirements',
      blocks: [
        {
          type: 'paragraph',
          text: 'We may disclose personal data, business records, or project data where we reasonably believe disclosure is required or permitted by Saudi law, including:',
        },
        {
          type: 'list',
          items: [
            'Orders of competent courts or enforcement authorities in the Kingdom.',
            'Lawful requests by SDAIA, MOC, CST, GEOSA, GACA, NCA, SAMA (in relation to payment investigations routed through licensed institutions), Zakat, Tax and Customs Authority, or other competent public authorities.',
            'Flight-safety, airspace, or national-security requirements administered by GACA or other authorised bodies.',
            'Establishment, exercise, or defence of legal claims, and professional advice in that context.',
            'Corporate transactions (merger, acquisition, or restructuring), subject to appropriate confidentiality and PDPL compliance.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Where legally permitted, we will notify the affected client or individual before disclosure. We will not disclose data in response to extra-territorial requests that conflict with Saudi law, except as required by a competent Saudi authority or a recognised legal process.',
        },
      ],
    },
    {
      id: 'contact-information',
      title: '19. Contact Information',
      blocks: [
        {
          type: 'paragraph',
          text: 'For questions about this Privacy Policy, PDPL requests, or cybersecurity notifications relating to personal data, please contact:',
        },
        {
          type: 'list',
          items: [
            `**${LEGAL_COMPANY.name}**`,
            LEGAL_COMPANY.address,
            `Email: [${LEGAL_COMPANY.email}](mailto:${LEGAL_COMPANY.email})`,
            `Telephone: ${LEGAL_COMPANY.phone}`,
            `Website: [shamal.sa](${LEGAL_COMPANY.website})`,
            'You may also use our [Contact](/contact) page.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Please mark PDPL correspondence with the subject "Personal Data Request" and cybersecurity incident notices with the subject "Security Incident".',
        },
      ],
    },
    {
      id: 'policy-updates',
      title: '20. Policy Updates',
      blocks: [
        {
          type: 'paragraph',
          text: `This Privacy Policy was last updated on **${LEGAL_LAST_UPDATED_DISPLAY}**. We may amend it to reflect changes in our operations, technology, or Saudi legal requirements (including PDPL, MOC, NCA, GEOSA, GACA, CST, and payment-related rules). The revised Policy will be posted on this page with an updated "Last Updated" date and, where required by law, we will provide additional notice.`,
        },
        {
          type: 'paragraph',
          text: 'Material changes that affect processing based on consent will be communicated in a manner appropriate to the relationship (for example, email to subscribers or a notice on the website). Continued use of the website after the effective date of an update constitutes acknowledgement of the revised Policy, except where applicable law requires a different form of acceptance.',
        },
        {
          type: 'paragraph',
          text: 'This Policy should be read together with our [Terms & Conditions](/terms-and-conditions), which govern contractual use of our website and services.',
        },
      ],
    },
  ],
}
