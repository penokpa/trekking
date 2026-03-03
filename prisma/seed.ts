import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.pageView.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.customPage.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.trekImage.deleteMany();
  await prisma.trek.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.agencyMember.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ─────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const agencyPassword = await bcrypt.hash("Agency@123", 12);

  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@trekking.app",
      name: "Super Admin",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
    },
  });

  const agencyAdmin = await prisma.user.create({
    data: {
      email: "ramesh@himalayatreks.com",
      name: "Ramesh Sharma",
      passwordHash: agencyPassword,
      role: "AGENCY_ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("  Users created");

  // ── Plans ─────────────────────────────────────────────
  const starterPlan = await prisma.plan.create({
    data: {
      name: "Starter",
      slug: "starter",
      price: 29,
      interval: "MONTHLY",
      limits: { treks: 10, blogPosts: 20, galleryImages: 50, teamMembers: 5 },
      features: ["Custom subdomain", "Basic analytics", "Email support"],
      isActive: true,
    },
  });

  await prisma.plan.create({
    data: {
      name: "Professional",
      slug: "professional",
      price: 79,
      interval: "MONTHLY",
      limits: { treks: 50, blogPosts: 100, galleryImages: 500, teamMembers: 20 },
      features: [
        "Custom domain",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "SEO tools",
      ],
      isActive: true,
    },
  });

  await prisma.plan.create({
    data: {
      name: "Enterprise",
      slug: "enterprise",
      price: 199,
      interval: "MONTHLY",
      limits: { treks: -1, blogPosts: -1, galleryImages: -1, teamMembers: -1 },
      features: [
        "Everything in Professional",
        "Unlimited resources",
        "White-label solution",
        "Dedicated support",
        "API access",
        "Custom integrations",
      ],
      isActive: true,
    },
  });

  console.log("  Plans created");

  // ── Agency ────────────────────────────────────────────
  const agency = await prisma.agency.create({
    data: {
      name: "Himalaya Treks & Expeditions",
      slug: "himalaya-treks",
      logo: null,
      status: "ACTIVE",
      brandColors: {
        primary: "142.1 76.2% 36.3%",
        primaryForeground: "355.7 100% 97.3%",
        accent: "142.1 76.2% 36.3%",
      },
      contactInfo: {
        email: "info@himalayatreks.com",
        phone: "+977-1-4444567",
        address: "Thamel, Kathmandu, Nepal",
      },
      socialLinks: {
        facebook: "https://facebook.com/himalayatreks",
        instagram: "https://instagram.com/himalayatreks",
        twitter: "https://twitter.com/himalayatreks",
        youtube: "https://youtube.com/himalayatreks",
      },
      aboutText:
        "Himalaya Treks & Expeditions is a leading trekking and expedition company based in Kathmandu, Nepal. With over 15 years of experience, we specialize in organizing trekking, mountaineering, and adventure tours across the Himalayas.",
      footerText: "Himalaya Treks & Expeditions - Your Gateway to the Himalayas",
      stats: { treksCompleted: 500, happyClients: 3000, yearsExperience: 15 },
    },
  });

  // Link agency admin to agency
  await prisma.agencyMember.create({
    data: {
      userId: agencyAdmin.id,
      agencyId: agency.id,
      role: "OWNER",
    },
  });

  // Create subscription
  const now = new Date();
  const nextYear = new Date(now);
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  await prisma.subscription.create({
    data: {
      agencyId: agency.id,
      planId: starterPlan.id,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: nextYear,
    },
  });

  console.log("  Agency created");

  // ── Treks ─────────────────────────────────────────────
  const ebcTrek = await prisma.trek.create({
    data: {
      agencyId: agency.id,
      title: "Everest Base Camp Trek",
      slug: "everest-base-camp",
      summary:
        "The classic trek to the base of the world's highest mountain. Walk through Sherpa villages, monasteries, and breathtaking mountain scenery.",
      description:
        "The Everest Base Camp trek is one of the most iconic treks in the world. Starting from Lukla, you'll trek through the beautiful Khumbu region, passing through Sherpa villages like Namche Bazaar and Tengboche. The trek offers stunning views of Everest, Lhotse, Nuptse, and Ama Dablam. You'll visit the famous Tengboche Monastery and experience the unique Sherpa culture. The highlight is reaching Everest Base Camp at 5,364m and climbing Kala Patthar for the best panoramic views of Everest.",
      duration: 14,
      difficulty: "CHALLENGING",
      maxAltitude: 5545,
      groupSize: 12,
      priceFrom: 1450,
      itinerary: [
        { day: 1, title: "Fly to Lukla, trek to Phakding", description: "Scenic flight from Kathmandu to Lukla (2,840m), then a gentle trek to Phakding (2,610m).", altitude: 2610 },
        { day: 2, title: "Trek to Namche Bazaar", description: "Trek along the Dudh Kosi river, cross suspension bridges, and ascend to Namche Bazaar (3,440m).", altitude: 3440 },
        { day: 3, title: "Acclimatization day in Namche", description: "Explore Namche Bazaar, visit the Sherpa Museum, and take an acclimatization hike to Everest View Hotel.", altitude: 3440 },
        { day: 4, title: "Trek to Tengboche", description: "Trek through rhododendron forests to Tengboche (3,870m), home to the famous monastery.", altitude: 3870 },
        { day: 5, title: "Trek to Dingboche", description: "Continue through alpine terrain to Dingboche (4,410m) with views of Island Peak and Ama Dablam.", altitude: 4410 },
        { day: 6, title: "Acclimatization day in Dingboche", description: "Rest day with optional hike to Nagarjun Hill for panoramic views.", altitude: 4410 },
        { day: 7, title: "Trek to Lobuche", description: "Pass the Chukpi Lhara memorials and trek to Lobuche (4,940m).", altitude: 4940 },
        { day: 8, title: "Trek to Gorak Shep, visit EBC", description: "Trek to Gorak Shep (5,170m), then continue to Everest Base Camp (5,364m).", altitude: 5364 },
        { day: 9, title: "Kala Patthar, trek to Pheriche", description: "Early morning climb to Kala Patthar (5,545m) for sunrise views, then descend to Pheriche.", altitude: 4240 },
        { day: 10, title: "Trek to Namche Bazaar", description: "Retrace steps back to Namche Bazaar.", altitude: 3440 },
        { day: 11, title: "Trek to Lukla", description: "Final day of trekking back to Lukla.", altitude: 2840 },
        { day: 12, title: "Fly back to Kathmandu", description: "Morning flight from Lukla to Kathmandu. Transfer to hotel.", altitude: 1400 },
      ],
      includes: [
        "Airport transfers",
        "Domestic flights (Kathmandu-Lukla-Kathmandu)",
        "All meals during trek",
        "Experienced trekking guide",
        "Porter service",
        "Lodge accommodation",
        "TIMS permit and national park fees",
        "First aid kit",
      ],
      excludes: [
        "International flights",
        "Travel insurance",
        "Personal expenses",
        "Tips for guide and porters",
        "Extra meals in Kathmandu",
        "Alcoholic and cold beverages",
      ],
      status: "PUBLISHED",
      featured: true,
      region: "Khumbu",
      bestSeason: "March-May, September-November",
    },
  });

  const acTrek = await prisma.trek.create({
    data: {
      agencyId: agency.id,
      title: "Annapurna Circuit Trek",
      slug: "annapurna-circuit",
      summary:
        "A classic trek around the Annapurna massif, crossing the Thorong La pass at 5,416m with diverse landscapes from subtropical to alpine.",
      description:
        "The Annapurna Circuit is considered one of the best long-distance treks in the world. The trail encircles the Annapurna massif, taking you through diverse terrain from lush subtropical forests to arid high-altitude desert landscapes. The highlight is crossing the Thorong La Pass at 5,416m. Along the way, you'll experience the unique culture of the Gurung and Thakali people, visit ancient monasteries, and soak in natural hot springs at Tatopani.",
      duration: 18,
      difficulty: "STRENUOUS",
      maxAltitude: 5416,
      groupSize: 10,
      priceFrom: 1200,
      itinerary: [
        { day: 1, title: "Drive to Besisahar, trek to Khudi", altitude: 790 },
        { day: 2, title: "Trek to Bahundanda", altitude: 1310 },
        { day: 3, title: "Trek to Chamje", altitude: 1430 },
        { day: 4, title: "Trek to Bagarchhap", altitude: 2160 },
        { day: 5, title: "Trek to Chame", altitude: 2670 },
        { day: 6, title: "Trek to Pisang", altitude: 3200 },
        { day: 7, title: "Trek to Manang", altitude: 3540 },
        { day: 8, title: "Acclimatization in Manang", altitude: 3540 },
        { day: 9, title: "Trek to Yak Kharka", altitude: 4050 },
        { day: 10, title: "Trek to Thorong Phedi", altitude: 4525 },
        { day: 11, title: "Cross Thorong La, descend to Muktinath", altitude: 3760 },
        { day: 12, title: "Trek to Jomsom", altitude: 2720 },
        { day: 13, title: "Trek to Tatopani", altitude: 1190 },
        { day: 14, title: "Trek to Ghorepani", altitude: 2860 },
        { day: 15, title: "Poon Hill sunrise, trek to Tadapani", altitude: 2630 },
        { day: 16, title: "Trek to Ghandruk", altitude: 1940 },
        { day: 17, title: "Trek to Nayapul, drive to Pokhara", altitude: 1070 },
        { day: 18, title: "Drive or fly to Kathmandu", altitude: 1400 },
      ],
      includes: [
        "All ground transportation",
        "All meals during trek",
        "Experienced guide and porters",
        "Lodge accommodation",
        "TIMS and ACAP permits",
        "First aid kit",
      ],
      excludes: [
        "International flights",
        "Travel insurance",
        "Personal expenses",
        "Tips",
        "Alcoholic beverages",
      ],
      status: "PUBLISHED",
      featured: true,
      region: "Annapurna",
      bestSeason: "March-May, October-November",
    },
  });

  const lvTrek = await prisma.trek.create({
    data: {
      agencyId: agency.id,
      title: "Langtang Valley Trek",
      slug: "langtang-valley",
      summary:
        "A beautiful trek through the Langtang Valley, known for its stunning mountain scenery, Tamang culture, and cheese factories.",
      description:
        "The Langtang Valley Trek is a wonderful alternative to the more crowded Everest and Annapurna regions. Located just north of Kathmandu, the Langtang region offers spectacular mountain scenery, rich Tamang culture, and a less commercialized trekking experience. The trek takes you through beautiful forests of rhododendron and bamboo, past traditional villages, and into the glacial valley beneath Langtang Lirung (7,227m).",
      duration: 10,
      difficulty: "MODERATE",
      maxAltitude: 4984,
      groupSize: 12,
      priceFrom: 850,
      itinerary: [
        { day: 1, title: "Drive to Syabrubesi", altitude: 1550 },
        { day: 2, title: "Trek to Lama Hotel", altitude: 2380 },
        { day: 3, title: "Trek to Langtang Village", altitude: 3430 },
        { day: 4, title: "Trek to Kyanjin Gompa", altitude: 3870 },
        { day: 5, title: "Explore Kyanjin Ri or Tserko Ri", altitude: 4984 },
        { day: 6, title: "Trek back to Lama Hotel", altitude: 2380 },
        { day: 7, title: "Trek to Thulo Syabru", altitude: 2210 },
        { day: 8, title: "Trek to Shin Gompa", altitude: 3250 },
        { day: 9, title: "Trek to Gosaikunda", altitude: 4380 },
        { day: 10, title: "Return to Kathmandu via Syabrubesi", altitude: 1400 },
      ],
      includes: [
        "Transportation to/from trailhead",
        "All meals during trek",
        "Guide and porter",
        "Lodge accommodation",
        "National park permits",
      ],
      excludes: [
        "International flights",
        "Travel insurance",
        "Personal expenses",
        "Tips",
      ],
      status: "PUBLISHED",
      featured: false,
      region: "Langtang",
      bestSeason: "March-May, October-November",
    },
  });

  console.log("  Treks created");

  // ── Blog Posts ────────────────────────────────────────
  await prisma.blogPost.createMany({
    data: [
      {
        agencyId: agency.id,
        title: "Top 10 Things to Pack for Your Himalayan Trek",
        slug: "packing-guide-himalayan-trek",
        excerpt:
          "Packing for a Himalayan trek can be daunting. Here's our definitive guide to the essentials you need.",
        body: "When preparing for a trek in the Himalayas, having the right gear can make the difference between a comfortable journey and a miserable one. Here are the top 10 items you absolutely must pack:\n\n1. **Quality Hiking Boots** — Invest in waterproof, ankle-supporting boots that you've broken in well before the trek.\n\n2. **Layered Clothing** — The temperature varies dramatically with altitude. Pack moisture-wicking base layers, insulating mid-layers, and a waterproof outer shell.\n\n3. **Down Jacket** — Essential for cold mornings and high-altitude evenings.\n\n4. **Sleeping Bag** — A good quality sleeping bag rated to at least -10°C is essential.\n\n5. **Trekking Poles** — They reduce strain on your knees during descents and help with stability.\n\n6. **Water Purification** — Carry water purification tablets or a UV sterilizer.\n\n7. **Sun Protection** — High-altitude sun is intense. Pack SPF 50+ sunscreen, quality sunglasses, and a wide-brimmed hat.\n\n8. **First Aid Kit** — Include altitude sickness medication, blister treatment, and basic medications.\n\n9. **Headlamp** — Essential for early morning starts and navigating teahouses.\n\n10. **Dry Bags** — Keep your electronics and important items protected from rain.",
        featuredImage: null,
        category: "Travel Tips",
        tags: ["packing", "gear", "tips", "preparation"],
        authorId: agencyAdmin.id,
        status: "PUBLISHED",
      },
      {
        agencyId: agency.id,
        title: "Understanding Altitude Sickness: Prevention and Treatment",
        slug: "altitude-sickness-guide",
        excerpt:
          "Learn about altitude sickness, its symptoms, and how to prevent it during your trek.",
        body: "Altitude sickness, or Acute Mountain Sickness (AMS), is a common concern for trekkers heading to high altitudes. Understanding the symptoms and prevention methods is crucial for a safe trek.\n\n## What is Altitude Sickness?\n\nAltitude sickness occurs when your body doesn't have enough time to adjust to the lower oxygen levels at higher elevations. It typically starts above 2,500 meters.\n\n## Symptoms\n\n- Headache\n- Nausea and vomiting\n- Dizziness\n- Fatigue\n- Loss of appetite\n- Difficulty sleeping\n\n## Prevention\n\n1. **Ascend gradually** — Follow the golden rule: climb high, sleep low.\n2. **Stay hydrated** — Drink at least 3-4 liters of water daily.\n3. **Acclimatization days** — Include rest days in your itinerary.\n4. **Avoid alcohol** — Alcohol can worsen dehydration and symptoms.\n5. **Medication** — Consult your doctor about Diamox (Acetazolamide).\n\n## When to Descend\n\nIf symptoms worsen despite rest and medication, the only cure is to descend immediately. Never continue ascending with symptoms of AMS.",
        featuredImage: null,
        category: "Health & Safety",
        tags: ["altitude sickness", "health", "safety", "tips"],
        authorId: agencyAdmin.id,
        status: "PUBLISHED",
      },
      {
        agencyId: agency.id,
        title: "Best Time to Visit Nepal for Trekking",
        slug: "best-time-visit-nepal",
        excerpt:
          "Planning your Nepal trip? Discover the best seasons for trekking in the Himalayas.",
        body: "Nepal offers trekking opportunities year-round, but certain seasons provide significantly better conditions.\n\n## Autumn (October-November)\n\nThe most popular trekking season. Clear skies, stable weather, and excellent visibility make this the ideal time. The trails are busy but the conditions are unbeatable.\n\n## Spring (March-May)\n\nThe second-best season. Rhododendrons bloom in spectacular fashion, and the weather is generally stable. Late spring can bring afternoon clouds and occasional rain.\n\n## Winter (December-February)\n\nCold but clear conditions. Lower elevations are pleasant, but high passes may be snow-covered and dangerous. Fewer trekkers mean a more peaceful experience.\n\n## Summer/Monsoon (June-September)\n\nThe monsoon brings heavy rain, leeches, and poor visibility. However, the rain shadow areas like Upper Mustang and Dolpo remain relatively dry and are excellent choices for this season.",
        featuredImage: null,
        category: "Travel Tips",
        tags: ["nepal", "seasons", "weather", "planning"],
        authorId: agencyAdmin.id,
        status: "PUBLISHED",
      },
    ],
  });

  console.log("  Blog posts created");

  // ── Gallery Images ────────────────────────────────────
  await prisma.galleryImage.createMany({
    data: [
      { agencyId: agency.id, imageUrl: "/images/gallery/everest-view.jpg", caption: "Everest as seen from Kala Patthar", album: "Everest Region", displayOrder: 1 },
      { agencyId: agency.id, imageUrl: "/images/gallery/namche-bazaar.jpg", caption: "The bustling town of Namche Bazaar", album: "Everest Region", displayOrder: 2 },
      { agencyId: agency.id, imageUrl: "/images/gallery/annapurna-sunrise.jpg", caption: "Sunrise over the Annapurna range from Poon Hill", album: "Annapurna Region", displayOrder: 3 },
      { agencyId: agency.id, imageUrl: "/images/gallery/thorong-la-pass.jpg", caption: "Trekkers at Thorong La Pass (5,416m)", album: "Annapurna Region", displayOrder: 4 },
      { agencyId: agency.id, imageUrl: "/images/gallery/langtang-valley.jpg", caption: "The beautiful Langtang Valley", album: "Langtang Region", displayOrder: 5 },
    ],
  });

  console.log("  Gallery images created");

  // ── Team Members ──────────────────────────────────────
  await prisma.teamMember.createMany({
    data: [
      {
        agencyId: agency.id,
        name: "Ramesh Sharma",
        title: "Founder & Lead Guide",
        bio: "With over 15 years of mountaineering and trekking experience, Ramesh has led hundreds of successful expeditions across the Himalayas. He is a certified mountain guide and passionate about sharing Nepal's beauty with the world.",
        displayOrder: 1,
      },
      {
        agencyId: agency.id,
        name: "Pemba Sherpa",
        title: "Senior Trekking Guide",
        bio: "Born in the Khumbu region, Pemba has an intimate knowledge of the Everest trails. He has summited Everest twice and brings unparalleled expertise to every trek he leads.",
        displayOrder: 2,
      },
      {
        agencyId: agency.id,
        name: "Sita Gurung",
        title: "Operations Manager",
        bio: "Sita manages all logistics and ensures every trek runs smoothly. Her attention to detail and organizational skills keep everything on track.",
        displayOrder: 3,
      },
    ],
  });

  console.log("  Team members created");

  // ── FAQs ──────────────────────────────────────────────
  await prisma.fAQ.createMany({
    data: [
      {
        agencyId: agency.id,
        question: "Do I need prior trekking experience?",
        answer: "For most of our treks, no prior experience is needed. However, a good level of fitness is recommended. For more challenging treks like Everest Base Camp, some previous hiking experience is beneficial. We provide detailed fitness guidelines for each trek.",
        category: "General",
        displayOrder: 1,
      },
      {
        agencyId: agency.id,
        question: "What is included in the trek price?",
        answer: "Our trek prices typically include all ground transportation, accommodation during the trek, meals (breakfast, lunch, and dinner), experienced guides and porters, necessary permits, and first aid equipment. Please check individual trek pages for specific inclusions.",
        category: "Pricing",
        displayOrder: 2,
      },
      {
        agencyId: agency.id,
        question: "How do I prepare for altitude sickness?",
        answer: "We build acclimatization days into our itineraries. We recommend staying hydrated, ascending gradually, and consulting your doctor about preventive medication like Diamox. Our guides are trained to recognize symptoms and manage altitude-related issues.",
        category: "Health",
        displayOrder: 3,
      },
      {
        agencyId: agency.id,
        question: "What travel insurance do I need?",
        answer: "We require all trekkers to have comprehensive travel insurance that covers trekking at altitude (up to the maximum altitude of your chosen trek) and emergency helicopter evacuation. We can recommend reliable insurance providers.",
        category: "General",
        displayOrder: 4,
      },
      {
        agencyId: agency.id,
        question: "Can I customize a trek itinerary?",
        answer: "Absolutely! We offer fully customizable private treks. Contact us with your preferences — duration, difficulty, regions of interest — and we'll create a tailored itinerary just for you.",
        category: "Booking",
        displayOrder: 5,
      },
    ],
  });

  console.log("  FAQs created");

  // ── Testimonials ──────────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      {
        agencyId: agency.id,
        clientName: "Sarah Johnson",
        country: "United States",
        trekId: ebcTrek.id,
        rating: 5,
        reviewText: "The Everest Base Camp trek was a life-changing experience! Ramesh and his team were incredibly professional, knowledgeable, and caring. They made sure we were safe and comfortable throughout the journey. I can't recommend Himalaya Treks enough!",
        featured: true,
        date: new Date("2024-11-15"),
      },
      {
        agencyId: agency.id,
        clientName: "Marco Weber",
        country: "Germany",
        trekId: acTrek.id,
        rating: 5,
        reviewText: "The Annapurna Circuit was breathtaking! The diversity of landscapes is unlike anything I've experienced. Our guide Pemba was fantastic — his knowledge of the region and culture added so much to the experience.",
        featured: true,
        date: new Date("2024-10-20"),
      },
      {
        agencyId: agency.id,
        clientName: "Yuki Tanaka",
        country: "Japan",
        trekId: lvTrek.id,
        rating: 4,
        reviewText: "Beautiful trek through the Langtang Valley. Less crowded than other popular routes and the Tamang hospitality was wonderful. The cheese factory was a fun surprise! Great organization by the team.",
        featured: false,
        date: new Date("2024-09-05"),
      },
    ],
  });

  console.log("  Testimonials created");

  // ── Banner ────────────────────────────────────────────
  await prisma.banner.create({
    data: {
      agencyId: agency.id,
      title: "Spring Season 2025",
      subtitle: "Book your Himalayan adventure now — early bird discounts available!",
      ctaText: "View Treks",
      ctaLink: "/treks",
      location: "HOME",
      status: "ACTIVE",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-05-31"),
    },
  });

  console.log("  Banner created");

  // ── Inquiries ─────────────────────────────────────────
  await prisma.inquiry.createMany({
    data: [
      {
        agencyId: agency.id,
        trekId: ebcTrek.id,
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1-555-0123",
        country: "United Kingdom",
        travelDates: "April 2025",
        groupSize: 4,
        message: "Hi, we're a group of 4 friends interested in the EBC trek in April. Do you have availability? We'd also like to know about the accommodation quality along the route.",
        status: "NEW",
      },
      {
        agencyId: agency.id,
        trekId: acTrek.id,
        name: "Emma Wilson",
        email: "emma.w@email.com",
        country: "Australia",
        travelDates: "October 2025",
        groupSize: 2,
        message: "My partner and I are planning to do the Annapurna Circuit in October. Is it possible to do a shorter version of the circuit? We have about 12 days available.",
        status: "READ",
      },
      {
        agencyId: agency.id,
        name: "Carlos Rodriguez",
        email: "carlos.r@email.com",
        phone: "+34-612-345678",
        country: "Spain",
        message: "I'm interested in a custom trek in the Manaslu region. Could you put together an itinerary for about 15 days in November? I have experience with high-altitude trekking.",
        status: "REPLIED",
      },
    ],
  });

  console.log("  Inquiries created");

  // ── Page Views (sample analytics) ─────────────────────
  const paths = ["/", "/treks", "/treks/everest-base-camp", "/treks/annapurna-circuit", "/about", "/blog", "/gallery", "/contact", "/faqs"];
  const countries = ["US", "UK", "DE", "AU", "JP", "FR", "CA", "NL", "IN", "NP"];
  const referrers = ["https://google.com", "https://instagram.com", "https://facebook.com", null, "direct"];

  const pageViewData = Array.from({ length: 50 }, (_, i) => {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      agencyId: agency.id,
      path: paths[Math.floor(Math.random() * paths.length)],
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      userAgent: "Mozilla/5.0 (compatible; seed-data)",
      createdAt: date,
    };
  });

  await prisma.pageView.createMany({ data: pageViewData });

  console.log("  Page views created");

  console.log("\nSeeding complete!");
  console.log("\nTest accounts:");
  console.log(`  Super Admin: admin@trekking.app / Admin@123`);
  console.log(`  Agency Admin: ramesh@himalayatreks.com / Agency@123`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
