// All site copy lives here. Pages in build.mjs only arrange it.

export const site = {
  name: 'Pilot Preparation Academy',
  short: 'PPA',
  url: 'https://pilotpreparationacademy.com',
  phone: '+91-9301657163',
  phoneHref: 'tel:+919301657163',
  phoneName: 'Rishi Chaudhary',
  whatsapp: '919301657163',
  email: 'info@pilotpreparationacademy.com',
  address: 'Wing A, 2nd Floor, Best Building, Andheri West, Mumbai 400058',
  mapsQuery: 'Pilot Preparation Academy, Best Building, Andheri West, Mumbai 400058',
  facebook: 'https://www.facebook.com/share/14GBiTUb32G/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/pilotpreparationacademy',
  youtubeId: 'VhBl3dHT5SY',
  about:
    'The leading aviation ground class provider in India. Founded by Capt. Guru Chaudhary to make high-quality aviation knowledge honest and affordable, with real mentorship, all the way to the cockpit.',
};

export const nav = [
  { href: 'about.html', label: 'About' },
  { href: 'become-a-pilot.html', label: 'Become a Pilot' },
  { href: 'dgca-ground-classes.html', label: 'DGCA Classes' },
  { href: 'flight-training.html', label: 'Flight Training', dropdown: true },
  { href: 'services.html', label: 'Services' },
  { href: 'courses.html', label: 'Courses' },
  { href: 'gallery.html', label: 'Gallery' },
  { href: 'contact.html', label: 'Contact' },
];

