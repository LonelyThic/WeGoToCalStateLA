const DAY_MS = 24 * 60 * 60 * 1000;

function formatMockDate(daysFromToday) {
  const date = new Date(Date.now() + daysFromToday * DAY_MS);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// MOCK EVENT DATA START
// Remove this seeded EVENTS array and reset NEXT_ID when events come from the real backend/API.
// THIS MOCK DATA IS ONLY TO SHOW HOW THE EVENT PAGE WILL LOOK AND FUNCTION.
let NEXT_ID = 14;
let EVENTS = [
  {
    id: "1",
    title: "Mindful Morning Walk",
    caption: "Mindful Morning Walk",
    description: "Start the day with a calm campus walk and a few grounding exercises.",
    text: "Start the day with a calm campus walk and a few grounding exercises.",
    imageUri: "https://picsum.photos/seed/wego-mindful-walk/800/500",
    date: formatMockDate(5),
    time: "9:00 AM",
    location: "Campus Garden",
    createdAt: Date.now() - 1000 * 60 * 75,
  },
  {
    id: "2",
    title: "Stress Less Study Session",
    caption: "Stress Less Study Session",
    description: "Join a guided focus block with breaks, breathing prompts, and peer support.",
    text: "Join a guided focus block with breaks, breathing prompts, and peer support.",
    imageUri: "https://picsum.photos/seed/wego-study-session/800/500",
    date: formatMockDate(12),
    time: "4:00 PM",
    location: "Library Room 204",
    createdAt: Date.now() - 1000 * 60 * 65,
  },
  {
    id: "3",
    title: "Wellness Resource Fair",
    caption: "Wellness Resource Fair",
    description: "Meet campus wellness partners and discover support resources in one place.",
    text: "Meet campus wellness partners and discover support resources in one place.",
    imageUri: "https://picsum.photos/seed/wego-resource-fair/800/500",
    date: formatMockDate(24),
    time: "1:30 PM",
    location: "Student Union Plaza",
    createdAt: Date.now() - 1000 * 60 * 55,
  },
  {
    id: "4",
    title: "Campus Yoga Break",
    caption: "Campus Yoga Break",
    description: "Take a low-pressure movement break with beginner-friendly stretches and breathing.",
    text: "Take a low-pressure movement break with beginner-friendly stretches and breathing.",
    imageUri: "https://picsum.photos/seed/wego-yoga-break/800/500",
    date: formatMockDate(28),
    time: "12:15 PM",
    location: "Recreation Lawn",
    createdAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: "5",
    title: "Sleep Skills Workshop",
    caption: "Sleep Skills Workshop",
    description: "Learn practical evening routines, screen habits, and rest strategies before finals.",
    text: "Learn practical evening routines, screen habits, and rest strategies before finals.",
    imageUri: "https://picsum.photos/seed/wego-sleep-skills/800/500",
    date: formatMockDate(38),
    time: "5:30 PM",
    location: "Wellness Center Room 110",
    createdAt: Date.now() - 1000 * 60 * 40,
  },
  {
    id: "6",
    title: "End-of-Term Reset Workshop",
    caption: "End-of-Term Reset Workshop",
    description: "Plan a healthier close to the term with reflection, routines, and reset strategies.",
    text: "Plan a healthier close to the term with reflection, routines, and reset strategies.",
    imageUri: "https://picsum.photos/seed/wego-reset-workshop/800/500",
    date: formatMockDate(45),
    time: "2:00 PM",
    location: "Wellness Center",
    createdAt: Date.now() - 1000 * 60 * 35,
  },
  {
    id: "7",
    title: "Creative Reset Night",
    caption: "Creative Reset Night",
    description: "Unwind with journaling, art prompts, music, and a quiet space to decompress.",
    text: "Unwind with journaling, art prompts, music, and a quiet space to decompress.",
    imageUri: "https://picsum.photos/seed/wego-creative-reset/800/500",
    date: formatMockDate(52),
    time: "6:00 PM",
    location: "Student Union Lounge",
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "8",
    title: "Peer Support Circle",
    caption: "Peer Support Circle",
    description: "A facilitated community check-in focused on connection, reflection, and mutual support.",
    text: "A facilitated community check-in focused on connection, reflection, and mutual support.",
    imageUri: "https://picsum.photos/seed/wego-support-circle/800/500",
    date: formatMockDate(67),
    time: "3:00 PM",
    location: "Community Room B",
    createdAt: Date.now() - 1000 * 60 * 25,
  },
  {
    id: "9",
    title: "Nutrition for Energy Talk",
    caption: "Nutrition for Energy Talk",
    description: "Discuss simple meal planning and snack ideas for steady energy during busy weeks.",
    text: "Discuss simple meal planning and snack ideas for steady energy during busy weeks.",
    imageUri: "https://picsum.photos/seed/wego-nutrition-talk/800/500",
    date: formatMockDate(81),
    time: "11:00 AM",
    location: "Health Education Kitchen",
    createdAt: Date.now() - 1000 * 60 * 20,
  },
  {
    id: "10",
    title: "Mindfulness Mini Retreat",
    caption: "Mindfulness Mini Retreat",
    description: "Spend a slower afternoon with guided meditation, reflection, and gentle reset practices.",
    text: "Spend a slower afternoon with guided meditation, reflection, and gentle reset practices.",
    imageUri: "https://picsum.photos/seed/wego-mini-retreat/800/500",
    date: formatMockDate(96),
    time: "1:00 PM",
    location: "Campus Garden Pavilion",
    createdAt: Date.now() - 1000 * 60 * 15,
  },
  {
    id: "11",
    title: "Financial Wellness Basics",
    caption: "Financial Wellness Basics",
    description: "Build confidence around budgeting, financial aid timelines, and everyday money decisions.",
    text: "Build confidence around budgeting, financial aid timelines, and everyday money decisions.",
    imageUri: "https://picsum.photos/seed/wego-financial-wellness/800/500",
    date: formatMockDate(110),
    time: "10:30 AM",
    location: "Student Services Room 215",
    createdAt: Date.now() - 1000 * 60 * 14,
  },
  {
    id: "12",
    title: "Healthy Boundaries Seminar",
    caption: "Healthy Boundaries Seminar",
    description: "Explore communication tools for school, work, relationships, and personal downtime.",
    text: "Explore communication tools for school, work, relationships, and personal downtime.",
    imageUri: "https://picsum.photos/seed/wego-boundaries-seminar/800/500",
    date: formatMockDate(139),
    time: "4:30 PM",
    location: "King Hall D105",
    createdAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: "13",
    title: "Resilience Skills Lab",
    caption: "Resilience Skills Lab",
    description: "Practice problem-solving, grounding, and recovery strategies for stressful seasons.",
    text: "Practice problem-solving, grounding, and recovery strategies for stressful seasons.",
    imageUri: "https://picsum.photos/seed/wego-resilience-lab/800/500",
    date: formatMockDate(153),
    time: "2:45 PM",
    location: "Wellness Center Studio",
    createdAt: Date.now() - 1000 * 60 * 11,
  },
];
// MOCK EVENT DATA END

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getEvents() {
  await delay();
  return EVENTS.map((event) => ({ ...event }));
}

export async function getEvent(eventId) {
  await delay();
  return EVENTS.find((event) => String(event.id) === String(eventId)) ?? null;
}

export async function createEvent(data) {
  await delay();

  const title = data.title || data.caption || "";
  const description = data.description || data.text || "";
  const event = {
    id: String(NEXT_ID++),
    title,
    caption: title,
    description,
    text: description,
    imageUri: data.imageUri || null,
    date: data.date || "",
    time: data.time || "",
    location: data.location || "",
    createdAt: data.createdAt ?? Date.now(),
  };

  EVENTS = [event, ...EVENTS];
  return event;
}
