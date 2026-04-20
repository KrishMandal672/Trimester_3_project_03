/**
 * LearnWise AI Assistant Core Logic
 * 
 * This module analyzes the raw learning data attached to a user's dashboard 
 * and computes rule-based, actionable learning advice without the overhead of a full LLM.
 * 
 * @param {Array} topics - Array of objects mapping to Firebase document schema
 * @returns {Object} - Granular arrays and human-readable feedback strings
 */
export function generateLearningInsights(topics) {
  // Edge Case: Blank slate handling
  if (!topics || topics.length === 0) {
    return {
      weakTopics: [],
      revisionTopics: [],
      suggestions: [
        "Jot down the syllabus of what you're trying to learn to get started.",
        "Break massive subjects into smaller, bite-sized topics."
      ],
      summary: "Your brain is a completely fresh canvas. Start mapping out your curriculum to unlock personalized AI insights!"
    };
  }

  // -----------------------------------------------------
  // 1. Identify Weak Topics (Confidence 1 or 2)
  // -----------------------------------------------------
  const weakTopics = topics.filter(t => t.confidence <= 2);

  // -----------------------------------------------------
  // 2. Identify Topics Needing Revision (Spaced Repetition decay rate > 7 days)
  // -----------------------------------------------------
  const currentDate = new Date();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  const revisionTopics = topics.filter(t => {
    // Failsafe: If no history exists, it defaults to requiring review
    if (!t.lastReviewed) return true;
    
    // Time delta math
    const timeSinceReview = currentDate.getTime() - new Date(t.lastReviewed).getTime();
    return timeSinceReview >= SEVEN_DAYS_MS;
  });

  // -----------------------------------------------------
  // 3. Formulate Actionable Suggestions (Rule-based)
  // -----------------------------------------------------
  const suggestions = [];
  
  if (weakTopics.length > 0) {
    suggestions.push(`Focus your active energy on mastering "${weakTopics[0].title}" first. Don't leap forward until it hits a baseline confidence of 3.`);
  }
  
  if (revisionTopics.length > 0) {
    suggestions.push(`You have ${revisionTopics.length} topic(s) currently decaying from your short-term memory. Skim through them today to reset the forgetting curve.`);
  }
  
  // Note-engagement check (Detect if user is passively tracking vs actively tracking)
  const topicsWithoutNotes = topics.filter(t => !t.notes || t.notes.trim() === '');
  if (topicsWithoutNotes.length > Math.floor(topics.length / 2)) {
    suggestions.push(`Write your own notes! Using your own words triggers the "Feynman Technique", drastically speeding up long-term retention.`);
  }

  // Positive reinforcement fallback
  if (suggestions.length === 0 || (weakTopics.length === 0 && revisionTopics.length === 0)) {
    suggestions.push("You're learning symmetrically! Try tackling a highly difficult new subject today.");
  }

  // -----------------------------------------------------
  // 4. Construct a "Human-Friendly" Dynamic Summary
  // -----------------------------------------------------
  let summary = "";
  
  if (weakTopics.length > 0 && revisionTopics.length > 0) {
    summary = `You have some catching up to do! Your immediate priority should be the ${weakTopics.length} weak areas heavily holding you back, followed immediately by a quick refresher on your decaying topics.`;
  } else if (weakTopics.length > 0) {
    summary = `Your memory retention timing is great, but certain complex topics are tripping you up right now. Take it slow and tackle the weak areas one by one without stressing.`;
  } else if (revisionTopics.length > 0) {
    summary = `You understand your material extremely well, but your timing is slipping. Dedicate just 15 minutes to review concepts you haven't seen in a week to solidify neural pathways.`;
  } else {
    summary = `Excellent progress. Your average confidence ranks are high and your spaced repetition habits are perfectly on track. Maintain the momentum!`;
  }

  return {
    weakTopics,
    revisionTopics,
    suggestions,
    summary
  };
}