export const countries = [
  {
    slug: 'india', name: 'India', code: 'IN', authority: 'DGCA', authorityFull: 'Directorate General of Civil Aviation', schools: '01', location: 'Mumbai, India',
    intro: 'Train at home with a DGCA licence that needs no conversion, close to family, with costs that stay grounded.',
    training: 'India offers a rapidly expanding aviation training sector, with flight schools and academies catering to every kind of aspiring pilot. Its varied landscapes, beaches, plains and mountains, give students diverse flying environments, backed by high training standards and skilled instructors.',
    weather: 'India’s long dry season brings plenty of clear flying days, while the monsoon teaches trainees to respect convective weather and plan around it. Flying across coastal, plain and hilly regions builds well-rounded judgement.',
    living: 'Training in India means enjoying the familiarity of your own culture while staying close to family and friends. Lower living costs, easy communication and a supportive environment make it a comfortable and practical choice.',
    advIntro: 'Diverse flying conditions, from coastal plains to high mountains, give pilots well-rounded experience. Affordable training, skilled instructors and modern facilities, with year-round flying weather for steady progress.',
    adv: ['Train close to home, family and culture', 'DGCA licence, no conversion needed', 'Lower living and training costs', 'Coast, plains and mountains to fly over', 'Year-round flying weather for steady progress', 'Skilled instructors and modern facilities'],
  },
  {
    slug: 'usa', name: 'USA', code: 'US', authority: 'FAA', authorityFull: 'Federal Aviation Administration', schools: '03', location: 'United States',
    intro: 'One of the world’s top destinations for commercial pilot training, with an extensive range of programs and advanced flight training.',
    training: 'The USA is a premier destination for pilot training, with a broad spectrum of flying environments. From small regional airports to bustling commercial hubs, trainees learn to navigate busy airspace, use advanced radio procedures and handle diverse weather, so they arrive airline-ready.',
    weather: 'From bright clear skies to challenging storms, the USA offers a wide range of conditions. Trainees gain experience across many climates and landscapes, building the skills to handle different weather throughout their careers.',
    living: 'A dynamic, diverse country that warmly welcomes international students. Famous for innovation and cultural richness, it offers world-class education, experienced instructors and accredited programs that reward ambition.',
    advIntro: 'An exceptional range of flying environments, from small local airports to major international hubs, with top-notch training centres, experienced instructors and diverse weather.',
    adv: ['One of the most cost-effective countries for flight training', 'FAA licences are respected and accepted worldwide', 'The highest quality and standards of flight training', 'Many of the best flying schools in the world', 'Faster course completion, 6 to 8 months', 'The world’s most popular destination for international students'],
  },
  {
    slug: 'canada', name: 'Canada', code: 'CA', authority: 'Transport Canada', authorityFull: 'Transport Canada Civil Aviation', schools: '01', location: 'Canada',
    intro: 'Known for high-quality education and diverse flight training options that place it among the top-ranked countries worldwide.',
    training: 'Canada mixes everything that prepares a professional pilot for an airline career. Its airspace, from remote bush strips to busy international airports, gives trainees exposure to complex traffic patterns, radio communications and varied flying conditions.',
    weather: 'Clear skies, snow and wind: Canada’s varied weather is an ideal setting for comprehensive training. The changing climate challenges pilots to adapt and build resilience, across vast and scenic landscapes.',
    living: 'A safe, welcoming and multicultural country that values international students. Known for natural beauty and an outdoor lifestyle, Canada offers a strong education system and qualified instructors in a spirit of inclusiveness.',
    advIntro: 'Quiet rural airstrips to busy metropolitan airports, advanced facilities, expert instructors and challenging weather, Canada nurtures confident, adaptable pilots.',
    adv: ['Transport Canada licence, recognised internationally', 'Bush strips to busy international airports', 'Challenging weather builds resilient pilots', 'Advanced facilities and expert instructors', 'Safe, welcoming and multicultural', 'A strong, reliable education system'],
  },
  {
    slug: 'europe', name: 'Europe', code: 'EU', authority: 'EASA', authorityFull: 'European Union Aviation Safety Agency', schools: '01', location: 'Europe',
    intro: 'A premier destination for commercial pilot training, recognised for diverse programs and excellent flight training facilities.',
    training: 'Europe offers a wide array of flying experiences, from quiet regional airports to major international hubs. Highly skilled instructors, modern facilities and varied conditions prepare pilots for the demands of any airline career.',
    weather: 'From mild Mediterranean weather to more unpredictable northern conditions, Europe gives trainees experience across a range of scenarios, building the adaptability real-world flying demands.',
    living: 'Known for its rich cultural heritage and strong academic standards, Europe welcomes international students with high-quality training, expert instructors and internationally recognised qualifications.',
    advIntro: 'Peaceful countryside strips to busy, complex airports, excellent flight schools, professional instructors and changing weather build pilots ready for any aviation setting.',
    adv: ['EASA licence, recognised across Europe', 'Countryside strips to complex international hubs', 'Mediterranean to northern weather exposure', 'Excellent flight schools and professional instructors', 'Rich culture and strong academic standards', 'Internationally recognised qualifications'],
  },
  {
    slug: 'new-zealand', name: 'New Zealand', code: 'NZ', authority: 'CAA NZ', authorityFull: 'Civil Aviation Authority of New Zealand', schools: '02', location: 'New Zealand',
    intro: 'Excellent aviation schools, stunning landscapes and diverse training environments, an unmatched mix of quality and adventure.',
    training: 'New Zealand blends diverse flying environments, from quiet rural airstrips to busy commercial airports. World-class training facilities and experienced instructors shape confident, adaptable pilots.',
    weather: 'From calm, sunny days to gusty, challenging winds, New Zealand’s changeable weather gives trainees valuable experience in varied conditions, preparing them for a wide range of real-world situations.',
    living: 'Safe, welcoming and breathtaking. Famous for adventure tourism and its mountaineering heritage, New Zealand has a proven education system, and the Kiwi spirit of “giving everyone a fair go.”',
    advIntro: 'World-class facilities, experienced instructors and varied weather shape confident pilots, with stunning scenery and a welcoming atmosphere.',
    adv: ['CAA New Zealand licence, globally respected', 'Calm days to gusty winds, real weather skills', 'World-class training facilities', 'Rural airstrips to busy commercial airports', 'Safe, welcoming and breathtaking', 'A proven education system'],
  },
  {
    slug: 'australia', name: 'Australia', code: 'AU', authority: 'CASA', authorityFull: 'Civil Aviation Safety Authority', schools: '01', location: 'Australia',
    intro: 'Comprehensive study options and world-class flight training environments that consistently rank among the best globally.',
    training: 'Australia offers a wide range of flying environments, from remote outback strips to bustling city airports. Experienced instructors, diverse weather and excellent facilities shape skilled and confident pilots.',
    weather: 'Sunny clear skies, coastal winds and occasional storms make Australia an ideal training environment, giving pilots well-rounded experience for a broad range of real-world scenarios.',
    living: 'A safe, multicultural country that welcomes international students. Known for its relaxed lifestyle and natural beauty, Australia offers a strong education system with dedicated instructors and programs built for success.',
    advIntro: 'Remote rural strips to busy metropolitan airports, world-class facilities, skilled instructors and challenging weather, with stunning scenery and a welcoming atmosphere.',
    adv: ['CASA licence, recognised internationally', 'Outback strips to bustling city airports', 'Clear skies, coastal winds and storms to learn from', 'World-class facilities and skilled instructors', 'Stunning scenery and a friendly culture', 'Consistently ranked among the best globally'],
  },
  {
    slug: 'south-africa', name: 'South Africa', code: 'ZA', authority: 'SACAA', authorityFull: 'South African Civil Aviation Authority', schools: '03', location: 'South Africa',
    intro: 'An emerging premier destination, recognised for diverse programs and excellent facilities that attract students worldwide.',
    training: 'South Africa offers a unique blend of flying environments, from quiet rural airfields to busy international airports. Skilled instructors and varied weather develop confident, adaptable pilots.',
    weather: 'Clear sunny skies with occasional windy and rainy days make an excellent training ground. Diverse weather patterns and landscapes help trainees adapt to different flying challenges.',
    living: 'A vibrant and welcoming country with rich culture and natural beauty, offering international students a strong education system with dedicated instructors and programs designed for success.',
    advIntro: 'Quiet airstrips to busy commercial airports, well-equipped training centres, experienced instructors and varied weather, with breathtaking landscapes.',
    adv: ['SACAA licence with a growing global reputation', 'Rural airfields to busy international airports', 'Clear skies plus windy, rainy days to learn from', 'Well-equipped training centres', 'Experienced instructors', 'Warm hospitality and breathtaking landscapes'],
  },
  {
    slug: 'philippines', name: 'Philippines', code: 'PH', authority: 'CAAP', authorityFull: 'Civil Aviation Authority of the Philippines', schools: '01', location: 'Philippines',
    intro: 'Affordable, high-quality programs, favourable weather and skilled instructors that attract aspiring pilots from around the world.',
    training: 'With a mix of busy urban airports and relaxed regional airfields, trainees in the Philippines gain experience with varied traffic, radio communications, instrument procedures and different flying environments.',
    weather: 'Tropical clear skies, sudden rain showers and variable winds give aspiring pilots experience in many conditions, beautiful islands and dynamic weather make a comprehensive training ground.',
    living: 'Warm, welcoming and safe, with a vibrant culture and beautiful natural attractions. A strong commitment to education, and the Filipino spirit of “bayanihan,” helping one another succeed.',
    advIntro: 'Serene rural airstrips to bustling international airports, dedicated training centres, skilled instructors and tropical weather, with breathtaking islands and warm hospitality.',
    adv: ['CAAP licence with affordable, quality programs', 'Busy urban airports and relaxed regional airfields', 'Tropical weather that teaches adaptability', 'Dedicated training centres and skilled instructors', 'Warm, welcoming and safe', 'The Filipino spirit of “bayanihan”'],
  },
];

