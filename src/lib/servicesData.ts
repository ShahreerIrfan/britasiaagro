export interface PipelineStep {
  stepNumber: number;
  stepTag: string;
  title: string;
  desc: string;
  image: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  desc: string;
  image: string;
  category: "agro" | "commodities" | "steel";
  badge: string;
  breed?: string | null;
  farmingMethod?: string | null;
  processingMethod?: string | null;
  packaging?: string | null;
  certifications?: string | null;
  logistics?: string | null;
  step1Image?: string | null;
  step2Image?: string | null;
  step3Image?: string | null;
  step4Image?: string | null;
  step5Image?: string | null;
  isActive?: boolean;
  order?: number;
}

export const fallbackServices: ServiceItem[] = [
  {
    id: "cattle-beef",
    slug: "cattle-farming-beef",
    name: "Cattle Farming, Processing & Export Division",
    desc: "Commercial cattle feedlot fattening, 100% certified Halal abattoir dressing, individual RFID traceability, and cryogenic cold-chain beef export.",
    image: "/services/cattle/primary.jpg",
    category: "agro",
    badge: "Agro Livestock",
    breed: "American Brahman Crosses (heat-tolerant, disease-resilient genetics optimized for lean muscle and superior marbling)",
    farmingMethod: "90–120 Day feedlot finishing with computerized Total Mixed Ration (TMR) feeding, automated clean water, and individual RFID ear-tag monitoring",
    processingMethod: "Medical-grade stainless-steel Halal abattoir with overhead monorail dressing, 0°C to 2°C rapid carcass chilling, and -40°C cryogenic blast freezing",
    packaging: "Vacuum skin packaging (VSP), prime cuts (Ribeye, Tenderloin, Striploin, Chops), and heavy-duty 5-ply export master cartons",
    certifications: "100% Halal Certified (Islamic Foundation), HACCP & GMP certified abattoir, ISO 22000, and DLS Veterinary Health Clearance",
    logistics: "40ft High-Cube Super Reefer (-20°C to -25°C) continuous temperature telematics via Chattogram/Mongla ports directly to UK, Europe, and GCC markets",
    step1Image: "/services/cattle/step1.jpg",
    step2Image: "/services/cattle/step2.jpg",
    step3Image: "/services/cattle/step3.jpg",
    step4Image: "/services/cattle/step4.jpg",
    step5Image: "/services/cattle/step5.jpg",
    order: 1,
    isActive: true,
  },
  {
    id: "dairy-milk",
    slug: "commercial-dairy-farming",
    name: "Commercial Dairy Farming & Hygienic Milk Division",
    desc: "Selective dairy herd breeding, continuous rotary milking platform, rapid 4°C plate chilling, pasteurization, and aseptic dairy distribution.",
    image: "/services/dairy/primary.jpg",
    category: "agro",
    badge: "Dairy & Milk",
    breed: "Holstein Friesian & Sahiwal Crosses (selected for maximum lactation yield, disease hardiness, and 3.8%–4.2% butterfat)",
    farmingMethod: "Automated 40-stall continuous rotary milking parlor with automatic cluster removers (ACR), electronic milk meters, and free-stall ventilated housing",
    processingMethod: "Rapid plate chilling from 37°C to under 4°C within 15 minutes of milking; automated Clean-In-Place (CIP) chemical sanitation between cycles",
    packaging: "Hermetically heat-sealed VFFS liquid milk pouches, traditional clarified butter (Ghee) jars, artisanal cheese blocks, and export bulk dairy powder",
    certifications: "ISO 22000 Food Safety, HACCP, Somatic Cell Count (SCC) tested, and zero chemical/antibiotic residue validation",
    logistics: "Dedicated insulated stainless-steel road tankers and temperature-controlled reefer fleet operating at constant 2°C to 4°C",
    step1Image: "/services/dairy/step1.jpg",
    step2Image: "/services/dairy/step2.jpg",
    step3Image: "/services/dairy/step3.jpg",
    step4Image: "/services/dairy/step4.jpg",
    step5Image: "/services/dairy/step5.jpg",
    order: 2,
    isActive: true,
  },
  {
    id: "goat-mutton",
    slug: "goat-farming-halal-mutton",
    name: "Goat Farming, Mutton Processing & Export Division",
    desc: "Purebred Black Bengal goat breeding on elevated slatted housing, certified Islamic Halal butchering, and fresh chilled mutton air-freighted to GCC destinations.",
    image: "/services/goat/primary.jpg",
    category: "agro",
    badge: "Small Ruminants",
    breed: "World-Famous Purebred Black Bengal Goat (globally revered for tender, sweet culinary profile, ultra-fine muscle grain, and low intramuscular fat)",
    farmingMethod: "Raised slatted-floor sheds (মাচা পদ্ধতি) for zero-damp biosecurity, rotational pasture grazing supplemented with farm-milled protein legumes and Napier grass",
    processingMethod: "100% Halal slaughtering by certified Muslim slaughtermen with individual animal blessing (Tasmiyah), overhead stainless monorail, and 0°C to 2°C chill stabilization",
    packaging: "Targeted 12–16 kg whole carcasses, vacuum-packed primal cuts, chops, shanks, diced curry cuts with digital batch QR code traceability",
    certifications: "Certified Halal Attestation, HACCP compliant slaughter line, DLS disease-free quarantine certificate, and zero non-therapeutic antibiotics",
    logistics: "Daily chilled air-freight cargo flights (0°C to 2°C) to Dubai, Doha, and Riyadh; plus containerized maritime reefer shipments",
    step1Image: "/services/goat/step1.jpg",
    step2Image: "/services/goat/step2.jpg",
    step3Image: "/services/goat/step3.jpg",
    step4Image: "/services/goat/step4.jpg",
    step5Image: "/services/goat/step5.jpg",
    order: 3,
    isActive: true,
  },
  {
    id: "chicken-poultry",
    slug: "chicken-poultry-processing",
    name: "Chicken & Poultry Processing Division",
    desc: "Climate-controlled tunnel-ventilated housing, automated evisceration, certified zero-antibiotic diet, and -40°C cryogenic IQF blast-frozen Grade-A chicken portions.",
    image: "/services/poultry/primary.jpg",
    category: "agro",
    badge: "Poultry & Avian",
    breed: "Commercial Broiler & Sonali Strains (calibrated live weight targeting 1.6–2.0 kg for uniform Grade-A cut portions)",
    farmingMethod: "Tunnel-ventilated sheds with evaporative cooling pads, computerized microclimate regulation, closed nipple drinkers, and automated pan feeding",
    processingMethod: "Automated defeathering, sanitary evisceration, washing, and continuous Individual Quick Freezing (IQF) blast tunnel freezing (-40°C core lock under 18 minutes)",
    packaging: "Skinless boneless breast fillets, drumsticks, leg quarters, wingettes, and whole grillers in MAP gas-flushed trays and export master boxes",
    certifications: "HACCP & GMP Certified, ISO 22000, Islamic Foundation Halal Certified, and batch laboratory PCR screening for Salmonella and E. coli",
    logistics: "GPS live-telemetered subzero insulated reefers maintaining continuous -18°C from farm dispatch to destination ports",
    step1Image: "/services/poultry/step1.jpg",
    step2Image: "/services/poultry/step2.jpg",
    step3Image: "/services/poultry/step3.jpg",
    step4Image: "/services/poultry/step4.jpg",
    step5Image: "/services/poultry/step5.jpg",
    order: 4,
    isActive: true,
  },
  {
    id: "duck-avian",
    slug: "duck-farming-processing",
    name: "Duck Farming & Avian Processing Division",
    desc: "Free-range foraging in natural Haor wetland pastures, natural aquatic nutrition, specialized wax defeathering, and calibrated whole export ducks.",
    image: "/services/duck/primary.jpg",
    category: "agro",
    badge: "Waterfowl Division",
    breed: "Indigenous Nageswari & White Pekin Waterfowl (lean, firm muscle texture with high mineral and natural iron content)",
    farmingMethod: "Designated bio-secure wetland grazing reserves in Sylhet/Sunamganj Haor basins with predator fencing, night-shelter housing, and natural snail/crustacean forage",
    processingMethod: "Specialty waterfowl abattoir featuring wax defeathering line for intact skin preservation, evisceration, and -35°C blast chilling",
    packaging: "Vacuum skin packaging, whole oven-ready calibrated carcasses, and blast-frozen export master cartons tailored for Chinese & European culinary trade",
    certifications: "Avian influenza continuous screening, ISO 22000, Halal certified, and Department of Livestock Services health endorsement",
    logistics: "Multimodal maritime reefer ocean dispatch from Chattogram port to UK, Europe, and international hotel/restaurant chains",
    step1Image: "/services/duck/step1.jpg",
    step2Image: "/services/duck/step2.jpg",
    step3Image: "/services/duck/step3.jpg",
    step4Image: "/services/duck/step4.jpg",
    step5Image: "/services/duck/step5.jpg",
    order: 5,
    isActive: true,
  },
  {
    id: "aquaculture-fish",
    slug: "aquaculture-fish-farming",
    name: "Fish Farming & Aquaculture Processing Division",
    desc: "Scientific aerated freshwater earthen ponds, probiotic limnological management, automated filleting, Modified Atmosphere Packaging (MAP), and EU/US-FDA compliance.",
    image: "/services/fish/primary.jpg",
    category: "agro",
    badge: "Fisheries & Marine",
    breed: "GIFT Tilapia (Oreochromis niloticus), Pangasius, Rohu (Labeo rohita), Black Tiger & Vannamei Shrimp",
    farmingMethod: "Engineered earth-embankment pond networks with continuous mechanical paddlewheel aeration (DO > 5.5 mg/L) and 100% dry-out sanitation between harvests",
    processingMethod: "HACCP certified filleting line: high-speed de-heading, filleting, skinning, pin-bone removal, rapid slurry ice chilling, and -40°C IQF freezing",
    packaging: "Modified Atmosphere Packaging (CO2/N2 gas flush MAP trays), vacuum skin thermoformed packs, and ice-glazed export cartons",
    certifications: "EU and US-FDA Seafood HACCP Compliance, ISO 22000, zero antibiotic/malachite green residue assays, and traceability barcodes",
    logistics: "Contracted priority berth windows at Chattogram and Mongla deep-water container terminals with direct liner sailings to Europe and the UK",
    step1Image: "/services/fish/step1.jpg",
    step2Image: "/services/fish/step2.jpg",
    step3Image: "/services/fish/step3.jpg",
    step4Image: "/services/fish/step4.jpg",
    step5Image: "/services/fish/step5.jpg",
    order: 6,
    isActive: true,
  },
  {
    id: "agro-feed-mill",
    slug: "agro-feed-mill-plant",
    name: "Automated Agro Feed Milling Plant",
    desc: "Dedicated animal nutrition formulation, high-temperature steam conditioning, and computerized extrusion ensuring 100% antibiotic-free feed security.",
    image: "/services/sustainable-farmland.png",
    category: "agro",
    badge: "Upstream Nutrition",
    breed: "Calibrated feed diets for Ruminants (Cattle/Goats), Poultry (Broilers/Layers/Ducks), and Aquaculture (Floating pellets)",
    farmingMethod: "Computerized micro-ingredient batching matching exact life-stage protein and energy curves; zero animal by-product policy",
    processingMethod: "High-temperature steam conditioning extrusion neutralizing anti-nutritional factors, biological contaminants, and pathogenic bacteria",
    packaging: "Heavy-duty 25 kg & 50 kg moisture-barrier woven polypropylene bags with inner poly lining and automated robotic palletizing",
    certifications: "GMP+ Feed Safety Assurance, ISO 9001:2015, Department of Fisheries & Livestock regulatory approval",
    logistics: "Bulk pneumatic tanker distribution and palletized container freight to regional commercial farms and export partners",
    order: 7,
    isActive: true,
  },
  {
    id: "cold-chain-logistics",
    slug: "cold-chain-logistics",
    name: "Subzero Cold-Chain & Reefer Shipping",
    desc: "5,000+ MT high-bay -22°C automated cold storage, real-time IoT temperature telemetry, and global 40ft High-Cube super reefer maritime logistics.",
    image: "/services/sustainable-farmland.png",
    category: "agro",
    badge: "Cold-Chain Export",
    breed: "Multimodal logistics infrastructure serving fresh chilled (0°C to 4°C) and deep-frozen (-18°C to -40°C) agro commodities",
    farmingMethod: "Smart IoT central operations command: 24/7 wireless temperature, humidity, and ammonia sensor logging with automated failover generator banks",
    processingMethod: "Subzero high-bay multi-tier automated racking, inflatable dock airlock shelters preventing ambient condensation, and FIFO barcode lot tracking",
    packaging: "ISO/PAS 17712 certified high-security digital bolt seals with tamper-evident RFID chips logging container lock times and coordinates",
    certifications: "GDP (Good Distribution Practice), ISO 22000, Clean Ocean Bill of Lading with temperature rider attestation",
    logistics: "Direct carrier contracts to Felixstowe (UK), Rotterdam (EU), and Jebel Ali (GCC) with <12 hours seaport terminal dwell guarantee",
    order: 8,
    isActive: true,
  },
  {
    id: "qa-laboratory",
    slug: "agro-qa-laboratory",
    name: "Central QA Diagnostic & Testing Lab",
    desc: "ISO 17025 compliant diagnostic testing, real-time PCR microbiology assays, veterinary pathology screening, and statutory export compliance.",
    image: "/services/sustainable-farmland.png",
    category: "agro",
    badge: "Quality Assurance",
    breed: "Cross-vertical testing across Livestock, Dairy, Poultry, Waterfowl, Aquaculture, and Animal Nutrition inputs",
    farmingMethod: "Batch-by-batch farm sampling, water limnology testing, and routine feed microbiological profiling",
    processingMethod: "Automated PCR thermocyclers, mass spectrometry, pathogen culturing (Salmonella, E. coli, Listeria), and heavy metal/pesticide screening",
    packaging: "Digital tamper-proof Certificate of Analysis (CoA) issued per export container batch with verified QR code validation",
    certifications: "ISO 17025 Laboratory Accreditation, ISO 22000, Islamic Foundation Halal verification, and DLS Veterinary endorsement",
    logistics: "Fast-track 24-hour pre-shipment clearance and independent inspection coordination with SGS and Bureau Veritas",
    order: 9,
    isActive: true,
  },
  {
    id: "grocery",
    slug: "grocery",
    name: "Fresh Grocery & Grains",
    desc: "High-grade bulk rice, pulses, wheat, and essential food staples sourced from verified farming belts with strict quality grading.",
    image: "/services/fresh-grocery.png",
    category: "commodities",
    badge: "Bulk Commodities",
    breed: "Premium Basmati & Non-Basmati Rice, Red Lentils, Milling Wheat, and Yellow Peas",
    farmingMethod: "Direct farm-gate aggregation and contracted cooperative farming in prime agro belts",
    processingMethod: "Automated destoning, optical color sorting, polishing, and moisture-controlled aeration",
    packaging: "25 kg / 50 kg PP woven bags, non-woven jute bags, and bulk container liner stuffing",
    certifications: "BSTI Certified, Phytosanitary Certificate, SGS Pre-shipment Inspection",
    logistics: "Bulk vessel chartering and 20ft/40ft dry container freight worldwide",
    order: 10,
    isActive: true,
  },
  {
    id: "sugar",
    slug: "sugar",
    name: "Pure Sugar",
    desc: "Clean refined cane sugar and raw crystal sugar meeting stringent ICUMSA 45 food-grade specifications for industrial and retail use.",
    image: "/services/pure-sugar.png",
    category: "commodities",
    badge: "Bulk Commodities",
    breed: "Cane Sugar (ICUMSA 45 Refined White & VHP Raw Sugar)",
    farmingMethod: "Sustainable sugarcane agriculture and mill-direct contract sourcing",
    processingMethod: "Multi-stage carbonatation, filtration, crystallization, and magnetic separation",
    packaging: "50 kg multi-wall poly-lined kraft bags and 1,000 kg jumbo sling bags",
    certifications: "ISO 22000, Halal Certified, Non-GMO verification, Certificate of Weight & Quality",
    logistics: "Breakbulk shipments and 20ft FCL container loads with moisture desiccants",
    order: 11,
    isActive: true,
  },
  {
    id: "spices",
    slug: "spices",
    name: "Natural Spices",
    desc: "Aromatic whole and ground turmeric, chili, coriander, ginger, and cumin rich in natural essential oils and authentic culinary aroma.",
    image: "/services/natural-spices.png",
    category: "commodities",
    badge: "Bulk Commodities",
    breed: "Curcuma longa (Turmeric), Capsicum annuum (Red Chili), Coriandrum sativum, Zingiber officinale",
    farmingMethod: "Sun-dried farm harvest and pesticide-monitored cultivation in organic-certified tracts",
    processingMethod: "Cryogenic spice milling, steam sterilization, and optical sorting for zero impurities",
    packaging: "Vacuum-sealed 10 kg aluminium foil bags and 25 kg export master kraft cartons",
    certifications: "Spice Board Quality Mark, ISO 22000, US-FDA registered, Aflatoxin-free assay",
    logistics: "Moisture-locked air-tight container stuffing for sea and air freight global delivery",
    order: 12,
    isActive: true,
  },
  {
    id: "hms",
    slug: "hms",
    name: "HMS 1&2 Heavy Melting Scrap",
    desc: "Premium ferrous scrap conforming to ISRI 200–206 standards for electric arc furnace (EAF) and induction steel manufacturing.",
    image: "/services/industrial-steel.png",
    category: "steel",
    badge: "Steel & Metals",
    breed: "Heavy Melting Steel Scrap (HMS 1: 80% min 1/4 inch thickness; HMS 2: 20% min 1/8 inch thickness)",
    farmingMethod: "Industrial demolition and maritime shipyard recycling with non-ferrous impurity segregation",
    processingMethod: "Hydraulic shear cutting, torch sizing, magnetic separation, and radiation level scanning",
    packaging: "Loose bulk container stuffing (25–28 MT per 20ft container) or bulk vessel cargo",
    certifications: "Radiation-Free Certificate, Pre-Shipment Inspection Certificate (PSIC), ISRI 200–206 Compliance",
    logistics: "FOB/CIF international shipping with draft survey and weighbridge attestation",
    order: 13,
    isActive: true,
  },
  {
    id: "steel",
    slug: "steel",
    name: "Strong Steel & Rebars",
    desc: "High-tensile deformed rebar (500W / Grade 60/75/80), prime billets, and structural coils engineered for mega infrastructure projects.",
    image: "/services/industrial-steel.png",
    category: "steel",
    badge: "Steel & Metals",
    breed: "Thermo-Mechanically Treated (TMT) 500W / 500D Rebar, B500B, ASTM A615 Grade 60/75, Prime Steel Billets",
    farmingMethod: "State-of-the-art electric arc furnace (EAF) and ladle refining furnace (LRF) secondary metallurgy",
    processingMethod: "Thermex / QST quenching and self-tempering process for high elongation, ductility, and bendability",
    packaging: "Standard 2–5 MT mill bundles strapped with high-tensile steel bands with barcode heat tags",
    certifications: "BDS ISO 6935-2, ASTM A615, BS 4449, Mill Test Certificate (MTC EN 10204 3.1)",
    logistics: "Heavy flatbed trailer inland transit and chartered breakbulk vessels for export ports",
    order: 14,
    isActive: true,
  },
  {
    id: "fertilizer",
    slug: "fertilizer",
    name: "Quality Fertilizer",
    desc: "Balanced granular Urea, DAP, MOP, and enriched organic compost supporting sustainable soil fertility and high crop yield.",
    image: "/services/quality-fertilizer.png",
    category: "agro",
    badge: "Agriculture",
    breed: "Granular Urea (46% N), Di-Ammonium Phosphate (DAP 18-46-0), Muriate of Potash (MOP 60% K2O), Bio-Organic Compost",
    farmingMethod: "Chemical synthesis and controlled microbial aerobic composting of agricultural biomass",
    processingMethod: "High-pressure prilling/granulation, anti-caking surface treatment, and uniform grain sizing (2–4 mm)",
    packaging: "50 kg anti-skid moisture-proof laminated woven polypropylene bags",
    certifications: "Fertilizer Inspection Certificate, ISO 9001, Heavy Metal Safety Assay (Cadmium/Lead within safe limits)",
    logistics: "Bulk hopper wagons, river barges, and containerized transport to regional distribution hubs",
    order: 15,
    isActive: true,
  },
  {
    id: "agro",
    slug: "agro",
    name: "Agro Corporate Division",
    desc: "Comprehensive vertically integrated agro-farming, processing, cold-chain logistics, and global export solutions.",
    image: "/services/sustainable-farmland.png",
    category: "agro",
    badge: "Agriculture",
    breed: "Integrated Livestock, Dairy, Poultry, Waterfowl & Freshwater Aquaculture Verticals",
    farmingMethod: "Bio-secure commercial husbandry, precision animal nutrition, and continuous veterinary supervision",
    processingMethod: "Certified Halal abattoir infrastructure, cryogenic blast freezing (-40°C), and MAP protective packaging",
    packaging: "Export-grade vacuum skin packaging, hermetic sealing, and heavy-duty 5-ply cartons",
    certifications: "HACCP, GMP, ISO 22000, Islamic Foundation Halal Certified, DLS Official Clearance",
    logistics: "Unbroken subzero reefer ocean and air freight to UK, Europe, and GCC destinations",
    order: 16,
    isActive: true,
  },
];

