const questions = [
  {
    text: "When faced with a difficult problem, your first instinct is to:",
    answers: [
      { text: "Jump in headfirst and figure it out as I go", scores: { Harry:3, Sirius:2, Ginny:1 } },
      { text: "Research every possible solution before acting", scores: { Hermione:3, Dumbledore:1 } },
      { text: "Ask my closest friends for help", scores: { Ron:3, Neville:1 } },
      { text: "Observe quietly and trust my instincts", scores: { Luna:3, Snape:2 } },
      { text: "Make a calculated plan that benefits me most", scores: { Draco:3, Dumbledore:2 } }
    ]
  },
  {
    text: "What do your closest friends value most about you?",
    answers: [
      { text: "My courage — I always show up when it counts", scores: { Harry:3, Neville:2 } },
      { text: "My brain — I always have the answer", scores: { Hermione:3 } },
      { text: "My humor and warmth", scores: { Ron:3, Sirius:1 } },
      { text: "My uniqueness and perspective", scores: { Luna:3 } },
      { text: "My fierce loyalty and protectiveness", scores: { Ginny:3, Sirius:2 } },
      { text: "My calm wisdom and guidance", scores: { Dumbledore:3, Snape:1 } }
    ]
  },
  {
    text: "Your biggest personal flaw is:",
    answers: [
      { text: "Acting before thinking", scores: { Harry:3, Sirius:3 } },
      { text: "Being too rigid or rule-focused", scores: { Hermione:3 } },
      { text: "Self-doubt and insecurity", scores: { Ron:3, Neville:3 } },
      { text: "Not caring what others think — to a fault", scores: { Luna:3 } },
      { text: "Pride — I hate being wrong", scores: { Draco:3, Snape:2 } },
      { text: "Keeping too many secrets", scores: { Dumbledore:3, Snape:1 } }
    ]
  },
  {
    text: "Which Hogwarts class would excite you most?",
    answers: [
      { text: "Defense Against the Dark Arts", scores: { Harry:3, Ginny:1 } },
      { text: "Transfiguration or Charms", scores: { Hermione:3 } },
      { text: "Care of Magical Creatures", scores: { Neville:3, Luna:2 } },
      { text: "Potions", scores: { Snape:3, Hermione:1 } },
      { text: "Quidditch Training", scores: { Ginny:3, Harry:1 } },
      { text: "Ancient Runes or Arithmancy", scores: { Dumbledore:3, Hermione:1 } }
    ]
  },
  {
    text: "In a group, you naturally become:",
    answers: [
      { text: "The leader who charges forward", scores: { Harry:3 } },
      { text: "The planner who organizes everyone", scores: { Hermione:3 } },
      { text: "The emotional glue that holds the group together", scores: { Ron:3, Neville:1 } },
      { text: "The wild card with unexpected ideas", scores: { Luna:3, Sirius:2 } },
      { text: "The strategist playing the long game", scores: { Draco:2, Dumbledore:3 } },
      { text: "The quiet one who surprises everyone", scores: { Neville:3, Snape:2 } }
    ]
  },
  {
    text: "How do you handle fear?",
    answers: [
      { text: "Run toward it — fear is a challenge", scores: { Harry:3, Ginny:3 } },
      { text: "Prepare obsessively so you're never caught off guard", scores: { Hermione:3 } },
      { text: "Laugh it off or lean on others", scores: { Ron:3 } },
      { text: "You don't let fear control you — it simply is", scores: { Luna:3 } },
      { text: "Channel it into discipline and focus", scores: { Snape:3, Dumbledore:2 } },
      { text: "Freeze, then surprise everyone", scores: { Neville:3 } }
    ]
  },
  {
    text: "Pick the word that best describes your ideal life:",
    answers: [
      { text: "Purposeful", scores: { Harry:3 } },
      { text: "Knowledgeable", scores: { Hermione:3 } },
      { text: "Belonging", scores: { Ron:3 } },
      { text: "Free", scores: { Luna:3, Sirius:3 } },
      { text: "Powerful", scores: { Draco:3 } },
      { text: "Peaceful", scores: { Neville:3 } },
      { text: "Respected", scores: { Snape:3, Dumbledore:2 } }
    ]
  },
  {
    text: "If a close friend was lying to you, you would:",
    answers: [
      { text: "Confront them directly and emotionally", scores: { Harry:3, Ron:2 } },
      { text: "Research it thoroughly before saying anything", scores: { Hermione:3 } },
      { text: "Give them the benefit of the doubt", scores: { Luna:3, Neville:2 } },
      { text: "Use it to your advantage", scores: { Draco:3 } },
      { text: "Cut them off — loyalty is non-negotiable", scores: { Ginny:3, Sirius:3 } },
      { text: "Already know — and have a plan", scores: { Dumbledore:3, Snape:2 } }
    ]
  },
  {
    text: "What magical creature do you feel most connected to?",
    answers: [
      { text: "Stag — noble and protective", scores: { Harry:3 } },
      { text: "Otter — curious and clever", scores: { Hermione:3 } },
      { text: "Jack Russell Terrier — playful and loyal", scores: { Ron:3 } },
      { text: "Hare — whimsical and free", scores: { Luna:3 } },
      { text: "Doe — hidden depths, deeply loyal", scores: { Snape:3 } },
      { text: "Thestral — misunderstood and rarely seen", scores: { Neville:2, Sirius:2 } },
      { text: "Snake — cunning and powerful", scores: { Draco:3 } }
    ]
  },
  {
    text: "Your approach to work or school is:",
    answers: [
      { text: "Natural talent plus last-minute effort", scores: { Harry:2, Ron:3 } },
      { text: "Obsessive over-preparation", scores: { Hermione:3 } },
      { text: "Passion-driven — I only excel at what I love", scores: { Ginny:3, Neville:2 } },
      { text: "I go my own path — textbooks optional", scores: { Luna:3 } },
      { text: "I study only what helps me win", scores: { Draco:3 } },
      { text: "Mastery — I aim to be the best, always", scores: { Snape:3, Dumbledore:2 } }
    ]
  },
  {
    text: "When you walk into a party, you:",
    answers: [
      { text: "Head straight to your crew", scores: { Harry:2, Ron:3 } },
      { text: "Find the quiet corner or bookshelf", scores: { Hermione:3, Snape:2 } },
      { text: "Talk to whoever seems most interesting", scores: { Luna:3 } },
      { text: "Work the room — you're charming when you want to be", scores: { Sirius:3, Ginny:2 } },
      { text: "Scan the room strategically before moving", scores: { Draco:2, Dumbledore:2 } },
      { text: "Got talked into going — but you're glad you did", scores: { Neville:3 } }
    ]
  },
  {
    text: "What motivates you most?",
    answers: [
      { text: "Protecting the people I love", scores: { Harry:3, Ron:2, Ginny:2 } },
      { text: "Knowing I was right and being the best", scores: { Hermione:3, Snape:2, Draco:2 } },
      { text: "Freedom and living on my own terms", scores: { Sirius:3, Luna:3 } },
      { text: "Quietly proving myself", scores: { Neville:3 } },
      { text: "The greater good", scores: { Dumbledore:3 } },
      { text: "Legacy and power", scores: { Draco:3 } }
    ]
  }
];

export default questions;
