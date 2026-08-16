import {
  LEGAL_COMPANY,
  LEGAL_LAST_UPDATED_DISPLAY,
  LEGAL_LAST_UPDATED_ISO,
  type LegalDocument,
} from './types'

export const termsAndConditionsDocument: LegalDocument = {
  slug: 'terms-and-conditions',
  title: 'Terms & Conditions',
  badge: 'Legal',
  metaTitle: 'Terms & Conditions',
  metaDescription:
    'Terms and Conditions of Shamal Technologies for drone surveying, LiDAR, GIS, geospatial services, products, and training in Saudi Arabia, including GACA, GEOSA, MOC, PDPL, SARIE, and related compliance.',
  keywords: [
    'Shamal Technologies terms and conditions',
    'drone survey terms Saudi Arabia',
    'GACA drone service agreement',
    'geospatial services terms KSA',
    'MOC e-commerce terms',
  ],
  lastUpdated: LEGAL_LAST_UPDATED_DISPLAY,
  lastUpdatedIso: LEGAL_LAST_UPDATED_ISO,
  intro:
    'These Terms & Conditions ("Terms") govern access to the website [shamal.sa](https://shamal.sa) and the supply of products, training, and professional services by **Shamal Technologies** ("Shamal", "we", "us", or "our") in the Kingdom of Saudi Arabia. Please read them carefully. By browsing the website, submitting an enquiry or quotation request, placing an order, enrolling in training, or signing a proposal, purchase order, or statement of work, you accept these Terms. Our data practices are described in the [Privacy Policy](/privacy-policy).',
  related: { href: '/privacy-policy', label: 'Privacy Policy' },
  sections: [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      blocks: [
        {
          type: 'paragraph',
          text: 'These Terms form a legally binding agreement between you (the visitor, customer, trainee, or client) and Shamal Technologies. If you are accepting on behalf of a company or government entity, you represent that you have authority to bind that organisation. If you do not agree, you must not use the website or engage our services.',
        },
        {
          type: 'paragraph',
          text: 'A signed quotation, proposal, statement of work, framework agreement, purchase order accepted by us, or training checkout confirmation may contain additional commercial terms. In case of conflict, the signed project or order document prevails over these website Terms for that engagement, except that mandatory Saudi law cannot be contracted out of. These website Terms prevail over any customer-standard purchasing terms unless we have agreed otherwise in writing.',
        },
        {
          type: 'paragraph',
          text: 'We may update these Terms from time to time. The "Last Updated" date on this page is the effective date of the current version. Continued use of the website after an update constitutes acceptance of the revised Terms for website use. Existing signed contracts remain governed by the version incorporated into that contract unless the parties agree otherwise.',
        },
      ],
    },
    {
      id: 'company-overview',
      title: '2. Company Overview',
      blocks: [
        {
          type: 'paragraph',
          text: 'Shamal Technologies is a fully Saudi-owned geospatial and drone technology company headquartered in Jeddah. We deliver ground, aerial, and marine data acquisition, processing, visualisation, and analytics, and we supply selected enterprise drone systems, payloads, and satellite imagery products. We support Saudi Vision 2030 through local capability, GACA-authorised operations, and internationally recognised management systems.',
        },
        {
          type: 'list',
          items: [
            `Name: ${LEGAL_COMPANY.name}`,
            `Office: ${LEGAL_COMPANY.address}`,
            `Email: ${LEGAL_COMPANY.email}`,
            `Telephone: ${LEGAL_COMPANY.phone}`,
            `Website: ${LEGAL_COMPANY.website}`,
          ],
        },
        {
          type: 'paragraph',
          text: 'Our operations are legalised and conducted in accordance with GACA requirements. Remote pilots are GACA Part 107 certified and insured for third-party liability as applicable to the operation. We maintain ISO 9001, ISO 14001, ISO 45001, and ISO 27001 certifications, and our engineering staff include professionals registered with the Saudi Council of Engineers (SCE).',
        },
      ],
    },
    {
      id: 'scope-of-services',
      title: '3. Scope of Services',
      blocks: [
        {
          type: 'paragraph',
          text: 'Unless a signed document states otherwise, Shamal may provide some or all of the following, as agreed in writing:',
        },
        {
          type: 'list',
          items: [
            'Drone surveying and mapping, including aerial photogrammetry and topographic survey.',
            'LiDAR surveying and point-cloud production.',
            'Photogrammetry, orthophoto, DSM/DTM, mesh, and related mapping products.',
            'GIS, remote sensing, and spatial analytics.',
            'Construction monitoring and progress documentation, including BIM/GIS-compatible deliverables.',
            'Asset inspection and integrity support (visual, thermal, OGI, ultrasonic thickness, confined-space and hard-to-access assets).',
            'Environmental monitoring, including multispectral and related analyses.',
            'Bathymetric and underwater / mini-ROV survey and inspection.',
            'Agriculture monitoring, mining and exploration support, traffic count and analysis, and security-surveillance proofs of concept (including drone-in-a-box).',
            'AI application development and custom software related to geospatial and inspection workflows.',
            'Satellite imagery supply (mono, stereo, and tri-stereo) as an authorised distributor, subject to upstream licence terms.',
            'Sale or lease of DJI Enterprise drones, docks, payloads, and related professional equipment, as an authorised seller in the Kingdom.',
            'Shamal Academy training in drone technology, GIS, LiDAR, mapping, and surveying.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Website content, case studies, and marketing materials are illustrative. They do not constitute an offer to perform a specific project until we issue and you accept a written proposal or order. We may decline work that would violate Saudi law, our operations manual, insurance, or GACA/GEOSA constraints.',
        },
      ],
    },
    {
      id: 'drone-surveying-services',
      title: '4. Drone Surveying Services',
      blocks: [
        {
          type: 'paragraph',
          text: 'Drone (RPAS) services are performed by authorised personnel using company-approved aircraft and payloads. Typical outputs may include RGB imagery, orthomosaics, point clouds, meshes, thermal or multispectral datasets, inspection stills, and associated reports, as specified in the statement of work.',
        },
        {
          type: 'list',
          items: [
            'Mobilisation, flight planning, and on-site operations will follow our standard operating procedures, client HSE rules, and GACA permissions.',
            'Weather, airspace, GNSS conditions, dust, sandstorms, electromagnetic interference, and site activity may affect capture windows. Reasonable rescheduling is not a breach where caused by such conditions.',
            'Ground control, checkpoints, and survey control will be used as specified in the proposal. If the client elects reduced control, accuracy will be correspondingly limited (see Section 13).',
            'We may use multi-rotor, fixed-wing, VTOL, docked, or other approved systems (including DJI Matrice-class, Dock, Quantum Systems, and similar platforms in our inventory) as operationally appropriate.',
            'Specialised payloads (LiDAR, photogrammetric cameras, thermal, multispectral, OGI, UT, GPR, magnetic, and similar) are deployed only when included in the agreed scope.',
          ],
        },
        {
          type: 'paragraph',
          text: 'You acknowledge that RPAS operations are regulated activities. We will not fly in conditions or locations that our remote pilot in command, operations manager, or insurer reasonably considers unsafe or unauthorised.',
        },
      ],
    },
    {
      id: 'gis-geospatial-services',
      title: '5. GIS & Geospatial Services',
      blocks: [
        {
          type: 'paragraph',
          text: 'GIS, remote-sensing, CAD-to-BIM, and related office-based services include processing, classification, mapping, analytics, and visualisation of data captured by Shamal or supplied by you or third parties (including satellite imagery).',
        },
        {
          type: 'list',
          items: [
            'Coordinate reference systems, vertical datums, and accuracy specifications will follow the statement of work. Where the project requires KSA-GRF / SANSRS or other GEOSA-aligned references, you must state this at award.',
            'Client-supplied control, CAD, BIM, GIS, or imagery is assumed accurate unless we are contracted to validate it. Errors in client-supplied data may propagate into deliverables.',
            'Satellite products are licensed, not sold as unrestricted data. Use is limited to the licence parameters (area, duration, purpose, and number of seats or derivatives) imposed by the upstream provider and stated in the order.',
            'AI or automated classification outputs (for example vegetation indices, waste-pile detection, traffic counts, or defect suggestions) are decision-support tools. They require competent professional review before operational or safety-critical use.',
          ],
        },
      ],
    },
    {
      id: 'data-processing-deliverables',
      title: '6. Data Processing & Deliverables',
      blocks: [
        {
          type: 'paragraph',
          text: 'Deliverables are limited to the formats, resolutions, accuracies, and media specified in the accepted proposal. Typical professional deliverables may include orthophotos, point clouds, DSM/DTM, 3D meshes, GIS layers, inspection reports, thickness measurements, and structured findings. Drafts issued for comment are not final until we confirm in writing.',
        },
        {
          type: 'list',
          items: [
            'Acceptance: unless the contract states a different procedure, deliverables are deemed accepted ten (10) calendar days after delivery if you do not provide a written, specific notice of non-conformity with the agreed specification.',
            'Corrections: we will remedy non-conformities that we verify against the agreed specification at no additional charge. Changes in scope, additional sites, extra products, or new accuracy targets are variation work and may be charged.',
            'Third-party platforms: viewing portals, processing software, and cloud tiles used to inspect data may be provided by third parties and remain subject to their terms (see Section 23).',
            'Retention of working files follows the [Privacy Policy](/privacy-policy) and the contract. We may retain copies required for quality, insurance, and legal defence.',
          ],
        },
      ],
    },
    {
      id: 'project-execution',
      title: '7. Project Execution Terms',
      blocks: [
        {
          type: 'paragraph',
          text: 'Project dates are estimates based on information available at award and on timely client cooperation. Time is not of the essence unless expressly stated in the signed contract. We will perform with reasonable professional skill and care consistent with GACA-authorised RPAS operations and our ISO-certified management systems.',
        },
        {
          type: 'list',
          items: [
            'A project starts when we have received the required purchase order or signed acceptance, any agreed mobilisation payment, essential site information, and, where applicable, flight and site authorisations.',
            'We may stage work (planning, permissions, mobilisation, capture, processing, delivery) and invoice according to the payment schedule.',
            'Subcontractors and specialist partners (for example inspection software, traffic-analytics, or marine specialists) may be used under our responsibility and confidentiality controls.',
            'Variations must be agreed in writing (email is sufficient) before we are obliged to perform extra work.',
            'If you suspend or delay a project for more than thirty (30) days, we may invoice standing costs, remobilisation, and work performed to date, and we may revise rates and availability.',
          ],
        },
      ],
    },
    {
      id: 'client-responsibilities',
      title: '8. Client Responsibilities',
      blocks: [
        {
          type: 'paragraph',
          text: 'You agree to provide, at no cost to Shamal except as agreed in the proposal:',
        },
        {
          type: 'list',
          items: [
            'Accurate project requirements, site coordinates or maps, known hazards, underground services information as relevant, and existing control or design data.',
            'Timely decisions, comments on drafts, and nomination of an authorised project contact.',
            'Site access, escorts, permits that only the site owner or occupier can issue, inductions, and PPE rules (see Section 12).',
            'Disclosure of airspace, security, cultural-heritage, environmental, or community constraints known to you.',
            'A lawful basis for any monitoring that may capture persons, vehicles, or private property on your site, including notices required under the PDPL or client-site policy.',
            'Payment in accordance with Section 18 and Section 19.',
            'For product sales: a suitable delivery address in the Kingdom, import cooperation if applicable, and competent operators for equipment you purchase or lease.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Delays, standing time, abortive mobilisations, or re-flights caused by incomplete information, denied access, late permits that were your responsibility, or unsafe site conditions may be charged at our then-current rates.',
        },
      ],
    },
    {
      id: 'regulatory-compliance',
      title: '9. Regulatory Compliance',
      blocks: [
        {
          type: 'paragraph',
          text: 'Each party shall comply with Saudi laws applicable to its role. Shamal’s services are designed to operate within the following framework, as applicable to the engagement:',
        },
        {
          type: 'list',
          items: [
            'GACA regulations for RPAS and aerial work (see Sections 10 and 11).',
            'GEOSA requirements for geospatial data collection, standards, and distribution.',
            'PDPL and SDAIA rules for personal data, as described in our [Privacy Policy](/privacy-policy).',
            'MOC E-Commerce Law for online information, quotations, product, and training sales (see Section 27).',
            'CST requirements relevant to ICT, technology, and authorised communications or space-related data services.',
            'NCA cybersecurity guidelines applicable to our systems and, where contracted, to project delivery environments.',
            'SAMA principles applicable to electronic payments processed through licensed payment service providers, and SARIE rules applicable to Saudi Riyal interbank transfers (see Section 19).',
            'SCE professional engineering standards where engineering work is performed by registered engineers.',
            'Environmental, occupational health and safety, and labour rules applicable to field operations, supported by our ISO 14001 and ISO 45001 systems.',
          ],
        },
        {
          type: 'paragraph',
          text: 'You shall not request, and we shall not be obliged to perform, any activity that would violate these requirements, including unauthorised mapping of restricted areas, unlawful surveillance, or unlicensed distribution of protected geospatial data.',
        },
      ],
    },
    {
      id: 'gaca-compliance',
      title: '10. GACA Compliance Requirements',
      blocks: [
        {
          type: 'paragraph',
          text: 'All RPAS operations performed by Shamal are conducted under the regulatory authority of the General Authority of Civil Aviation. You acknowledge that:',
        },
        {
          type: 'list',
          items: [
            'Flights are performed only by qualified remote pilots holding applicable GACA Part 107 (or successor) certification and operating under Shamal’s approved procedures and insurance.',
            'Aircraft, payloads, and operations must remain within GACA authorisations, mass, equipment, and operational-category limits.',
            'We maintain third-party liability insurance appropriate to authorised operations. Certificates can be provided on request for a specific project.',
            'Safety of the aircraft, crew, public, and other airspace users is paramount. The remote pilot in command may delay, divert, or terminate a flight.',
            'Incident and occurrence reporting to GACA will be made where required, even if that involves operational facts about a client site, limited to what the regulation requires.',
            'Clients shall not interfere with crew decisions, request night, BVLOS, or restricted-area operations that are not authorised, or ask pilots to exceed duty, weather, or performance limits.',
          ],
        },
      ],
    },
    {
      id: 'flight-permissions',
      title: '11. Flight Permissions & Restrictions',
      blocks: [
        {
          type: 'paragraph',
          text: 'Where GACA, military, municipal, economic-zone, or site-owner permission is required, we will apply for or support applications as stated in the proposal. Permission lead times are outside our exclusive control. Work that depends on a permission will not commence until it is granted.',
        },
        {
          type: 'list',
          items: [
            'Restricted, prohibited, and danger areas, airport control zones, and NOTAM-restricted airspace will be respected.',
            'Operations near critical infrastructure, energy facilities, ports, and security installations require the site owner’s written access approval in addition to aviation permission.',
            'Special development regions (including NEOM and similar zones) may impose additional operational, data, and security rules, which will form part of the project constraints.',
            'Temporary flight restrictions, national events, weather minima, sandstorms, and GPS interference may suspend operations without liability for delay (see Section 14).',
            'You shall not film, publish, or redistribute flight paths, security layouts, or restricted geospatial products except as permitted by GACA, GEOSA, the site owner, and the contract.',
          ],
        },
      ],
    },
    {
      id: 'site-access',
      title: '12. Site Access Requirements',
      blocks: [
        {
          type: 'paragraph',
          text: 'You shall arrange safe, lawful access to all locations required for the services, including take-off and landing areas, ground-control points, inspection targets, marine launch points, and welfare facilities as reasonably needed.',
        },
        {
          type: 'list',
          items: [
            'Inductions, permits to work, confined-space or hot-work permits, escorting, and site-specific PPE are your (or the site operator’s) responsibility unless we have priced them as our scope.',
            'Our personnel will comply with reasonable HSE rules once inducted. We may refuse to work where conditions are unsafe, and such refusal is not a breach.',
            'You warrant that you are the owner or lawful occupier, or that you have authority from the owner/occupier, to permit survey and inspection of the site.',
            'Animals, moving plant, public roads, and live industrial processes must be managed by you so that RPAS and ground teams can operate safely.',
            'For marine and ROV work, berth access, vessel support, and diving/ROV constraints must be agreed before mobilisation.',
          ],
        },
      ],
    },
    {
      id: 'survey-accuracy-disclaimer',
      title: '13. Survey Accuracy Disclaimer',
      blocks: [
        {
          type: 'paragraph',
          text: 'Geospatial and inspection measurements are estimates derived from sensors, GNSS, photogrammetry, LiDAR, acoustics, and processing software. Achievable accuracy depends on factors including but not limited to: ground control density and quality, satellite geometry, vegetation, water surface, reflective or featureless surfaces, weather, dust, GNSS jamming, flying height, payload calibration, and client-requested time or budget constraints.',
        },
        {
          type: 'list',
          items: [
            'Quoted accuracies (for example centimetre-level mapping or 0.5–1.0 m satellite vertical figures) are typical performance under stated conditions, not an unconditional guarantee for every point in every dataset.',
            'Inspection findings identify visible or sensor-detectable indications at the time of survey. They are not a certification of structural fitness, a substitute for a licensed engineering or API/ASME inspection regime, or a warranty that latent defects do not exist.',
            'Volumetric, stockpile, traffic-count, NDVI, emissions, and AI-derived metrics include methodological uncertainty. Reported confidence (for example traffic-count accuracy bands) is statistical, not a guarantee of every event.',
            'You remain responsible for engineering design, construction tolerance decisions, navigation safety, and regulatory filings that use our data, unless we have separately accepted a stamped professional-engineering scope.',
          ],
        },
        {
          type: 'note',
          text: 'If a project requires a specific accuracy, it must be written into the statement of work together with the control scheme, check independent of the production process, and acceptance tests. Otherwise, deliverables are supplied on a professional best-efforts basis consistent with the methods described in the proposal.',
        },
      ],
    },
    {
      id: 'force-majeure',
      title: '14. Force Majeure',
      blocks: [
        {
          type: 'paragraph',
          text: 'Neither party is liable for delay or failure to perform caused by circumstances beyond its reasonable control, including: acts of God; sandstorms, extreme heat, flooding, or other severe weather; epidemic; war, terrorism, or civil unrest; government action, sanctions, or change of law; GACA or military airspace closures and NOTAMs; denial of flight or site permission by a competent authority; nationwide telecommunications or GNSS disruption; failure of utilities; fire; or labour disputes not limited to the affected party’s own workforce.',
        },
        {
          type: 'paragraph',
          text: 'The affected party shall give prompt notice and use reasonable efforts to mitigate. If force majeure continues for more than sixty (60) consecutive days, either party may terminate the unperformed portion of the engagement upon written notice, without liability except for payment of work satisfactorily performed and non-cancellable third-party costs (including satellite tasking or equipment already ordered). Payment obligations for amounts already due are not excused.',
        },
      ],
    },
    {
      id: 'intellectual-property',
      title: '15. Intellectual Property Rights',
      blocks: [
        {
          type: 'paragraph',
          text: 'Shamal and its licensors retain all intellectual property in our methodologies, flight procedures, software, website, trademarks (including the Shamal name and logo), training materials, and pre-existing tools. Third-party software, satellite licences, and manufacturer intellectual property remain with those owners.',
        },
        {
          type: 'paragraph',
          text: 'You retain intellectual property in client-supplied data, designs, and confidential information. You grant Shamal a limited licence to use that material solely to perform the services and to comply with law.',
        },
        {
          type: 'paragraph',
          text: 'Unless the contract says otherwise, you shall not copy, scrape, reverse engineer, or republish our website, training content, or proprietary processing workflows. You shall not remove trademarks or copyright notices from deliverables except as needed to integrate them into your internal systems.',
        },
      ],
    },
    {
      id: 'ownership-of-deliverables',
      title: '16. Ownership of Deliverables',
      blocks: [
        {
          type: 'paragraph',
          text: 'Upon full payment of all amounts due for the relevant engagement, and subject to third-party licences:',
        },
        {
          type: 'list',
          items: [
            'You receive a licence, or where the contract expressly states an assignment, the agreed rights in the project-specific deliverables (for example orthophotos, point clouds, and reports created uniquely for you).',
            'Until full payment, title and licence in unpaid deliverables remain with Shamal, and we may suspend access to portals or withhold files.',
            'Satellite imagery, commercial software, and manufacturer data remain licensed under their original terms; we pass through only the rights we are authorised to grant.',
            'We may retain and use de-identified methods, generic know-how, and residual skills. We will not reuse your identifiable project data for other clients without permission, except as required by law or as described in the [Privacy Policy](/privacy-policy).',
            'Marketing use of identifiable project imagery or client names requires your prior written consent, except where the information is already lawfully public.',
          ],
        },
        {
          type: 'paragraph',
          text: 'If the contract is silent, the default is a non-exclusive, non-transferable, perpetual licence for your internal business use in the Kingdom, not a sale of copyright, and not a right to resell raw datasets as a competing data product.',
        },
      ],
    },
    {
      id: 'confidentiality',
      title: '17. Confidentiality',
      blocks: [
        {
          type: 'paragraph',
          text: 'Each party shall keep confidential the other party’s non-public business, technical, and project information, and shall use it only to perform the contract or exercise rights under it. Disclosure is permitted to employees, insurers, professional advisers, and subcontractors who need to know and are bound by confidentiality, and to competent authorities as required by law (including GACA, GEOSA, NCA, SDAIA, and courts of the Kingdom).',
        },
        {
          type: 'paragraph',
          text: 'Confidentiality does not apply to information that is public (other than by breach), independently developed, or rightfully received from a third party without duty of confidence. Obligations continue for five (5) years after the engagement ends, and indefinitely for trade secrets and classified or security-sensitive geospatial data.',
        },
      ],
    },
    {
      id: 'payment-terms',
      title: '18. Payment Terms',
      blocks: [
        {
          type: 'paragraph',
          text: 'Prices are stated in Saudi Riyals (SAR) unless we agree another currency in writing. Quotations are invitations to treat and remain valid for the period stated on the quotation (or thirty (30) days if none is stated), excluding obvious errors.',
        },
        {
          type: 'list',
          items: [
            'Professional services: typically invoiced as mobilisation / mobilisation milestone, progress, and final delivery, as set out in the proposal. In the absence of a schedule, we may invoice monthly for work performed.',
            'Products (drones, payloads, docks, satellite orders): payment terms appear on the quotation. Equipment is not released until agreed payment is received, unless we grant credit in writing.',
            'Website product RFQs: submitting a quote cart is a request for a proposal, not an online purchase. No payment is taken on the RFQ form. After technical discussion we issue a commercial proposal; payment is arranged only after your approval, commonly via a secure STC Pay link from our sales team or by bank transfer.',
            'Training: Shamal Academy fees are payable as indicated at checkout or on the invoice. Training access may be withheld until payment is confirmed.',
            'Unless stated otherwise, invoices are due within fifteen (15) days of issue. Late amounts may accrue service charges at one percent (1%) per month or the maximum permitted by Saudi law, whichever is lower, plus reasonable collection costs.',
            'VAT and other taxes required by the Zakat, Tax and Customs Authority will be added where applicable. You shall provide a valid tax identification number on request.',
            'You are not entitled to set-off unless required by a final Saudi court judgment or we have agreed in writing.',
          ],
        },
      ],
    },
    {
      id: 'sarie-payments',
      title: '19. SARIE / Banking & Electronic Payment Clauses',
      blocks: [
        {
          type: 'paragraph',
          text: 'Shamal is not a bank or a SAMA-licensed payment institution. We receive and make commercial payments through licensed banks in the Kingdom and through licensed payment service providers. The following terms apply:',
        },
        {
          type: 'list',
          items: [
            '**Bank transfers:** Saudi Riyal payments should be made to the account stated on our invoice. Domestic SAR transfers between licensed banks in the Kingdom are typically processed via the Saudi Arabian Riyal Interbank Express (SARIE) system in accordance with SAMA and SARIE operating rules. Cut-off times, value dates, and return of misdirected funds follow the sending and receiving banks’ rules, not Shamal’s systems.',
            '**Payment references:** you must include the invoice or quotation number as the payment reference so we can allocate funds. We are not responsible for delays caused by missing references.',
            '**STC Pay / Amazon Payment Services:** where we issue a hosted checkout link, payment is processed by Amazon Payment Services (PayFort) and, where enabled, STC Pay, mada, or other methods offered on that page. Those providers apply their own terms, authentication (including 3-D Secure where required), and SAMA-aligned payment-security controls. We do not receive or store full card numbers.',
            '**Stripe:** selected training payments may be processed by Stripe. Stripe’s terms and privacy notice apply to the checkout session. We receive payment confirmation and limited transaction metadata, not full card PAN data.',
            '**Failed, cancelled, or charged-back payments:** the obligation to pay remains until we receive cleared funds. Chargebacks made without a valid contractual basis may be treated as a breach, and we may suspend services and recover the amount plus reasonable costs.',
            '**Refunds:** refunds, where due under Section 24, will be made by the original method where practicable, or by SARIE bank transfer to the account you nominate in writing. Refund timing depends on the bank or payment provider.',
            '**Anti-fraud and AML:** we and our banks/PSPs may request information to satisfy anti-money-laundering, counter-terrorist-financing, and sanctions screening. We may decline or reverse a payment if a licensed institution or competent authority so requires.',
            '**Currency:** unless agreed otherwise, all prices, invoices, and refunds are in SAR. Foreign-currency cards may incur issuer conversion fees that are outside our control.',
          ],
        },
        {
          type: 'paragraph',
          text: 'SAMA digital-business and consumer-protection principles apply to the licensed PSP or bank that processes the payment, not as if Shamal itself were a financial institution. We will cooperate reasonably with any payment investigation routed through those institutions.',
        },
      ],
    },
    {
      id: 'service-limitations',
      title: '20. Service Limitations',
      blocks: [
        {
          type: 'paragraph',
          text: 'The website and our services are provided for professional and business use in connection with projects in the Kingdom of Saudi Arabia, unless we agree otherwise. We do not warrant uninterrupted website availability. Maintenance, security events, or third-party outages may occur.',
        },
        {
          type: 'list',
          items: [
            'We do not provide manned aviation, licensed cadastral boundary determination unless expressly scoped, or legal surveying that must be signed by a licensed surveyor of a type we have not contracted to supply.',
            'We do not guarantee that a GACA, GEOSA, municipal, or client-site permission will be granted.',
            'Training completion does not by itself confer GACA remote-pilot licensing; official licences are issued only by the competent authority after its own requirements are met.',
            'Product availability, firmware, and manufacturer warranties for DJI and other equipment follow the manufacturer’s terms and authorised-seller programme rules.',
            'Chatbot and website content are informational and do not amend a signed contract.',
          ],
        },
      ],
    },
    {
      id: 'warranty-disclaimer',
      title: '21. Warranty Disclaimer',
      blocks: [
        {
          type: 'paragraph',
          text: 'To the maximum extent permitted by Saudi law, and except for (a) remedies expressly stated in the signed contract, (b) manufacturer warranties passed through on hardware, and (c) non-excludable statutory rights under the MOC E-Commerce Law or other mandatory consumer rules that apply to you as a consumer:',
        },
        {
          type: 'list',
          items: [
            'Services are provided with reasonable professional skill and care, not under an outcome warranty that a project will achieve a commercial, construction, or production target.',
            'The website, chatbot, and public information are provided "as is" without warranty of completeness or fitness for a particular purpose.',
            'We disclaim implied warranties of merchantability, fitness, and non-infringement to the extent they can lawfully be excluded.',
            'Third-party software, satellite data, and payment platforms are provided subject to their owners’ warranties only.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Nothing in these Terms excludes liability for fraud, gross negligence causing death or personal injury, or any liability that cannot be limited under the laws of the Kingdom of Saudi Arabia.',
        },
      ],
    },
    {
      id: 'limitation-of-liability',
      title: '22. Limitation of Liability',
      blocks: [
        {
          type: 'paragraph',
          text: 'Subject to the non-excludable liabilities in Section 21, Shamal’s total aggregate liability arising out of or in connection with a particular engagement, whether in contract, tort, or otherwise, shall not exceed the fees actually paid to Shamal for that engagement in the twelve (12) months preceding the claim (or SAR 50,000 for website-only use where no fees were paid).',
        },
        {
          type: 'paragraph',
          text: 'We are not liable for indirect, consequential, incidental, special, or punitive damages; loss of profit, revenue, goodwill, or data; construction delay liquidated damages payable by you to third parties; or cost of substitute services, except to the extent a Saudi court holds such exclusion unenforceable in the specific case.',
        },
        {
          type: 'paragraph',
          text: 'You shall indemnify Shamal against claims arising from: your breach of these Terms; unsafe or unauthorised site conditions you control; your instructions to capture or publish data in violation of PDPL, GACA, GEOSA, or third-party rights; and your use of deliverables beyond the agreed purpose or accuracy envelope.',
        },
      ],
    },
    {
      id: 'third-party-software',
      title: '23. Third-Party Software & Platforms',
      blocks: [
        {
          type: 'paragraph',
          text: 'Project delivery and our website may involve third-party software and platforms, including DJI flight and payload software, photogrammetry and LiDAR processing suites, GIS and BIM tools, inspection analytics, Vimeo, Google Maps, Cloudflare Turnstile, ClickUp, Stripe, and Amazon Payment Services / STC Pay. Your use of those products is subject to their end-user licence agreements and privacy notices.',
        },
        {
          type: 'paragraph',
          text: 'We are not responsible for outages, licence withdrawals, export-control restrictions, or firmware changes imposed by those vendors. Where a deliverable depends on a third-party licence that must be held by you (for example a GIS seat or satellite licence), you must maintain that licence.',
        },
      ],
    },
    {
      id: 'cancellation-refunds',
      title: '24. Cancellation & Refund Policy',
      blocks: [
        {
          type: 'paragraph',
          text: 'Cancellation rights depend on the type of engagement and on mandatory Saudi consumer rules where they apply.',
        },
      ],
      subsections: [
        {
          id: 'cancel-services',
          title: '24.1 Professional services and surveys',
          blocks: [
            {
              type: 'list',
              items: [
                'You may request cancellation in writing. We will stop further work where reasonably practicable.',
                'You shall pay for work performed, authorised third-party costs (including satellite tasking, specialised subcontractors, travel booked, and non-refundable permits), and a reasonable mobilisation or cancellation charge if crews or aircraft were allocated and cannot be redeployed.',
                'If we cancel for convenience (other than for your breach or force majeure), we will refund prepaid amounts for services not performed, less non-recoverable third-party costs already incurred with your prior agreement.',
                'If we cancel for your material breach (including non-payment or unsafe instructions), prepaid unperformed amounts may be applied to our damages and outstanding invoices.',
              ],
            },
          ],
        },
        {
          id: 'cancel-products',
          title: '24.2 Equipment and satellite products',
          blocks: [
            {
              type: 'paragraph',
              text: 'Configured drones, payloads, docks, and satellite tasking are often non-cancellable once ordered from the manufacturer or operator. Returns of unopened, unused equipment may be accepted only if the manufacturer authorised-seller programme and our quotation allow it, and may incur restocking and shipping costs. Opened, flown, or software-bound equipment is not returnable except for verified manufacturing defect under warranty or as required by mandatory law.',
            },
          ],
        },
        {
          id: 'cancel-training',
          title: '24.3 Training',
          blocks: [
            {
              type: 'paragraph',
              text: 'Training course fees are refundable only as stated on the course page or checkout confirmation. As a default, cancellations received at least fourteen (14) days before a scheduled instructor-led session may receive a refund minus any non-recoverable processing fees; later cancellations may be credited to a future session at our discretion. Self-paced digital content that has been accessed is non-refundable except where mandatory e-commerce cooling-off rights apply and the content has not been substantially consumed.',
            },
          ],
        },
        {
          id: 'cancel-ecommerce',
          title: '24.4 Mandatory e-commerce rights',
          blocks: [
            {
              type: 'paragraph',
              text: 'Where the MOC E-Commerce Law and its Implementing Regulation grant a consumer a mandatory right of withdrawal or refund for a distance contract, those rights apply according to their statutory scope, exceptions (including customised goods and digital content once performance has begun with consent), and time limits. Business-to-business survey contracts are not consumer distance sales.',
            },
          ],
        },
      ],
    },
    {
      id: 'dispute-resolution',
      title: '25. Dispute Resolution',
      blocks: [
        {
          type: 'paragraph',
          text: 'The parties shall first attempt in good faith to resolve disputes through negotiation between authorised representatives, commencing within fourteen (14) days of a written notice describing the dispute.',
        },
        {
          type: 'paragraph',
          text: 'If negotiation does not resolve the dispute within thirty (30) days (or such longer period as agreed), either party may submit the dispute to the competent courts of the Kingdom of Saudi Arabia as provided in Section 26. Nothing in this clause prevents either party from seeking urgent interim relief (including to protect flight safety, confidential geospatial data, or unpaid deliverables) from those courts.',
        },
        {
          type: 'paragraph',
          text: 'Consumer complaints relating to an e-commerce transaction may also be raised with the Ministry of Commerce through its published channels, without prejudice to the governing-law clause.',
        },
      ],
    },
    {
      id: 'governing-law',
      title: '26. Governing Law (Kingdom of Saudi Arabia)',
      blocks: [
        {
          type: 'paragraph',
          text: 'These Terms, the website, and all non-contractual obligations arising out of or in connection with them are governed by the laws of the Kingdom of Saudi Arabia, including Sharia principles as applied by Saudi courts, and applicable regulations issued by MOC, SDAIA, GACA, GEOSA, CST, NCA, SAMA (to the extent relevant to payments), and other competent authorities.',
        },
        {
          type: 'paragraph',
          text: 'The courts of Jeddah, Kingdom of Saudi Arabia, have exclusive jurisdiction, except that we may bring proceedings in any jurisdiction where you are established to recover unpaid fees or protect intellectual property. Mandatory consumer venue rules, where applicable, are respected.',
        },
        {
          type: 'paragraph',
          text: 'The Arabic language may be required for certain filings before Saudi authorities. These website Terms are issued in English. If we publish an Arabic version and there is a conflict, the Arabic version prevails for proceedings before Saudi courts to the extent required by Saudi law; otherwise the English version on this page prevails for website use.',
        },
      ],
    },
    {
      id: 'moc-compliance',
      title: '27. Ministry of Commerce Compliance',
      blocks: [
        {
          type: 'paragraph',
          text: 'In accordance with the E-Commerce Law and related MOC requirements for electronic stores and service providers, we provide the following information:',
        },
        {
          type: 'list',
          items: [
            `Service provider: ${LEGAL_COMPANY.name}, Kingdom of Saudi Arabia.`,
            `Address: ${LEGAL_COMPANY.address}`,
            `Electronic contact: ${LEGAL_COMPANY.email} | Telephone: ${LEGAL_COMPANY.phone}`,
            `Website: ${LEGAL_COMPANY.website}`,
            'Nature of online activity: information about professional geospatial and drone services; requests for quotations for products and services; authorised sale/lease of enterprise drone equipment; satellite imagery licensing; and training enrolment.',
            'Contract formation: website RFQs and contact forms are invitations to commence commercial discussion. A binding supply contract is formed when we accept your written order or you accept our proposal (including by issuing a purchase order we confirm, completing a hosted payment for an agreed amount, or signing a statement of work).',
            'Prices: professional services and configured equipment are quoted individually. Displayed marketing information is not a binding public tariff unless expressly marked as a fixed offer.',
            'Taxes: applicable VAT will be identified on invoices in accordance with ZATCA rules.',
            'Payment methods: SARIE bank transfer to our invoiced account; STC Pay / Amazon Payment Services hosted checkout; and Stripe for selected training payments.',
            'Complaints: email [hello@shamal.sa](mailto:hello@shamal.sa) or use the [Contact](/contact) page. MOC consumer channels remain available where the E-Commerce Law applies.',
            'Data: processing of personal data is described in the [Privacy Policy](/privacy-policy), in line with the PDPL.',
          ],
        },
      ],
    },
    {
      id: 'contact-information',
      title: '28. Contact Information',
      blocks: [
        {
          type: 'paragraph',
          text: 'For questions about these Terms, contracts, payments, or complaints:',
        },
        {
          type: 'list',
          items: [
            `**${LEGAL_COMPANY.name}**`,
            LEGAL_COMPANY.address,
            `Email: [${LEGAL_COMPANY.email}](mailto:${LEGAL_COMPANY.email})`,
            `Telephone: ${LEGAL_COMPANY.phone}`,
            'Contact form: [/contact](/contact)',
            'Related document: [Privacy Policy](/privacy-policy)',
          ],
        },
        {
          type: 'paragraph',
          text: `These Terms were last updated on **${LEGAL_LAST_UPDATED_DISPLAY}**.`,
        },
      ],
    },
  ],
}