// Helper to get 5-step pipeline matching attached image-01
export function getServicePipelineSteps(service: ServiceItem): PipelineStep[] | null {
  const s = service.slug;

  if (s === "cattle-farming-beef") {
    return [
      {
        stepNumber: 1,
        stepTag: "➔ STEP 1: FARMING",
        title: "Pastoral Cattle Grazing",
        desc: "Healthy American Brahman cattle grazing on natural green grass pastures.",
        image: service.step1Image || "/services/cattle/step1.jpg",
      },
      {
        stepNumber: 2,
        stepTag: "➔ STEP 2: PROCESSING",
        title: "Hygienic Abattoir",
        desc: "Sanitary meat preparation, carcass dressing & precision cut calibration.",
        image: service.step2Image || "/services/cattle/step2.jpg",
      },
      {
        stepNumber: 3,
        stepTag: "➔ STEP 3: PACKAGING",
        title: "Export Packaging",
        desc: "Vacuum skin packaging & blast-frozen export master carton packing.",
        image: service.step3Image || "/services/cattle/step3.jpg",
      },
      {
        stepNumber: 4,
        stepTag: "➔ STEP 4: MARITIME EXPORT & SHIPPING",
        title: "Global Reefer Ocean Shipping",
        desc: "Active vessel loading & temperature-locked reefer logistics to international ports.",
        image: service.step4Image || "/services/cattle/step4.jpg",
      },
      {
        stepNumber: 5,
        stepTag: "➔ STEP 5: CULINARY APPLICATION",
        title: "Gourmet Beef Steak",
        desc: "Succulent, tender prime ribeye beef steak served in fine restaurants.",
        image: service.step5Image || "/services/cattle/step5.jpg",
      },
    ];
  }

  if (s === "commercial-dairy-farming") {
    return [
      {
        stepNumber: 1,
        stepTag: "➔ STEP 1: FARMING",
        title: "Pastoral Dairy Grazing",
        desc: "High-yield Holstein & Sahiwal dairy cattle grazing on nutrient-rich pasture with modern free-stall barns.",
        image: service.step1Image || "/services/dairy/step1.jpg",
      },
      {
        stepNumber: 2,
        stepTag: "➔ STEP 2: PROCESSING",
        title: "Hygienic Milk Processing",
        desc: "Sanitary stainless-steel pasteurization, homogenization, rapid plate chilling & CIP automated systems.",
        image: service.step2Image || "/services/dairy/step2.jpg",
      },
      {
        stepNumber: 3,
        stepTag: "➔ STEP 3: PACKAGING",
        title: "Liquid Milk Pouch Packaging",
        desc: "Automated vertical form-fill-seal (VFFS) pouch packaging line with precise volumetric filling & hermetic heat sealing.",
        image: service.step3Image || "/services/dairy/step3.jpg",
      },
      {
        stepNumber: 4,
        stepTag: "➔ STEP 4: MARITIME EXPORT & SHIPPING",
        title: "Global Reefer Ocean Shipping",
        desc: "Active vessel loading & temperature-locked reefer logistics to international destination ports.",
        image: service.step4Image || "/services/dairy/step4.jpg",
      },
      {
        stepNumber: 5,
        stepTag: "➔ STEP 5: CULINARY APPLICATION",
        title: "Artisanal Dairy Delicacies",
        desc: "Pure fresh milk, clarified butter (Ghee), artisanal cheeses & gourmet dairy desserts served in dining.",
        image: service.step5Image || "/services/dairy/step5.jpg",
      },
    ];
  }

  if (s === "goat-farming-halal-mutton") {
    return [
      {
        stepNumber: 1,
        stepTag: "➔ STEP 1: FARMING",
        title: "Black Bengal Grazing",
        desc: "Free-range grazing & ethical herd management in lush rural pastures.",
        image: service.step1Image || "/services/goat/step1.jpg",
      },
      {
        stepNumber: 2,
        stepTag: "➔ STEP 2: PROCESSING",
        title: "Hygienic Abattoir",
        desc: "Precision portioning, carcass dressing & certified Halal butchering.",
        image: service.step2Image || "/services/goat/step2.jpg",
      },
      {
        stepNumber: 3,
        stepTag: "➔ STEP 3: PACKAGING",
        title: "Vacuum Export Packing",
        desc: "Sanitary vacuum sealing & temperature-monitored boxed export cuts.",
        image: service.step3Image || "/services/goat/step3.jpg",
      },
      {
        stepNumber: 4,
        stepTag: "➔ STEP 4: MARITIME EXPORT & SHIPPING",
        title: "Global Reefer Ocean Shipping",
        desc: "Active vessel loading & temperature-locked reefer logistics to GCC and global markets.",
        image: service.step4Image || "/services/goat/step4.jpg",
      },
      {
        stepNumber: 5,
        stepTag: "➔ STEP 5: CULINARY APPLICATION",
        title: "Gourmet Mutton Dish",
        desc: "Herb-crusted roasted tender mutton chops & gourmet braised ribs.",
        image: service.step5Image || "/services/goat/step5.jpg",
      },
    ];
  }

  if (s === "chicken-poultry-processing") {
    return [
      {
        stepNumber: 1,
        stepTag: "➔ STEP 1: FARMING",
        title: "Biosecure Farm Shed",
        desc: "Environment-controlled automated poultry houses with balanced organic feeding.",
        image: service.step1Image || "/services/poultry/step1.jpg",
      },
      {
        stepNumber: 2,
        stepTag: "➔ STEP 2: PROCESSING",
        title: "Poultry Dressing Plant",
        desc: "Sanitary evisceration, automated defeathering & hygienic cut calibration.",
        image: service.step2Image || "/services/poultry/step2.jpg",
      },
      {
        stepNumber: 3,
        stepTag: "➔ STEP 3: PACKAGING",
        title: "Export Portion Packing",
        desc: "Fresh poultry tray vacuum packaging & blast-frozen export boxes.",
        image: service.step3Image || "/services/poultry/step3.jpg",
      },
      {
        stepNumber: 4,
        stepTag: "➔ STEP 4: MARITIME EXPORT & SHIPPING",
        title: "Global Reefer Ocean Shipping",
        desc: "Active vessel loading & continuous cold-chain maritime logistics.",
        image: service.step4Image || "/services/poultry/step4.jpg",
      },
      {
        stepNumber: 5,
        stepTag: "➔ STEP 5: CULINARY APPLICATION",
        title: "Roasted Chicken Dish",
        desc: "Succulent, golden roasted whole chicken served on fine dining tables.",
        image: service.step5Image || "/services/poultry/step5.jpg",
      },
    ];
  }

  if (s === "duck-farming-processing") {
    return [
      {
        stepNumber: 1,
        stepTag: "➔ STEP 1: FORAGING",
        title: "Pastoral Duck Grazing",
        desc: "Flock of healthy ducks grazing naturally along lush wetland pond pastures.",
        image: service.step1Image || "/services/duck/step1.jpg",
      },
      {
        stepNumber: 2,
        stepTag: "➔ STEP 2: PROCESSING",
        title: "Hygienic Abattoir",
        desc: "Sanitary evisceration line, automated defeathering & hygienic cut calibration.",
        image: service.step2Image || "/services/duck/step2.jpg",
      },
      {
        stepNumber: 3,
        stepTag: "➔ STEP 3: PACKAGING",
        title: "Export Meat Packaging",
        desc: "Vacuum skin packaging & blast-frozen export master carton packing.",
        image: service.step3Image || "/services/duck/step3.jpg",
      },
      {
        stepNumber: 4,
        stepTag: "➔ STEP 4: MARITIME EXPORT & SHIPPING",
        title: "Global Reefer Ocean Shipping",
        desc: "Active vessel loading & temperature-locked export transport worldwide.",
        image: service.step4Image || "/services/duck/step4.jpg",
      },
      {
        stepNumber: 5,
        stepTag: "➔ STEP 5: CULINARY APPLICATION",
        title: "Crispy Peking Duck",
        desc: "Gourmet whole crispy roasted Peking duck served on fine dining tables.",
        image: service.step5Image || "/services/duck/step5.jpg",
      },
    ];
  }

  if (s === "aquaculture-fish-farming") {
    return [
      {
        stepNumber: 1,
        stepTag: "➔ STEP 1: AQUACULTURE",
        title: "Aerated Fish Ponds",
        desc: "Scientific freshwater aquaculture ponds with continuous paddlewheel aeration.",
        image: service.step1Image || "/services/fish/step1.jpg",
      },
      {
        stepNumber: 2,
        stepTag: "➔ STEP 2: PROCESSING",
        title: "HACCP Filleting Line",
        desc: "Sanitary de-scaling, filleting, skinning & hygienic fish cut calibration.",
        image: service.step2Image || "/services/fish/step2.jpg",
      },
      {
        stepNumber: 3,
        stepTag: "➔ STEP 3: PACKAGING",
        title: "Export Seafood Packaging",
        desc: "Vacuum skin packs & IQF blast-frozen master carton export boxing.",
        image: service.step3Image || "/services/fish/step3.jpg",
      },
      {
        stepNumber: 4,
        stepTag: "➔ STEP 4: MARITIME EXPORT & SHIPPING",
        title: "Global Reefer Ocean Shipping",
        desc: "Port terminal loading & certified cold-chain reefer vessel shipping.",
        image: service.step4Image || "/services/fish/step4.jpg",
      },
      {
        stepNumber: 5,
        stepTag: "➔ STEP 5: CULINARY APPLICATION",
        title: "Gourmet Fish Cuisine",
        desc: "Succulent pan-seared crispy-skin fish fillet served in fine restaurants.",
        image: service.step5Image || "/services/fish/step5.jpg",
      },
    ];
  }

  // Generic fallback if step images are provided via admin dashboard
  if (service.step1Image || service.step2Image || service.step3Image) {
    return [
      {
        stepNumber: 1,
        stepTag: "➔ STEP 1: PRODUCTION & FARMING",
        title: "Ethical Rearing & Sourcing",
        desc: "Primary production and biosecure farming under strict quality controls.",
        image: service.step1Image || service.image,
      },
      {
        stepNumber: 2,
        stepTag: "➔ STEP 2: HYGIENIC PROCESSING",
        title: "Sanitary Processing & Grading",
        desc: "Certified abattoir processing, automated calibration, and pathogen testing.",
        image: service.step2Image || service.image,
      },
      {
        stepNumber: 3,
        stepTag: "➔ STEP 3: EXPORT PACKAGING",
        title: "Vacuum Sealed Packaging",
        desc: "Modified atmosphere packaging, vacuum sealing, and temperature-controlled boxing.",
        image: service.step3Image || service.image,
      },
      {
        stepNumber: 4,
        stepTag: "➔ STEP 4: MARITIME EXPORT & SHIPPING",
        title: "Global Reefer Ocean Shipping",
        desc: "Active vessel loading & temperature-locked reefer logistics to international destinations.",
        image: service.step4Image || "/services/cattle/step4.jpg",
      },
      {
        stepNumber: 5,
        stepTag: "➔ STEP 5: CULINARY APPLICATION",
        title: "Premium Final Application",
        desc: "End-consumer food service and culinary excellence in retail and hospitality.",
        image: service.step5Image || service.image,
      },
    ];
  }

  return null;
}
