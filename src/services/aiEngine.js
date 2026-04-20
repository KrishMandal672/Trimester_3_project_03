const REVISION_THRESHOLD_DAYS = 7;
const DECAY_THRESHOLD_DAYS = 10;
const OPTIMAL_REVISION_WINDOW = 5;
const FORGETTING_FACTOR = 0.15;

const getDaysSince = (date) => {
  if (!date) return 14; 
  const diffTime = Math.abs(new Date() - new Date(date));
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const getEffectiveConfidence = (topic) => {
  const days = getDaysSince(topic.lastReviewed);
  const decay = days * FORGETTING_FACTOR;
  return Math.max(1, (topic.confidence - decay).toFixed(1));
};

export const calculateLearningScore = (topics) => {
  if (topics.length === 0) return 0;
  const totalEffective = topics.reduce((acc, t) => acc + parseFloat(getEffectiveConfidence(t)), 0);
  const maxPossible = topics.length * 5;
  const freshTopics = topics.filter(t => getDaysSince(t.lastReviewed) <= 5).length;
  const consistencyMultiplier = 0.8 + (freshTopics / topics.length) * 0.2;
  const score = (totalEffective / maxPossible) * 100 * consistencyMultiplier;
  return Math.min(100, Math.round(score));
};

export const getWeakTopics = (topics) => {
  return topics
    .map(t => ({ ...t, effectiveConfidence: getEffectiveConfidence(t) }))
    .filter(t => t.effectiveConfidence <= 2.5)
    .sort((a, b) => a.effectiveConfidence - b.effectiveConfidence)
    .slice(0, 3);
};

export const getRevisionQueue = (topics) => {
  const queue = { high: [], medium: [], low: [] };
  topics.forEach(t => {
    const days = getDaysSince(t.lastReviewed);
    const effConf = getEffectiveConfidence(t);
    let reason = "";
    if (effConf <= 2.5 || days > DECAY_THRESHOLD_DAYS) {
      reason = effConf <= 2.5 ? "Critical strength loss" : `${days}d since review`;
      queue.high.push({ ...t, effectiveConfidence: effConf, reason });
    } else if (effConf <= 3.5 && days > OPTIMAL_REVISION_WINDOW) {
      reason = "Scheduled review due";
      queue.medium.push({ ...t, effectiveConfidence: effConf, reason });
    } else {
      reason = "Fresh knowledge";
      queue.low.push({ ...t, effectiveConfidence: effConf, reason });
    }
  });
  return queue;
};

export const getNextFocus = (topics) => {
  const scored = topics.map(t => {
    const effConf = getEffectiveConfidence(t);
    return {
      ...t,
      effectiveConfidence: effConf,
      score: (5 - effConf) * 2.5 + (getDaysSince(t.lastReviewed) * 0.4)
    };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
};

export const getStudySessionSet = (topics) => {
  return getNextFocus(topics).slice(0, 5);
};

export const getInsights = (topics) => {
  if (topics.length === 0) return [];
  const insights = [];
  const subjects = [...new Set(topics.map(t => t.subject))];
  const subjectAverages = subjects.map(s => {
    const sTopics = topics.filter(t => t.subject === s);
    const avg = sTopics.reduce((acc, curr) => acc + parseFloat(getEffectiveConfidence(curr)), 0) / sTopics.length;
    return { name: s, avg };
  });
  const weakest = subjectAverages.sort((a, b) => a.avg - b.avg)[0];
  if (weakest && weakest.avg < 2.8) {
    insights.push(`Knowledge gaps detected in "${weakest.name}" modules.`);
  }
  const lowConfLowReview = topics.filter(t => t.confidence <= 2 && getDaysSince(t.lastReviewed) > 7);
  if (lowConfLowReview.length > 2) {
    insights.push(`High risk of data loss on ${lowConfLowReview.length} complex topics.`);
  }
  return insights.slice(0, 3);
};

export const getAdvice = (topics, insights) => {
  if (topics.length === 0) return "Add your first module to begin tracking.";
  const score = calculateLearningScore(topics);
  if (score < 40) return "Alert: System health critical. Immediate review required.";
  if (score < 70) return "System stable. Focus on medium-priority gaps.";
  return "Operational excellence achieved. Continue adding complexity.";
};

export const generateWeeklyPlan = (topics) => {
  if (topics.length === 0) return [];
  const candidates = topics
    .map(t => ({ ...t, eff: getEffectiveConfidence(t), daysSince: getDaysSince(t.lastReviewed) }))
    .filter(t => t.eff <= 3.5 || t.daysSince > 5)
    .sort((a, b) => a.eff - b.eff);
  const plan = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toISOString().split('T')[0],
      topics: []
    };
  });
  let currentDay = 0;
  candidates.forEach((topic) => {
    if (plan[currentDay].topics.length < 3) {
      plan[currentDay].topics.push(topic);
      currentDay = (currentDay + 1) % 7;
    }
  });
  return plan;
};

export const generateLearningReport = (topics) => {
  if (!topics || topics.length === 0) {
    return {
      learningScore: 0,
      weakTopics: [],
      revisionQueue: { high: [], medium: [], low: [] },
      nextFocus: [],
      insights: [],
      weeklyPlan: [],
      advice: "Ready for data input."
    };
  }
  const insights = getInsights(topics);
  return {
    learningScore: calculateLearningScore(topics),
    weakTopics: getWeakTopics(topics),
    revisionQueue: getRevisionQueue(topics),
    nextFocus: getNextFocus(topics),
    insights: insights,
    weeklyPlan: generateWeeklyPlan(topics),
    advice: getAdvice(topics, insights)
  };
};
