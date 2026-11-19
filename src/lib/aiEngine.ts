import type {
  AIAnalysis,
  HazardCategory,
  Priority,
  RiskLevel,
  RootCause,
  Severity,
} from './types';

interface HazardKnowledge {
  detectedHazard: string;
  rootCauses: { cause: string; confidence: number }[];
  correctiveAction: string;
  preventiveAction: string;
  probabilityBoost: number;
}

const HAZARD_KNOWLEDGE_BASE: Record<HazardCategory, HazardKnowledge> = {
  'Slip/Fall': {
    detectedHazard: 'Slippery or unstable surface creating fall risk',
    rootCauses: [
      { cause: 'Surface contamination (oil, water, dust)', confidence: 88 },
      { cause: 'Inadequate floor maintenance or cleaning', confidence: 70 },
      { cause: 'Missing anti-slip flooring or signage', confidence: 55 },
    ],
    correctiveAction:
      'Clean the affected surface immediately using appropriate absorbents. Place wet floor warning signs and restrict access until dry.',
    preventiveAction:
      'Install anti-slip floor coatings in high-risk areas. Implement a hourly floor inspection routine and ensure proper drainage systems are in place.',
    probabilityBoost: 0,
  },
  Electrical: {
    detectedHazard: 'Electrical hazard from wiring, panels, or equipment',
    rootCauses: [
      { cause: 'Insulation degradation or damage', confidence: 90 },
      { cause: 'Circuit overload or faulty wiring', confidence: 75 },
      { cause: 'Inadequate grounding or protection', confidence: 60 },
    ],
    correctiveAction:
      'De-energize the affected circuit immediately. Isolate the area and have a certified electrician inspect and repair the fault.',
    preventiveAction:
      'Conduct quarterly thermographic inspections of all electrical panels. Install arc-fault detection devices and enforce load balancing audits.',
    probabilityBoost: 1,
  },
  Fire: {
    detectedHazard: 'Fire or heat-related hazard detected',
    rootCauses: [
      { cause: 'Proximity to ignition source or hot surface', confidence: 82 },
      { cause: 'Inadequate fire prevention measures', confidence: 68 },
      { cause: 'Expired or missing fire safety equipment', confidence: 52 },
    ],
    correctiveAction:
      'Eliminate the ignition source or isolate the hot area. Ensure fire extinguishers are accessible and functional. Administer first aid if needed.',
    preventiveAction:
      'Maintain and inspect all fire safety equipment monthly. Enforce hot work permits and install automated fire detection in high-risk zones.',
    probabilityBoost: 0,
  },
  Chemical: {
    detectedHazard: 'Chemical exposure or hazardous material release',
    rootCauses: [
      { cause: 'Containment failure or leak', confidence: 87 },
      { cause: 'Inadequate ventilation or storage', confidence: 72 },
      { cause: 'Improper handling or PPE usage', confidence: 58 },
    ],
    correctiveAction:
      'Evacuate the area if necessary. Contain the spill using appropriate chemical absorbents. Ensure proper PPE is worn during cleanup.',
    preventiveAction:
      'Install real-time VOC and chemical sensors. Enforce proper storage protocols and maintain Safety Data Sheets (SDS) at all chemical handling points.',
    probabilityBoost: 1,
  },
  Mechanical: {
    detectedHazard: 'Mechanical hazard from machinery, equipment, or material handling',
    rootCauses: [
      { cause: 'Equipment malfunction or wear', confidence: 85 },
      { cause: 'Missing or bypassed safety guards', confidence: 73 },
      { cause: 'Inadequate operational procedures', confidence: 56 },
    ],
    correctiveAction:
      'Tag out and lock out the affected equipment. Inspect and repair the mechanical fault before returning to service. Replace any missing safety guards.',
    preventiveAction:
      'Implement a preventive maintenance schedule for all machinery. Enforce lockout/tagout procedures and conduct monthly safety guard inspections.',
    probabilityBoost: 1,
  },
  PPE: {
    detectedHazard: 'Personal protective equipment non-compliance',
    rootCauses: [
      { cause: 'Insufficient PPE enforcement and supervision', confidence: 84 },
      { cause: 'PPE supply shortage or unavailability', confidence: 63 },
      { cause: 'Lack of training and awareness', confidence: 55 },
    ],
    correctiveAction:
      'Issue immediate PPE violation notice. Provide the required PPE at the workstation and ensure the worker complies before resuming work.',
    preventiveAction:
      'Implement daily PPE compliance checks at shift start. Maintain adequate PPE stock at all stations. Conduct monthly safety awareness training sessions.',
    probabilityBoost: 0,
  },
  Ergonomic: {
    detectedHazard: 'Ergonomic strain from repetitive motion or poor workstation design',
    rootCauses: [
      { cause: 'Poor workstation design or adjustability', confidence: 83 },
      { cause: 'Repetitive motion without rotation', confidence: 72 },
      { cause: 'Lack of ergonomic assessment and training', confidence: 57 },
    ],
    correctiveAction:
      'Conduct an ergonomic assessment of the affected workstation. Provide immediate relief through adjusted work positions and anti-fatigue equipment.',
    preventiveAction:
      'Implement job rotation schedules every 2 hours. Provide ergonomic training for all workers and conduct quarterly ergonomic workstation audits.',
    probabilityBoost: 0,
  },
  Other: {
    detectedHazard: 'General workplace safety hazard identified',
    rootCauses: [
      { cause: 'Inadequate safety procedures', confidence: 75 },
      { cause: 'Environmental factors', confidence: 60 },
      { cause: 'Human factors and behavior', confidence: 52 },
    ],
    correctiveAction:
      'Assess the specific hazard and implement immediate mitigation. Isolate the area if necessary and notify the safety officer.',
    preventiveAction:
      'Review and update safety procedures. Conduct a comprehensive risk assessment and provide targeted safety training for affected personnel.',
    probabilityBoost: 0,
  },
};

