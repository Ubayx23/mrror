'use client';

export interface Goal {
  id: string;
  title: string;
  timeHorizon: '90-day' | '1-year' | '3-year' | '5-year';
  outcomes: Outcome[];
  actions: Action[];
  createdAt: string;
  updatedAt: string;
}

export interface Outcome {
  id: string;
  text: string;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  useForToday?: boolean; // When true, this prefills as the Daily Promise
}

const STORAGE_KEY = 'mrror-goals-v1';

function getGoals(): Goal[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveGoals(goals: Goal[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export function getAllGoals(): Goal[] {
  return getGoals();
}

export function getGoalById(id: string): Goal | undefined {
  return getGoals().find(g => g.id === id);
}

export function createGoal(title: string, timeHorizon: Goal['timeHorizon']): Goal {
  const newGoal: Goal = {
    id: Math.random().toString(36).slice(2, 11),
    title,
    timeHorizon,
    outcomes: [],
    actions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const goals = getGoals();
  goals.unshift(newGoal);
  saveGoals(goals);
  return newGoal;
}

export function updateGoal(id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>): Goal | undefined {
  const goals = getGoals();
  const idx = goals.findIndex(g => g.id === id);
  if (idx === -1) return undefined;
  goals[idx] = {
    ...goals[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveGoals(goals);
  return goals[idx];
}

export function deleteGoal(id: string): boolean {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  if (filtered.length === goals.length) return false; // Not found
  saveGoals(filtered);
  return true;
}

export function addOutcome(goalId: string, text: string): Goal | undefined {
  const goal = getGoalById(goalId);
  if (!goal) return undefined;
  const newOutcome: Outcome = {
    id: Math.random().toString(36).slice(2, 11),
    text,
  };
  goal.outcomes.push(newOutcome);
  return updateGoal(goalId, { outcomes: goal.outcomes });
}

export function removeOutcome(goalId: string, outcomeId: string): Goal | undefined {
  const goal = getGoalById(goalId);
  if (!goal) return undefined;
  goal.outcomes = goal.outcomes.filter(o => o.id !== outcomeId);
  return updateGoal(goalId, { outcomes: goal.outcomes });
}

export function addAction(goalId: string, title: string, description: string): Goal | undefined {
  const goal = getGoalById(goalId);
  if (!goal) return undefined;
  const newAction: Action = {
    id: Math.random().toString(36).slice(2, 11),
    title,
    description,
    useForToday: false,
  };
  goal.actions.push(newAction);
  return updateGoal(goalId, { actions: goal.actions });
}

export function removeAction(goalId: string, actionId: string): Goal | undefined {
  const goal = getGoalById(goalId);
  if (!goal) return undefined;
  goal.actions = goal.actions.filter(a => a.id !== actionId);
  return updateGoal(goalId, { actions: goal.actions });
}

export function setActionAsPromise(goalId: string, actionId: string): Goal | undefined {
  const goal = getGoalById(goalId);
  if (!goal) return undefined;
  // Clear all other useForToday flags
  goal.actions.forEach(a => {
    a.useForToday = a.id === actionId;
  });
  return updateGoal(goalId, { actions: goal.actions });
}
