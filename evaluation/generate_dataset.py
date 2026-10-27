import json

listings = [
    # ==================== TEXTBOOKS (25) ====================
    {
        "id": 1,
        "title": "Casio fx-991EX ClassWiz Scientific Calculator",
        "description": "High-spec scientific calculator essential for Engineering, Physics, and Statistics exams. Mint condition with original protective slide-on cover. Battery recently replaced.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "25",
        "hall_location": "Mashava Campus",
        "seller_username": "tinashe_m"
    },
    {
        "id": 2,
        "title": "Commercial Law in Zimbabwe (Lovemore Madhuku)",
        "description": "Prescribed textbook for Commercial Law and LLB students. No missing pages, includes clean highlighting on key case studies and legal principles.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "18",
        "hall_location": "Main Campus Quad",
        "seller_username": "kudzai_law"
    },
    {
        "id": 3,
        "title": "Financial Accounting: An Introduction (6th Edition)",
        "description": "Core textbook for B.Com Accounting & Finance. In mint condition, includes digital access code card intact and worked problem summaries.",
        "true_category": "Textbooks",
        "condition": "Brand New",
        "price": "22",
        "hall_location": "Main Campus Library",
        "seller_username": "chipo_bcom"
    },
    {
        "id": 4,
        "title": "Economics for South African Students (Philip Mohr)",
        "description": "Comprehensive introductory economics textbook covering microeconomics and macroeconomics concepts, fiscal policy, inflation and market equilibria.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "15",
        "hall_location": "Mashava Campus",
        "seller_username": "tariro_econ"
    },
    {
        "id": 5,
        "title": "Calculus: Early Transcendentals (James Stewart 8th Ed)",
        "description": "Essential mathematics textbook for engineering, computer science and physics majors. Covers single-variable and multivariable calculus with solutions.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "20",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "farai_math"
    },
    {
        "id": 6,
        "title": "University Physics with Modern Physics (Young & Freedman)",
        "description": "Standard physics syllabus textbook for STEM students. Mechanics, thermodynamics, electromagnetism, and optics with worked practice problems.",
        "true_category": "Textbooks",
        "condition": "Fair",
        "price": "14",
        "hall_location": "Main Campus Quad",
        "seller_username": "brian_stem"
    },
    {
        "id": 7,
        "title": "Constitutional Law of Zimbabwe (Geoff Feltoe)",
        "description": "Prescribed jurisprudence manual covering the 2013 Constitution of Zimbabwe, separation of powers, human rights charter, and judicial review precedent.",
        "true_category": "Textbooks",
        "condition": "Like New",
        "price": "19",
        "hall_location": "Main Campus Library",
        "seller_username": "nyasha_law"
    },
    {
        "id": 8,
        "title": "General Principles of Contract Law (Christie)",
        "description": "Fundamental legal textbook on Zimbabwean and Roman-Dutch contract law, offer and acceptance, breach of contract, remedies and damages.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "16",
        "hall_location": "Mucheke Campus",
        "seller_username": "simba_legal"
    },
    {
        "id": 9,
        "title": "Principles of Management Accounting (Drury 10th Ed)",
        "description": "Standard cost and management accounting textbook for 2nd and 3rd year commerce undergraduates. Variance analysis, budgeting, and ABC costing.",
        "true_category": "Textbooks",
        "condition": "Like New",
        "price": "24",
        "hall_location": "Mashava Campus",
        "seller_username": "kuda_finance"
    },
    {
        "id": 10,
        "title": "Company Law in Zimbabwe (M. T. Tshipa)",
        "description": "Detailed guide on corporate governance, Companies and Other Business Entities Act, directors duties, shareholder protection, and liquidation procedures.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "17",
        "hall_location": "Main Campus Quad",
        "seller_username": "tariro_law"
    },
    {
        "id": 11,
        "title": "Introduction to Algorithms (CLRS 3rd Edition)",
        "description": "Renowned computer science algorithms textbook. Sorting, graph theory, dynamic programming, greediness, and big-O asymptotic notation.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "25",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "farai_cs"
    },
    {
        "id": 12,
        "title": "Python Crash Course & Data Science Handbook Combo",
        "description": "Two paperback textbooks bundle for programming beginners. Covers Python syntax, NumPy, Pandas, Matplotlib, and web scraping project guides.",
        "true_category": "Textbooks",
        "condition": "Like New",
        "price": "18",
        "hall_location": "Mashava Complex",
        "seller_username": "tatenda_dev"
    },
    {
        "id": 13,
        "title": "Human Anatomy & Physiology (Marieb & Hoehn 10th Ed)",
        "description": "Comprehensive medical sciences and nursing textbook. High-resolution anatomical diagrams, histology photos, and organ system physiology summaries.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "30",
        "hall_location": "Mucheke Campus",
        "seller_username": "tendai_health"
    },
    {
        "id": 14,
        "title": "Foundations of Nursing Practice (Potter & Perry)",
        "description": "Core textbook for nursing students. Clinical nursing skills, patient assessment, pharmacology safety, ethics, and healthcare procedures.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "20",
        "hall_location": "Mucheke Campus",
        "seller_username": "ruva_nurse"
    },
    {
        "id": 15,
        "title": "Statistics for Business and Economics (Anderson & Sweeney)",
        "description": "Business statistics prescribed book. Hypothesis testing, probability distributions, regression models, ANOVA, and Excel case studies.",
        "true_category": "Textbooks",
        "condition": "Like New",
        "price": "21",
        "hall_location": "Main Campus Quad",
        "seller_username": "munyaradzi_stat"
    },
    {
        "id": 16,
        "title": "Organic Chemistry (Paula Yurkanis Bruice 8th Edition)",
        "description": "Standard university chemistry text with reaction mechanisms, synthesis pathways, stereochemistry, and spectroscopy NMR diagrams.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "22",
        "hall_location": "Mashava Campus",
        "seller_username": "clever_chem"
    },
    {
        "id": 17,
        "title": "Lehninger Principles of Biochemistry (Nelson & Cox)",
        "description": "Prescribed biochemistry textbook for biology and pre-med students. Cellular metabolism, enzyme kinetics, glycolysis, and molecular biology.",
        "true_category": "Textbooks",
        "condition": "Like New",
        "price": "26",
        "hall_location": "Mucheke Campus",
        "seller_username": "anita_bio"
    },
    {
        "id": 18,
        "title": "Sociology of Education in Southern Africa",
        "description": "Core module textbook for Bachelor of Education (B.Ed) students. Educational theories, social stratification, policy reform, and classroom dynamics.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "12",
        "hall_location": "Main Campus Quad",
        "seller_username": "gracious_edu"
    },
    {
        "id": 19,
        "title": "Nervous Conditions by Tsitsi Dangarembga (Literature)",
        "description": "Prescribed African literature novel for English and Humanities degrees. Pristine clean pages with pencil annotations on themes and character analysis.",
        "true_category": "Textbooks",
        "condition": "Like New",
        "price": "8",
        "hall_location": "Main Campus Library",
        "seller_username": "sarah_lit"
    },
    {
        "id": 20,
        "title": "Things Fall Apart by Chinua Achebe (Study Edition)",
        "description": "African literary classic required for first-year African Studies and Literature modules. Includes glossary, historical commentary and essay questions.",
        "true_category": "Textbooks",
        "condition": "Like New",
        "price": "7",
        "hall_location": "Main Campus Quad",
        "seller_username": "panashe_lit"
    },
    {
        "id": 21,
        "title": "Research Methodology: Methods and Techniques (C. R. Kothari)",
        "description": "Essential thesis preparation handbook for final year undergraduate dissertation research. Sampling designs, data collection, and statistical analysis.",
        "true_category": "Textbooks",
        "condition": "Brand New",
        "price": "13",
        "hall_location": "Main Campus Library",
        "seller_username": "blessing_res"
    },
    {
        "id": 22,
        "title": "Engineering Mechanics: Statics and Dynamics (Hibbeler)",
        "description": "Standard engineering mechanics course book. Force vectors, equilibrium of rigid bodies, truss analysis, friction, and kinematics of particles.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "23",
        "hall_location": "Mashava Campus",
        "seller_username": "kelvin_eng"
    },
    {
        "id": 23,
        "title": "GZU Past Exam Papers & Solutions Pack: B.Com 1st Year",
        "description": "Printed exam pack compilation containing 5 years of past exam questions and worked answers for Financial Accounting, Business Law, and Microeconomics.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "10",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "bcom_rep"
    },
    {
        "id": 24,
        "title": "Computer Architecture: A Quantitative Approach (Hennessy)",
        "description": "Advanced hardware textbook for third-year Computer Science. Instruction pipelining, memory hierarchy, cache coherence, and parallel architectures.",
        "true_category": "Textbooks",
        "condition": "Fair",
        "price": "18",
        "hall_location": "Mashava Campus",
        "seller_username": "farai_cs"
    },
    {
        "id": 25,
        "title": "Medical Microbiology (Jawetz, Melnick & Adelberg)",
        "description": "Comprehensive textbook covering bacteriology, virology, mycology, parasitology, immunology, and antimicrobial pharmacology for medical students.",
        "true_category": "Textbooks",
        "condition": "Good",
        "price": "25",
        "hall_location": "Mucheke Campus",
        "seller_username": "dr_kudzi"
    },

    # ==================== ELECTRONICS (25) ====================
    {
        "id": 26,
        "title": "Sharp EL-W506T WriteView Scientific Calculator",
        "description": "Advanced 640-function scientific calculator with 4-line matrix display, matrix calculations, complex numbers, and integration formulas.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "22",
        "hall_location": "Main Campus Quad",
        "seller_username": "nomsa_eng"
    },
    {
        "id": 27,
        "title": "Texas Instruments TI-84 Plus Graphing Calculator",
        "description": "Color screen graphing calculator approved for engineering mathematics, calculus, and statistics. Preloaded with apps and USB data link cable.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "55",
        "hall_location": "Mashava Campus",
        "seller_username": "tau_tech"
    },
    {
        "id": 28,
        "title": "Lenovo ThinkPad T480 (Core i5, 16GB RAM, 512GB SSD)",
        "description": "Reliable student workhorse laptop with dual batteries. Excellent battery health (6+ hours of typing/research), backlit keyboard, licensed Windows 11 Pro.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "210",
        "hall_location": "Mashava Campus",
        "seller_username": "farai_cs"
    },
    {
        "id": 29,
        "title": "HP EliteBook 840 G5 (Core i7, 16GB RAM, 256GB SSD)",
        "description": "Premium aluminum slim business laptop. Full HD IPS anti-glare screen, Bang & Olufsen speakers, fast biometric fingerprint scanner, USB-C thunderbolt.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "240",
        "hall_location": "Main Campus Library",
        "seller_username": "simba_gzu"
    },
    {
        "id": 30,
        "title": "Dell Latitude 7490 (Core i5 8th Gen, 8GB RAM, 256GB SSD)",
        "description": "Compact 14-inch durable ultrabook. Fast boot speed, carbon fiber lid, long battery run-time, lightweight and easy to carry to lectures.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "180",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "tariro_it"
    },
    {
        "id": 31,
        "title": "Apple MacBook Air 13-inch (M1 Chip, 8GB RAM, 256GB SSD)",
        "description": "Space Grey MacBook Air M1 with battery health at 91%. Silent fanless design, retina display, includes original 30W Apple charger and box.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "420",
        "hall_location": "Main Campus Quad",
        "seller_username": "ashley_apple"
    },
    {
        "id": 32,
        "title": "Room Mini Bar Fridge (90L Defy with Freezer Box)",
        "description": "Silent compressor dorm fridge, fits perfectly under study desk. Keeps drinks icy cold and has a top freezer compartment for meal prep. Ready for immediate pickup.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "95",
        "hall_location": "Mashava Complex",
        "seller_username": "simba_gzu"
    },
    {
        "id": 33,
        "title": "Defy 2-Plate Compact Electric Stove with Oven",
        "description": "Student hostel cooking stove with twin solid hotplates and compact baking/grilling oven. Energy efficient, clean condition, plug and play.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "50",
        "hall_location": "Mashava Campus",
        "seller_username": "chipo_dorm"
    },
    {
        "id": 34,
        "title": "Electric Kettle 1.7L Stainless Steel Cordless",
        "description": "Fast-boil 1800W dorm electric kettle with automatic shut-off and boil-dry safety protection. Clean stainless steel body, used for one semester.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "10",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "tatenda_cook"
    },
    {
        "id": 35,
        "title": "Anker PowerCore 20000mAh Fast Charging Power Bank",
        "description": "High-capacity external battery pack with PowerIQ high-speed charging. Can recharge your phone 4-5 times during campus power cuts and load shedding.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "28",
        "hall_location": "Main Campus Quad",
        "seller_username": "kudzi_power"
    },
    {
        "id": 36,
        "title": "Romoss 30000mAh 18W Fast Charging Power Bank",
        "description": "Massive 30000mAh portable charger with triple output ports (Type-C, Micro-USB, Lightning input). LED display showing battery percentage.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "32",
        "hall_location": "Mashava Campus",
        "seller_username": "tinashe_m"
    },
    {
        "id": 37,
        "title": "JBL Flip 5 Waterproof Portable Bluetooth Speaker",
        "description": "Deep bass sound signature, rugged waterproof IPX7 body, 12 hours of playtime on a single charge. Camo edition with USB-C cable.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "45",
        "hall_location": "Mucheke Campus",
        "seller_username": "sound_vibe"
    },
    {
        "id": 38,
        "title": "Sony WH-CH520 Wireless Bluetooth Headphones",
        "description": "Lightweight on-ear headphones with 50-hour battery life, built-in microphone for online lectures and calls, multi-point connection.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "35",
        "hall_location": "Main Campus Library",
        "seller_username": "nyasha_v"
    },
    {
        "id": 39,
        "title": "Apple AirPods Pro 2nd Gen (MagSafe Case)",
        "description": "Active noise cancelling earbuds perfect for studying in crowded campus libraries. Transparency mode, spatial audio, includes replacement silicone tips.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "110",
        "hall_location": "Main Campus Quad",
        "seller_username": "anesu_pods"
    },
    {
        "id": 40,
        "title": "Samsung Galaxy A34 5G (128GB, 6GB RAM, Dual SIM)",
        "description": "Vibrant 120Hz Super AMOLED display, 48MP triple camera, 5000mAh 2-day battery life, clean screen with tempered glass screen protector installed.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "165",
        "hall_location": "Mashava Campus",
        "seller_username": "panashe_phones"
    },
    {
        "id": 41,
        "title": "iPhone 11 (64GB Black, Factory Unlocked)",
        "description": "Clean cosmetic condition, 84% battery health, Face ID working 100%, dual cameras shoot crisp 4K 60fps video. Comes with silicone protective case.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "190",
        "hall_location": "Main Campus Quad",
        "seller_username": "kudzai_law"
    },
    {
        "id": 42,
        "title": "Kingston 64GB Dual USB Type-C & Type-A Flash Drive",
        "description": "High-speed OTG USB 3.2 flash memory drive. Move study assignments and PDF notes directly between smartphone and laptop without cables.",
        "true_category": "Electronics",
        "condition": "Brand New",
        "price": "9",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "tatenda_prints"
    },
    {
        "id": 43,
        "title": "Logitech MK270 Wireless Keyboard and Mouse Combo",
        "description": "Full-size wireless keyboard with media keys and compact optical mouse. Plug and play 2.4GHz USB nano receiver, durable spill-resistant build.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "20",
        "hall_location": "Mashava Campus",
        "seller_username": "farai_cs"
    },
    {
        "id": 44,
        "title": "Dell 24-inch Full HD 1080p IPS Monitor (HDMI/VGA)",
        "description": "Crisp external desktop monitor ideal for dual-screen coding, research reading, and spreadsheets. ComfortView low blue light filter with stand.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "85",
        "hall_location": "Mashava Complex",
        "seller_username": "simba_gzu"
    },
    {
        "id": 45,
        "title": "Baseus 65W GaN Fast Charger (Type-C + USB Ports)",
        "description": "Compact high-speed travel charger capable of charging laptops (MacBook, ThinkPad, Dell) and phones simultaneously with power delivery.",
        "true_category": "Electronics",
        "condition": "Brand New",
        "price": "25",
        "hall_location": "Main Campus Quad",
        "seller_username": "tau_tech"
    },
    {
        "id": 46,
        "title": "LED Desk Study Lamp with Clamp and Phone Stand",
        "description": "Flexible gooseneck reading lamp with 3 color temperatures (warm, white, daylight) and stepless dimming. Powered via USB, perfect for dorm study.",
        "true_category": "Electronics",
        "condition": "Like New",
        "price": "8",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "blessing_m"
    },
    {
        "id": 47,
        "title": "Surge Protector 6-Way Power Extension Strip (3m Cord)",
        "description": "Heavy-duty extension cord with individual power switches, surge suppression indicator, and 3 USB fast charging ports for dorm rooms.",
        "true_category": "Electronics",
        "condition": "Brand New",
        "price": "12",
        "hall_location": "Mucheke Campus",
        "seller_username": "kuda_dorm"
    },
    {
        "id": 48,
        "title": "Laptop Cooling Pad Dual Silent Fan with LED Glow",
        "description": "Ergonomic angled cooling stand fits 13 to 17 inch gaming and study laptops. Prevents overheating during intensive computing tasks.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "14",
        "hall_location": "Mashava Campus",
        "seller_username": "tatenda_dev"
    },
    {
        "id": 49,
        "title": "Huawei 4G LTE Portable Pocket Wi-Fi MiFi Router",
        "description": "Unlocked mobile broadband hotspot router compatible with Econet, NetOne, and Telecel 4G SIM cards. Connects up to 10 devices on campus.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "26",
        "hall_location": "Main Campus Library",
        "seller_username": "econet_deals"
    },
    {
        "id": 50,
        "title": "Casio fx-82MS Scientific Calculator 2nd Edition",
        "description": "Standard two-line display 240-function scientific calculator approved for general high school and university commerce math examinations.",
        "true_category": "Electronics",
        "condition": "Good",
        "price": "12",
        "hall_location": "Mucheke Campus",
        "seller_username": "tariro_calc"
    },

    # ==================== CLOTHING (25) ====================
    {
        "id": 51,
        "title": "GZU Varsity Heritage Bomber Jacket (Size M)",
        "description": "Official navy and gold campus bomber jacket with embroidered crest. Worn twice during winter semester, pristine condition. Warm fleece lining.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "35",
        "hall_location": "Mucheke Campus",
        "seller_username": "nyasha_v"
    },
    {
        "id": 52,
        "title": "Heavyweight Winter Fleece Hoodie (Oversized Black, L)",
        "description": "Thick 400gsm cotton fleece pullover hoodie. Extremely warm for cold Mashava morning lectures, deep kangaroo pouch pocket and double-lined hood.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "18",
        "hall_location": "Mashava Campus",
        "seller_username": "tinashe_m"
    },
    {
        "id": 53,
        "title": "Masvingo Winter Thermal Puffer Jacket (Navy, Size XL)",
        "description": "Windproof quilted puffer coat with insulated synthetic down filling. Full zip front, zippered hand pockets, keeps you super warm in winter.",
        "true_category": "Clothing",
        "condition": "Good",
        "price": "28",
        "hall_location": "Mashava Complex",
        "seller_username": "kudzai_law"
    },
    {
        "id": 54,
        "title": "Adidas Samba OG Leather Sneakers (White & Black, UK 8)",
        "description": "Classic timeless retro streetwear sneakers with gum sole and soft leather upper. Lightly worn for a month, clean soles and original box.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "40",
        "hall_location": "Main Campus Quad",
        "seller_username": "sneaker_head"
    },
    {
        "id": 55,
        "title": "Nike Air Force 1 07 Triple White (Size UK 9)",
        "description": "Iconic all-white low top basketball style sneakers. Thoroughly washed and deodorized, leather creases minimal, plenty of sole tread remaining.",
        "true_category": "Clothing",
        "condition": "Good",
        "price": "35",
        "hall_location": "Mucheke Campus",
        "seller_username": "farai_fits"
    },
    {
        "id": 56,
        "title": "University Graduation 2-Piece Slim Fit Formal Suit (Size 38)",
        "description": "Charcoal grey tailored suit jacket and matching trousers. Ideal for presentations, job interviews, moot court, and graduation ceremonies.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "55",
        "hall_location": "Main Campus Quad",
        "seller_username": "gentleman_gzu"
    },
    {
        "id": 57,
        "title": "Classic Navy Blue Presentation Blazer (Single Breasted, M)",
        "description": "Sharp smart-casual blazer with brass buttons and notch lapel. Versatile coat for formal faculty defenses, church, and society dinners.",
        "true_category": "Clothing",
        "condition": "Good",
        "price": "25",
        "hall_location": "Main Campus Library",
        "seller_username": "munya_law"
    },
    {
        "id": 58,
        "title": "White Oxford Cotton Long-Sleeve Dress Shirt (Slim Fit, L)",
        "description": "Crisp 100% breathable cotton dress shirt with button-down collar. Ironed and ready for formal university presentations or office internships.",
        "true_category": "Clothing",
        "condition": "Brand New",
        "price": "12",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "tatenda_formal"
    },
    {
        "id": 59,
        "title": "Black Leather Oxford Formal Shoes (Size UK 8)",
        "description": "Polished genuine leather dress shoes with rubber non-slip outsoles. Worn once for a 30-minute faculty symposium speech.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "26",
        "hall_location": "Main Campus Quad",
        "seller_username": "simba_shoes"
    },
    {
        "id": 60,
        "title": "Grey Heather Fleece Jogger Sweatpants (Size Medium)",
        "description": "Comfy tapered fit joggers with elastic drawstring waistband and deep side pockets. Great for casual dorm lounging and gym workouts.",
        "true_category": "Clothing",
        "condition": "Good",
        "price": "10",
        "hall_location": "Mashava Campus",
        "seller_username": "chill_student"
    },
    {
        "id": 61,
        "title": "Knit Ribbed Winter Beanie Hat (Black & Maroon 2-Pack)",
        "description": "Warm stretch acrylic ribbed skull caps. Thermal double-layer fold-over cuff that keeps head and ears snug on chilly campus mornings.",
        "true_category": "Clothing",
        "condition": "Brand New",
        "price": "6",
        "hall_location": "Mashava Campus",
        "seller_username": "warm_winter"
    },
    {
        "id": 62,
        "title": "Waterproof Campus Commuter Laptop Backpack (30L)",
        "description": "Ergonomic student rucksack with padded sleeve for 15.6 inch laptops, anti-theft hidden pocket, USB charging port, and water bottle holders.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "22",
        "hall_location": "Main Campus Quad",
        "seller_username": "bag_hub"
    },
    {
        "id": 63,
        "title": "Genuine Brown Leather Reversible Dress Belt (32-36 inch)",
        "description": "Sturdy dual-tone brown and black leather belt with brushed metallic buckle. Fits standard formal trousers and casual jeans.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "8",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "blessing_acc"
    },
    {
        "id": 64,
        "title": "Vintage Washed Denim Trucker Jacket (Medium Blue, L)",
        "description": "Rugged denim jacket with bronze button closure, button-flap chest pockets, and side tabs. Classic student wardrobe staple in excellent shape.",
        "true_category": "Clothing",
        "condition": "Good",
        "price": "20",
        "hall_location": "Mucheke Campus",
        "seller_username": "retro_fits"
    },
    {
        "id": 65,
        "title": "Suede Chelsea Boots (Tobacco Tan, Size UK 9)",
        "description": "Smart-casual slip-on ankle boots with elastic side gussets and pull-on tab. Crepe sole provides comfort during walking across campus quads.",
        "true_category": "Clothing",
        "condition": "Good",
        "price": "28",
        "hall_location": "Main Campus Quad",
        "seller_username": "gentleman_gzu"
    },
    {
        "id": 66,
        "title": "Waterproof Windbreaker Running Rain Jacket (Teal, M)",
        "description": "Ultralight packable storm shell coat with hood and reflective strips. Protects from sudden downpours while commuting between campus halls.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "14",
        "hall_location": "Mashava Campus",
        "seller_username": "runner_fit"
    },
    {
        "id": 67,
        "title": "Plain Heavy Cotton Crewneck T-Shirts (Pack of 3: Black/White/Grey)",
        "description": "Three essential 220gsm non-shrink streetwear basic tees in size L. Soft combed cotton, reinforced collar ribs, unworn and sealed.",
        "true_category": "Clothing",
        "condition": "Brand New",
        "price": "15",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "tatenda_prints"
    },
    {
        "id": 68,
        "title": "Nike Dry-FIT Athletic Gym Shorts with Zipper Pockets (Size M)",
        "description": "Moisture-wicking breathable sports shorts for football, basketball, and morning campus jogs. Secure zip pockets for phone and keys.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "11",
        "hall_location": "Mucheke Campus",
        "seller_username": "sports_gzu"
    },
    {
        "id": 69,
        "title": "Cashmere Blend Winter Fringe Scarf (Forest Green)",
        "description": "Soft and plush insulating winter scarf. Generous length to wrap comfortably around neck and chest against windy evening breezes.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "8",
        "hall_location": "Mashava Campus",
        "seller_username": "warm_winter"
    },
    {
        "id": 70,
        "title": "Tracksuit Bottoms with White Piping Stripes (Navy Blue, L)",
        "description": "Classic athletic training pants with zippered ankle cuffs and soft brushed fleece inner lining. Comfortable and durable.",
        "true_category": "Clothing",
        "condition": "Good",
        "price": "9",
        "hall_location": "Main Campus Quad",
        "seller_username": "nyasha_v"
    },
    {
        "id": 71,
        "title": "Converse All Star Chuck Taylor High Tops (Black, UK 8)",
        "description": "Authentic canvas high top sneakers with classic star ankle patch and vulcanized rubber sole. Broken-in vintage aesthetic.",
        "true_category": "Clothing",
        "condition": "Good",
        "price": "22",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "chucks_fan"
    },
    {
        "id": 72,
        "title": "Official University Rugby Club Supporter Jersey (Size L)",
        "description": "Heavyweight collared sportswear rugby shirt with green and gold stripes and campus sports badge. Collector item in pristine shape.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "18",
        "hall_location": "Main Campus Quad",
        "seller_username": "rugby_captain"
    },
    {
        "id": 73,
        "title": "Slim Fit Stretch Chino Pants (Khaki Beige, 32W 32L)",
        "description": "Versatile trousers that balance smart and casual styles. Cotton twill fabric with 2% elastane for lecture desk sitting comfort.",
        "true_category": "Clothing",
        "condition": "Good",
        "price": "13",
        "hall_location": "Mashava Campus",
        "seller_username": "chipo_bcom"
    },
    {
        "id": 74,
        "title": "Oversized Corduroy Long Sleeve Button-Up Shirt (Olive Green)",
        "description": "Textured ribbed corduroy overshirt. Can be styled as a light autumn jacket over a t-shirt or buttoned up as an aesthetic vintage fit.",
        "true_category": "Clothing",
        "condition": "Like New",
        "price": "16",
        "hall_location": "Mucheke Campus",
        "seller_username": "retro_fits"
    },
    {
        "id": 75,
        "title": "Windproof Dual-Layer Wind Umbrella & Rain Poncho Combo",
        "description": "Compact fiberglass rib umbrella that resists turning inside out in heavy gusts, plus a reusable transparent waterproof rain poncho.",
        "true_category": "Clothing",
        "condition": "Brand New",
        "price": "7",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "weather_safe"
    },

    # ==================== SERVICES (25) ====================
    {
        "id": 76,
        "title": "Fast Dorm Printing, Binding & Document Scanning",
        "description": "Full laser printing service right inside campus halls. Double-sided notes, dissertation binding, and past exam packs delivered in 30 minutes.",
        "true_category": "Services",
        "condition": "Service",
        "price": "2",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "tatenda_prints"
    },
    {
        "id": 77,
        "title": "Professional Hardcover Thesis & Dissertation Gold Foil Binding",
        "description": "Official university library standard hardback binding with gold embossed lettering on spine and cover. Quick 24-hour turnaround for final year submissions.",
        "true_category": "Services",
        "condition": "Service",
        "price": "12",
        "hall_location": "Main Campus Quad",
        "seller_username": "thesis_master"
    },
    {
        "id": 78,
        "title": "Professional Hair Braiding & Knotless Box Braids",
        "description": "Skilled campus stylist offering neat knotless braids, twists, and loc maintenance at student-friendly rates. Book appointments between lectures.",
        "true_category": "Services",
        "condition": "Service",
        "price": "15",
        "hall_location": "Mucheke Hall Block B",
        "seller_username": "ruva_beauty"
    },
    {
        "id": 79,
        "title": "Bohemian Goddess Braids and Passion Twists Styling",
        "description": "Gentle on edges, neat parted braids with wavy curl extensions. High quality hair styling done right in female dorms or home visits.",
        "true_category": "Services",
        "condition": "Service",
        "price": "18",
        "hall_location": "Mashava Complex",
        "seller_username": "tariro_hair"
    },
    {
        "id": 80,
        "title": "Laptop Screen Replacement & Broken Hinge Hardware Repair",
        "description": "Experienced student technician repairs cracked laptop screens, loose hinges, overheating cooling fans, and keyboard replacements. Diagnostics free.",
        "true_category": "Services",
        "condition": "Service",
        "price": "15",
        "hall_location": "Mashava Campus",
        "seller_username": "tech_medic"
    },
    {
        "id": 81,
        "title": "Windows 11 / 10 Installation, SSD Upgrade & Virus Removal",
        "description": "Fix slow laptops! Clean installation of genuine Windows, Microsoft Office suite, removal of malware/spyware, and transfer of assignment files to new SSDs.",
        "true_category": "Services",
        "condition": "Service",
        "price": "10",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "farai_cs"
    },
    {
        "id": 82,
        "title": "Smartphone Screen Glass & Battery Replacement Service",
        "description": "Quick 1-hour screen replacement for Samsung, iPhone, and Tecno phones. Fix swollen batteries and charging port connection problems on campus.",
        "true_category": "Services",
        "condition": "Service",
        "price": "14",
        "hall_location": "Main Campus Quad",
        "seller_username": "phone_doctor"
    },
    {
        "id": 83,
        "title": "Statistics, SPSS, R & Data Analysis Dissertation Tutoring",
        "description": "One-on-one consultation for final-year students analyzing survey data. Descriptive stats, regression, correlation, ANOVA, and interpretation write-ups.",
        "true_category": "Services",
        "condition": "Service",
        "price": "10",
        "hall_location": "Main Campus Library",
        "seller_username": "stats_pro"
    },
    {
        "id": 84,
        "title": "Commercial Law & Legal Principles Exam Coaching (LLB Peer)",
        "description": "Past-exam walkthroughs, legal case analysis frameworks (IRAC method), case law summary packets, and private tutoring sessions by top-ranking law student.",
        "true_category": "Services",
        "condition": "Service",
        "price": "8",
        "hall_location": "Main Campus Quad",
        "seller_username": "kudzai_law"
    },
    {
        "id": 85,
        "title": "Calculus & Engineering Mathematics 101 Private Lessons",
        "description": "Clear step-by-step tutoring on limits, derivatives, integration techniques, differential equations, and exam question strategies. Guaranteed confidence.",
        "true_category": "Services",
        "condition": "Service",
        "price": "7",
        "hall_location": "Mashava Campus",
        "seller_username": "farai_math"
    },
    {
        "id": 86,
        "title": "Fast Academic Typing, Proofreading & APA Dissertation Formatting",
        "description": "Type written lecture notes or handwritten thesis drafts into clean Microsoft Word documents. Full APA 7th reference list formatting and grammar check.",
        "true_category": "Services",
        "condition": "Service",
        "price": "5",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "tatenda_prints"
    },
    {
        "id": 87,
        "title": "Campus Portrait & Graduation Photoshoot Photography",
        "description": "High-end DSLR outdoor photoshoots on campus grounds. 15 professionally color-graded digital portraits delivered via Google Drive in 48 hours.",
        "true_category": "Services",
        "condition": "Service",
        "price": "25",
        "hall_location": "Main Campus Quad",
        "seller_username": "lens_crafter"
    },
    {
        "id": 88,
        "title": "Student Graphic Design: Event Posters, Flyers & Logo Revamp",
        "description": "Eye-catching graphic design for campus society elections, club events, birthday flyers, and student business brand logos. Fast turnaround.",
        "true_category": "Services",
        "condition": "Service",
        "price": "6",
        "hall_location": "Mucheke Campus",
        "seller_username": "pixel_art"
    },
    {
        "id": 89,
        "title": "Professional Student CV, Resume & LinkedIn Profile Optimization",
        "description": "Transform your academic achievements into an ATS-friendly CV tailored for graduate trainee jobs, attachment applications, and university scholarships.",
        "true_category": "Services",
        "condition": "Service",
        "price": "5",
        "hall_location": "Main Campus Library",
        "seller_username": "career_boost"
    },
    {
        "id": 90,
        "title": "Dorm Laundry Wash, Dry & Fold Drop-off Service",
        "description": "Save study time during exam weeks. Drop off your laundry basket; clean, fragrant, dry, and neatly folded clothes returned within 24 hours.",
        "true_category": "Services",
        "condition": "Service",
        "price": "6",
        "hall_location": "Mashava Complex",
        "seller_username": "fresh_laundry"
    },
    {
        "id": 91,
        "title": "Acoustic Guitar & Piano Lessons for Beginners (Dorm Sessions)",
        "description": "Learn chords, scales, fingerpicking, and worship/gospel accompaniment in 45-minute friendly lessons. Instruments available during the session.",
        "true_category": "Services",
        "condition": "Service",
        "price": "6",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "music_hub"
    },
    {
        "id": 92,
        "title": "Physics 101 Problem Solving & Lab Report Review Sessions",
        "description": "Hands-on tutorials explaining difficult physics laboratory experiments, error calculations, vectors, Newton laws, and wave optics problem sets.",
        "true_category": "Services",
        "condition": "Service",
        "price": "7",
        "hall_location": "Mashava Campus",
        "seller_username": "brian_stem"
    },
    {
        "id": 93,
        "title": "Financial Accounting 1st Year Exam Revision Masterclass",
        "description": "Comprehensive weekend group workshops covering journal entries, balance sheets, cash flow statements, and trial balance corrections with practice tests.",
        "true_category": "Services",
        "condition": "Service",
        "price": "8",
        "hall_location": "Main Campus Quad",
        "seller_username": "chipo_bcom"
    },
    {
        "id": 94,
        "title": "Sneaker Restoration, Suede Revival & Deep Cleaning Service",
        "description": "Revive dirty kicks! Professional deep cleaning of midsoles, upper meshes, suede unmatting, deodorizing, and waterproof repellant coating.",
        "true_category": "Services",
        "condition": "Service",
        "price": "5",
        "hall_location": "Mucheke Campus",
        "seller_username": "kicks_spa"
    },
    {
        "id": 95,
        "title": "Clothing Alterations, Hemming & Trouser Resizing Tailor",
        "description": "Fast tailoring service on campus. Taper wide trousers, shorten sleeves, fix broken zippers, and resize presentation suits to fit perfectly.",
        "true_category": "Services",
        "condition": "Service",
        "price": "4",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "campus_tailor"
    },
    {
        "id": 96,
        "title": "Dorm Room Deep Cleaning & Move-Out Disinfection Service",
        "description": "Thorough room scrub down: floor washing, desk sanitization, window wipe-down, and cobweb removal before room handback inspections.",
        "true_category": "Services",
        "condition": "Service",
        "price": "10",
        "hall_location": "Mashava Complex",
        "seller_username": "clean_room"
    },
    {
        "id": 97,
        "title": "PA System, Party Lights & DJ Equipment Rental for Student Socials",
        "description": "High-powered 1000W Bluetooth speakers, wireless microphones, strobe lighting, and mixing console for hostel parties, birthdays, and fellowship events.",
        "true_category": "Services",
        "condition": "Service",
        "price": "40",
        "hall_location": "Main Campus Quad",
        "seller_username": "sound_vibe"
    },
    {
        "id": 98,
        "title": "Network LAN Cable Crimping & Wi-Fi Extender Setup in Dorms",
        "description": "Custom length Cat6 network cables crimped with RJ45 plugs for zero-lag internet connection, plus setup of Wi-Fi repeaters in hostel rooms.",
        "true_category": "Services",
        "condition": "Service",
        "price": "5",
        "hall_location": "Mashava Campus",
        "seller_username": "tau_tech"
    },
    {
        "id": 99,
        "title": "Web Development & Coding Assignment Mentorship (HTML/JS/Python)",
        "description": "Stuck on your software development homework? Practical coding mentorship, debugging advice, Git tutorials, and frontend portfolio guidance.",
        "true_category": "Services",
        "condition": "Service",
        "price": "9",
        "hall_location": "Herbert Chitepo Hall",
        "seller_username": "tatenda_dev"
    },
    {
        "id": 100,
        "title": "Dorm Barbershop Haircut, Beard Trim & Clean Fade Service",
        "description": "Neat tapers, fades, waves, and beard line-ups right in campus halls with sanitized professional clippers and razor edges. Walk out looking sharp.",
        "true_category": "Services",
        "condition": "Service",
        "price": "4",
        "hall_location": "Mashava Campus Block D",
        "seller_username": "fresh_cuts"
    }
]

with open("evaluation/dataset_listings.json", "w", encoding="utf-8") as f:
    json.dump(listings, f, indent=2)

print(f"Successfully generated {len(listings)} listings in evaluation/dataset_listings.json")