export const amenities = [
  { icon: 'home', label: 'Private / shared accommodation' },
  { icon: 'bus', label: 'Transportation' },
  { icon: 'coffee', label: 'Clubhouse' },
  { icon: 'dumbbell', label: 'Gym' },
  { icon: 'waves', label: 'Swimming pool' },
  { icon: 'umbrella', label: 'Recreation areas' },
];

// One clock per destination: the city is only a reference point for the local time.
export const clocks = {
  india: { city: 'Mumbai', tz: 'Asia/Kolkata' },
  usa: { city: 'Florida', tz: 'America/New_York' },
  canada: { city: 'Toronto', tz: 'America/Toronto' },
  europe: { city: 'Central Europe', tz: 'Europe/Paris' },
  'new-zealand': { city: 'Auckland', tz: 'Pacific/Auckland' },
  australia: { city: 'Sydney', tz: 'Australia/Sydney' },
  'south-africa': { city: 'Johannesburg', tz: 'Africa/Johannesburg' },
  philippines: { city: 'Manila', tz: 'Asia/Manila' },
};

// The fourteen reasons to choose the academy, grouped for the home page.
export const featureGroups = [
  { title: 'Classes that fit your life', img: 'ground-school', alt: 'Student pilots listening in a ground class', items: ['Live lectures you can rewatch as often as you need', 'Met, Regs and Nav fully in Hindi or fully in English', 'Offline in Mumbai: Met, Regs and Nav in 2.5 months', 'A different teaching method for each subject', 'Complex subjects made simple, and enjoyable'] },
  { title: 'Support until you pass', img: 'g-14', alt: 'Students working through a ground class together', items: ['Doubts solved by expert teachers', 'Missed a topic? We reschedule the class for you', 'Homework tracked closely, every week', 'Enrolment stays valid for a full year'] },
  { title: 'Fees that make sense', img: 'counselling', alt: 'Counsellor going through a training plan with a student', items: ['Up to 50% lower than other academies', 'Pay in two instalments if you need to', 'A discount if you did ground classes elsewhere', 'Courses finished on or before the committed date'] },
  { title: 'All the way to the cockpit', img: 'pilot-salute', alt: 'Pilot in uniform saluting', items: ['A dedicated team for your DGCA computer number', 'Cadet programme preparation for IndiGo and Air India', 'Guidance like an elder brother, until you fly', 'Verified flight schools in eight countries'] },
];

