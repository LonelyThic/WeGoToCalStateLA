let NEXT_ID = 3;

let THREADS = [
  {
    id: "1",
    author: "WeGo Team",
    caption: "Welcome to WeGo threads! Share thoughts and support each other.",
    text: "Welcome to WeGo threads! Share thoughts and support each other.",
    likes: 24,
    imageUri: null,
    date: "",
    time: "",
    location: "",
    createdAt: Date.now() - 1000 * 60 * 60,
    replies: [
      {
        id: "r1",
        author: "Student A",
        text: "Excited to try this out!",
        createdAt: Date.now() - 1000 * 60 * 30,
      },
    ],
  },
  {
    id: "2",
    author: "Student B",
    caption: "Any tips for staying focused during midterms?",
    text: "Any tips for staying focused during midterms?",
    likes: 156,
    imageUri: null,
    date: "",
    time: "",
    location: "",
    createdAt: Date.now() - 1000 * 60 * 10,
    replies: [
      {
        id: "r2",
        author: "Student C",
        text: "I like to use 25-minute focus blocks and short walks.",
        createdAt: Date.now() - 1000 * 60 * 5,
      },
    ],
  },
];

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getFeed() {
  await delay();
  return THREADS.map((t) => ({
    replies: [],
    ...t,
    replies: t.replies ?? [],
  }));
}

export async function createThread(data) {
  await delay();
  const id = String(NEXT_ID++);
  const now = Date.now();

  const thread = {
    id,
    author: "Alex J.", 
    likes: 0,
    replies: [],
    createdAt: now,
    text: data.caption || data.text || "",
    ...data,
  };

  THREADS = [thread, ...THREADS];
  return thread;
}

export async function createReply(threadId, { text }) {
  await delay();
  const thread = THREADS.find((t) => String(t.id) === String(threadId));
  if (!thread) throw new Error("Thread not found");

  const reply = {
    id: `r-${thread.id}-${(thread.replies?.length ?? 0) + 1}`,
    author: "Alex J.",
    text,
    createdAt: Date.now(),
  };
  return reply;
}


export async function toggleLike(threadId) {
  await delay();
  const thread = THREADS.find((t) => String(t.id) === String(threadId));
  if (!thread) throw new Error("Thread not found");

  thread.likes = (thread.likes ?? 0) + 1; 
  return thread.likes;
}

export async function reportContent(threadId, reason) {
  await delay();
  console.log("Report submitted:", { threadId, reason });
  return { ok: true };
}