const SEVERITY_WEIGHT: Record<Severity, number> = {
  Low: 2,
  Medium: 4,
  High: 7,
  Critical: 10,
};

const KEYWORD_MAP: { keywords: string[]; category: HazardCategory }[] = [
  { keywords: ['slip', 'fall', 'oil', 'wet', 'floor', 'trip', 'spill'], category: 'Slip/Fall' },
  { keywords: ['wire', 'electric', 'shock', 'panel', 'voltage', 'current', 'spark', 'cable'], category: 'Electrical' },
  { keywords: ['fire', 'burn', 'flame', 'hot', 'smoke', 'extinguisher', 'ignition'], category: 'Fire' },
  { keywords: ['chemical', 'fume', 'gas', 'vapor', 'solvent', 'toxic', 'coolant', 'vapor', 'leak'], category: 'Chemical' },
  { keywords: ['crane', 'forklift', 'machine', 'guard', 'mechanical', 'hook', 'pallet', 'crush'], category: 'Mechanical' },
  { keywords: ['glove', 'helmet', 'vest', 'goggle', 'ppe', 'harness', 'mask', 'safety shoe'], category: 'PPE' },
  { keywords: ['ergonomic', 'back', 'strain', 'posture', 'repetitive', 'standing', 'lifting'], category: 'Ergonomic' },
];

export function inferHazardCategory(text: string): HazardCategory {
  const lower = text.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.category;
    }
  }
  return 'Other';
}

function calculateRiskScore(severity: Severity, probability: number): number {
  const base = SEVERITY_WEIGHT[severity];
  // Prototype risk matrix: severity × likelihood, normalized to a 10-point scale.
  const score = (base * probability) / 7.5;
  return Math.min(10, Math.max(1, Math.round(score * 10) / 10));
}

function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 8.5) return 'Critical';
  if (score >= 6.5) return 'High';
  if (score >= 4) return 'Medium';
  return 'Low';
}

function priorityFromScore(score: number): Priority {
  if (score >= 8.5) return 'Urgent';
  if (score >= 6.5) return 'High';
  if (score >= 4) return 'Medium';
  return 'Low';
}

export function generateAIAnalysis(
  description: string,
  hazardType: HazardCategory,
  severity: Severity,
): AIAnalysis {
  const category = hazardType !== 'Other' ? hazardType : inferHazardCategory(description);
  const knowledge = HAZARD_KNOWLEDGE_BASE[category];

  const baseProb = 5;
  const boost = knowledge.probabilityBoost;
  const lower = description.toLowerCase();

  let prob = baseProb + boost;
  if (lower.includes('critical') || lower.includes('severe') || lower.includes('danger')) prob += 2;
  if (lower.includes('near miss') || lower.includes('near-miss')) prob -= 1;
  if (lower.includes('repeated') || lower.includes('multiple') || lower.includes('recurrent')) prob += 1;
  if (lower.includes('spark') || lower.includes('fire') || lower.includes('live')) prob += 1;
  if (category === 'Slip/Fall' && (lower.includes('oil') || lower.includes('slippery') || lower.includes('spill') || lower.includes('leak'))) prob += 3;
  if (category === 'Mechanical' && (lower.includes('machine') || lower.includes('crush') || lower.includes('malfunction'))) prob += 2;
  if (category === 'Electrical' && (lower.includes('live') || lower.includes('spark') || lower.includes('exposed'))) prob += 2;

  prob = Math.min(10, Math.max(1, prob));

  const riskScore = calculateRiskScore(severity, prob);
  const riskLevel = riskLevelFromScore(riskScore);
  const priority = priorityFromScore(riskScore);

  const detectedHazard = lower.length > 10 ? knowledge.detectedHazard : knowledge.detectedHazard;

  const rootCauses: RootCause[] = knowledge.rootCauses.map((rc) => ({
    cause: rc.cause,
    confidence: rc.confidence,
  }));

  return {
    detectedHazard,
    hazardCategory: category,
    severity,
    probability: prob,
    riskScore,
    riskLevel,
    priority,
    rootCauses,
    correctiveAction: knowledge.correctiveAction,
    preventiveAction: knowledge.preventiveAction,
  };
}