export const services = [
  { slug: 'counselling', title: 'Free Aviation Counselling', img: 'counselling', alt: 'Counsellor discussing a pilot career plan with students', text: 'Expert, free career counselling to plan your aviation journey, honest guidance on routes, costs and timelines before you spend a rupee.' },
  { slug: 'ground-classes', title: 'DGCA Ground Classes', img: 'ground-school', alt: 'Student pilots in a ground class', text: 'Complete DGCA theory, Air Navigation, Air Regulations, Meteorology and more, live and recorded, in Hindi or English, online or offline in Mumbai.' },
  { slug: 'computer-number', title: '100% Computer Number', img: 'computer-number', alt: 'Trainee pilot at a simulator', text: 'A dedicated team that works solely on getting your DGCA computer number, your aviation roll number, in the first attempt.' },
  { slug: 'flight-schools', title: 'Flight Schools', img: 'canada-2', alt: 'Students beside a training aircraft', text: 'Tie-ups with flight schools in India, USA, Canada, Europe, New Zealand, Australia, South Africa and the Philippines. We only send students to verified schools.' },
  { slug: 'cpp', title: 'CPP Assistance', img: 'airline-crew', alt: 'Two pilots in an airliner cockpit', text: 'Classes for ADAPT, GD/PI, CUT-E and GA/PI for the IndiGo and Air India cadet pilot programs. We are official partners of IndiGo’s flight school, Marigold.' },
  { slug: 'type-rating', title: 'Type Rating Schools', img: 'sim-night', alt: 'Full-flight simulator cockpit at night', text: 'Type rating partners for the Boeing 737, Airbus A320 and ATR in India and Vietnam.' },
  { slug: 'airline-prep', title: 'Airline Preparation', img: 'type-rating', alt: 'Simulator cockpit at sunset', text: 'Mock airline interviews, plus subject preparation matched to each airline’s requirements.' },
];

export const features = [
  { title: 'Full live + recorded lectures', text: 'Attend live, then rewatch every lecture as often as you need.' },
  { title: 'Timely course completion', text: 'We finish the course on or before the committed time.' },
  { title: 'Comprehensive support', text: 'Didn’t understand a topic? We’ll reschedule the class at a time that suits you.' },
  { title: '1-year enrolment validity', text: 'We stay with you even if you face challenges in clearing your exams.' },
  { title: 'Expert doubt solving', text: 'We make sure you stay doubt-free throughout your journey.' },
  { title: 'Fall in love with aviation', text: 'Our teaching makes complex subjects feel simple, and genuinely enjoyable.' },
  { title: 'Come offline in Mumbai', text: 'Do Met, Regs and Nav in 2.5 months offline, and practise in front of your teacher.' },
  { title: 'Affordable fees', text: 'Up to 50% lower than other academies. We have students from every major academy, many simply found us late.' },
  { title: 'Guidance to the cockpit', text: 'Continuous support, like an elder brother, until you reach the cockpit.' },
  { title: 'Homework tracking', text: 'We track your progress closely. Stay honest with it, and you’ll get the best result.' },
  { title: 'Flexible payments', text: 'Facing financial difficulty? Pay your fees in two instalments.' },
  { title: 'Personalised teaching', text: 'A different teaching method for each subject.' },
  { title: 'Hindi or English', text: 'Met, Regs and Nav are available fully in Hindi and fully in English.' },
  { title: 'Offers for experienced students', text: 'Did your ground classes elsewhere? You’ll get a discount so switching feels comfortable.' },
];

export const facilities = [
  { icon: 'monitor', title: 'Modern training facilities', text: 'State-of-the-art equipment for effective, hands-on learning.' },
  { icon: 'gauge', title: 'High-level flight simulators', text: 'Realistic, immersive simulator training, including Microsoft Flight Simulator sessions.' },
  { icon: 'board', title: 'Practical training', text: 'Hands-on practice that builds real-world skills and confidence.' },
  { icon: 'book', title: 'Library & resources', text: 'An extensive library to support in-depth learning and research.' },
  { icon: 'bed', title: 'Student accommodation', text: 'Comfortable stays for a supportive, focused learning environment.' },
  { icon: 'wrench', title: 'Training equipment', text: 'Modern equipment for skill development and real-time learning.' },
  { icon: 'briefcase', title: 'Career support centre', text: 'Guidance on job placement and professional development.' },
  { icon: 'heart', title: 'Health facilities', text: 'Support for student well-being, including emergency medical help.' },
];

export const faqs = [
  { q: 'What are the eligibility criteria to join pilot training?', a: ['You need to have completed 10+2 with Physics and Mathematics and be at least 17 years old. A valid medical fitness certificate (Class 2, then Class 1) is also required.'] },
  { q: 'Do I need prior flying experience?', a: ['No. Our program is designed to train students from the ground up.'] },
  { q: 'How long does pilot training take?', a: ['Typically 12 to 18 months, depending on weather, your progress and the licence type (PPL / CPL).'] },
  { q: 'Which licences do you train for?', a: ['We prepare you for:'], list: ['Private Pilot Licence (PPL)', 'Commercial Pilot Licence (CPL)', 'Type Ratings (optional)'] },
  { q: 'Is the training aligned with DGCA?', a: ['Yes. Our classes follow the official DGCA syllabus and exam pattern, and we only send students to verified flight schools approved by their national aviation authority.'] },
  { q: 'What are the medical requirements?', a: ['You first clear a Class 2 medical, then a Class 1 medical for the CPL. Both are conducted by DGCA-approved medical examiners, we guide you through the process.'] },
];

export const subjects = [
  { code: 'MET', icon: 'cloud', title: 'Air Meteorology', text: 'The atmosphere, clouds, winds and weather systems, and reading the charts, METARs and TAFs pilots rely on.' },
  { code: 'REG', icon: 'file', title: 'Air Regulations', text: 'ICAO annexes, the Aircraft Rules and Civil Aviation Requirements that govern every flight in India.' },
  { code: 'NAV', icon: 'compass', title: 'Air Navigation', text: 'General and radio navigation, charts, instruments and flight planning, including CP / PNR calculations.' },
  { code: 'RTR', icon: 'radio', title: 'Radio Telephony', text: 'R/T procedures and phraseology for clear, confident communication with air traffic control.' },
  { code: 'TECH', icon: 'cpu', title: 'Technical General', text: 'Aircraft systems, engines, principles of flight and instruments, how the machine actually works.' },
];

export const kit = [
  { icon: 'book', title: 'Books' },
  { icon: 'layers', title: 'Study material' },
  { icon: 'list', title: 'Question bank' },
  { icon: 'timer', title: 'DGCA mock tests' },
  { icon: 'id', title: 'Computer number' },
];

export const courses = [
  { cat: 'navigation', lang: 'English', title: 'Air Navigation', text: 'Master navigation techniques, chart work, airspace structure and flight planning for confident pilot operations.' },
  { cat: 'navigation', lang: 'Hindi', title: 'Air Navigation', text: 'Navigation techniques, map reading and airspace concepts explained clearly in Hindi.' },
  { cat: 'navigation', lang: 'English', title: 'General Navigation ATPL', text: 'Advanced navigation techniques, charts and global flight planning essential for ATPL certification.' },
  { cat: 'navigation', lang: 'English', title: 'Navigation Booster', text: 'Focused revision of airspace structure, route planning and map reading to sharpen your basics.' },
  { cat: 'navigation', lang: 'English', title: 'CP & PNR', text: 'Critical point and point of no return calculations essential for flight planning and safe operations.' },
  { cat: 'regulations', lang: 'English', title: 'Air Regulations', text: 'Aviation law, flight rules and international safety regulations, taught in English.' },
  { cat: 'regulations', lang: 'Hindi', title: 'Air Regulations', text: 'Aviation rules, flight procedures and safety regulations explained clearly in Hindi.' },
  { cat: 'regulations', lang: 'English', title: 'Booster Regulations', text: 'High-impact revision sessions that strengthen your grip on rules and procedures before the exam.' },
  { cat: 'meteorology', lang: 'English', title: 'Meteorology', text: 'Weather principles, atmospheric conditions and forecasting skills crucial for safe operations.' },
  { cat: 'meteorology', lang: 'Hindi', title: 'Meteorology', text: 'Weather patterns, atmospheric conditions and forecasting explained clearly in Hindi.' },
  { cat: 'meteorology', lang: 'English', title: 'Meteorology II', text: 'Weather systems, atmospheric dynamics and aviation climatology at an advanced level.' },
  { cat: 'technical', lang: 'English', title: 'Instruments', text: 'Aircraft instruments, how they work and how to interpret them for safe, accurate flying.' },
  { cat: 'tests', lang: 'English', title: 'Navigation Tests', text: 'Structured, exam-level tests in air navigation, map reading and route planning.' },
  { cat: 'tests', lang: 'English', title: 'Regulations Tests', text: 'Evaluate your knowledge of rules, flight procedures and safety regulations.' },
  { cat: 'tests', lang: 'English', title: 'Meteorology Tests', text: 'Test your weather knowledge, forecasting and atmospheric understanding.' },
  { cat: 'tests', lang: 'English', title: 'Previous Month Papers', text: 'Practise last month’s Navigation, Regulations and Meteorology papers to boost accuracy and confidence.' },
  { cat: 'demo', lang: 'Free', title: 'Navigation Demo', text: 'A live demonstration of navigation techniques, map reading and route planning.' },
  { cat: 'demo', lang: 'Free', title: 'Regulations Demo', text: 'A practical demonstration of essential regulations, flight rules and legal procedures.' },
  { cat: 'demo', lang: 'Free', title: 'Meteorology Demo', text: 'See how we teach weather interpretation and forecasting before you enrol.' },
];

export const courseCats = [
  { id: 'all', label: 'All courses' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'regulations', label: 'Regulations' },
  { id: 'meteorology', label: 'Meteorology' },
  { id: 'technical', label: 'Technical' },
  { id: 'tests', label: 'Tests & papers' },
  { id: 'demo', label: 'Free demos' },
];

export const posts = [
  { title: 'Ready for Takeoff? Everything You Need to Know About Pilot Training in Mumbai', date: '2025-08-05', img: 'g-03', text: 'If you’re passionate about flying, choosing the right path to become a commercial pilot is crucial, here’s where to start in Mumbai.', href: 'https://pilotpreparationacademy.com/ready-for-takeoff-heres-everything-you-need-to-know-about-pilot-training-in-mumbai/' },
  { title: 'Aviation Courses in Mumbai: A Guide to Launching Your Career', date: '2025-08-05', img: 'classroom', text: 'Mumbai’s international airport makes the city a major gateway to India’s booming aviation sector. Here’s how to make the most of it.', href: 'https://pilotpreparationacademy.com/aviation-courses-in-mumbai-a-guide-to-launching-your-career/' },
  { title: '5 Reasons to Choose an Airline Pilot Career in 2025', date: '2025-08-05', img: 'pilot-salute', text: 'Ever thought about a career that lets you fly high, literally? Five reasons the cockpit might be your calling.', href: 'https://pilotpreparationacademy.com/5-reasons-to-choose-an-airline-pilot-career-in-2025/' },
];

export const gallery = [
  ['g-01', 'Pilot and cabin crew in front of an aircraft'], ['g-16', 'Twin-engine training aircraft on the apron'], ['g-02', 'Pilots walking on the apron'],
  ['g-09', 'Briefing room at the academy'], ['g-05', 'Pilot in a flight helmet in the cockpit'], ['g-17', 'Student flying with an instructor'],
  ['g-03', 'Pilot in an airliner cockpit'], ['g-18', 'Student pilot beside a training aircraft'], ['g-10', 'Classroom at the academy'],
  ['g-04', 'Pilot with a headset in the cockpit'], ['g-13', 'Students with a training aircraft'], ['g-06', 'Aviator in a flight helmet beside an aircraft'],
  ['g-12', 'Aircraft parked inside a hangar'], ['g-14', 'Students in a ground class'], ['g-07', 'Aviator walking on the airfield'],
  ['g-11', 'Study space at the academy'], ['g-15', 'Student pilots in uniform'], ['g-08', 'Pilot at the controls'],
  ['g-20', 'Instructor congratulating a student beside an aircraft'], ['g-19', 'Student group in front of a hangar'],
];
