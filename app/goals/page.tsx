'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/app/components/TopBar';
import IconRail from '@/app/components/IconRail';
import {
  Goal,
  getAllGoals,
  createGoal,
  deleteGoal,
  addOutcome,
  removeOutcome,
  addAction,
  removeAction,
  setActionAsPromise,
} from '@/app/utils/goals';

type TimeHorizon = '90-day' | '1-year' | '3-year' | '5-year';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalHorizon, setNewGoalHorizon] = useState<TimeHorizon>('90-day');
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newOutcomeText, setNewOutcomeText] = useState('');
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionDesc, setNewActionDesc] = useState('');

  // Load goals from localStorage on mount
  useEffect(() => {
    const loadedGoals = getAllGoals();
    if (loadedGoals.length > 0 || goals.length === 0) {
      setGoals(loadedGoals);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const activeGoal = goals.find(g => g.id === activeGoalId);

  const handleCreateGoal = () => {
    if (!newGoalTitle.trim()) return;
    const goal = createGoal(newGoalTitle, newGoalHorizon);
    setGoals(prev => [goal, ...prev]);
    setActiveGoalId(goal.id);
    setNewGoalTitle('');
    setNewGoalHorizon('90-day');
    setShowNewGoalForm(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (!confirm('Delete this goal?')) return;
    deleteGoal(goalId);
    setGoals(prev => prev.filter(g => g.id !== goalId));
    if (activeGoalId === goalId) setActiveGoalId(null);
  };

  const handleAddOutcome = () => {
    if (!activeGoal || !newOutcomeText.trim()) return;
    const updated = addOutcome(activeGoal.id, newOutcomeText);
    if (updated) {
      setGoals(prev =>
        prev.map(g => (g.id === activeGoal.id ? updated : g))
      );
      setNewOutcomeText('');
    }
  };

  const handleRemoveOutcome = (outcomeId: string) => {
    if (!activeGoal) return;
    const updated = removeOutcome(activeGoal.id, outcomeId);
    if (updated) {
      setGoals(prev =>
        prev.map(g => (g.id === activeGoal.id ? updated : g))
      );
    }
  };

  const handleAddAction = () => {
    if (!activeGoal || !newActionTitle.trim()) return;
    const updated = addAction(activeGoal.id, newActionTitle, newActionDesc);
    if (updated) {
      setGoals(prev =>
        prev.map(g => (g.id === activeGoal.id ? updated : g))
      );
      setNewActionTitle('');
      setNewActionDesc('');
    }
  };

  const handleRemoveAction = (actionId: string) => {
    if (!activeGoal) return;
    const updated = removeAction(activeGoal.id, actionId);
    if (updated) {
      setGoals(prev =>
        prev.map(g => (g.id === activeGoal.id ? updated : g))
      );
    }
  };

  const handleUseForToday = (actionId: string) => {
    if (!activeGoal) return;
    const updated = setActionAsPromise(activeGoal.id, actionId);
    if (updated) {
      setGoals(prev =>
        prev.map(g => (g.id === activeGoal.id ? updated : g))
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <TopBar minutesToday={0} />
      <IconRail currentPage="goals" />

      <main className="ml-16 mt-14 min-h-screen">
        <div className="mx-auto max-w-none px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Sidebar: Goals List */}
            <aside className="lg:col-span-3 bg-neutral-900 rounded-lg ring-1 ring-neutral-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-neutral-300">Goals</h2>
              </div>

              <div className="space-y-2 mb-4">
                {goals.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => setActiveGoalId(goal.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      activeGoalId === goal.id
                        ? 'bg-white text-neutral-900 ring-2 ring-emerald-600'
                        : 'hover:bg-neutral-850 text-neutral-200'
                    }`}
                  >
                    <div className="text-sm font-semibold truncate">{goal.title}</div>
                    <div className={`text-xs ${activeGoalId === goal.id ? 'text-neutral-600' : 'text-neutral-500'}`}>
                      {goal.timeHorizon ? goal.timeHorizon.replace('-', ' ') : 'Goal'}
                    </div>
                  </button>
                ))}
              </div>

              {showNewGoalForm ? (
                <div className="space-y-2 border-t border-neutral-800 pt-3">
                  <input
                    type="text"
                    placeholder="Goal title"
                    value={newGoalTitle}
                    onChange={e => setNewGoalTitle(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-neutral-800 text-neutral-100 text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <select
                    value={newGoalHorizon}
                    onChange={e => setNewGoalHorizon(e.target.value as TimeHorizon)}
                    className="w-full px-2 py-1 rounded bg-neutral-800 text-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="90-day">90 Day</option>
                    <option value="1-year">1 Year</option>
                    <option value="3-year">3 Year</option>
                    <option value="5-year">5 Year</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateGoal}
                      className="flex-1 px-2 py-1 rounded bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowNewGoalForm(false);
                        setNewGoalTitle('');
                      }}
                      className="flex-1 px-2 py-1 rounded bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewGoalForm(true)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-200 text-neutral-900 text-sm font-medium hover:bg-white transition"
                >
                  + New Goal
                </button>
              )}

              {activeGoal && (
                <button
                  onClick={() => handleDeleteGoal(activeGoal.id)}
                  className="w-full mt-3 px-3 py-2 rounded-lg bg-red-900/20 text-red-400 text-xs font-medium hover:bg-red-900/30"
                >
                  Delete Goal
                </button>
              )}
            </aside>

            {/* Right Content: Goal Details */}
            <section className="lg:col-span-9 bg-neutral-900 rounded-lg ring-1 ring-neutral-800 p-6">
              {!activeGoal ? (
                <div className="text-neutral-500 text-sm">Select or create a goal to begin.</div>
              ) : (
                <div className="space-y-6">
                  {/* Goal Header */}
                  <div className="border-b border-neutral-800 pb-4">
                    <h1 className="text-2xl font-bold text-white mb-2">{activeGoal.title}</h1>
                    <div className="text-xs text-neutral-400">
                      {activeGoal.timeHorizon ? activeGoal.timeHorizon.replace('-', ' ').toUpperCase() : 'Goal'} Goal • Created{' '}
                      {new Date(activeGoal.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Outcomes Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-100 mb-3">Outcomes</h2>
                    <div className="space-y-2 mb-3">
                      {activeGoal.outcomes.map(outcome => (
                        <div
                          key={outcome.id}
                          className="flex items-start gap-3 px-3 py-2 rounded-lg bg-neutral-850 ring-1 ring-neutral-800"
                        >
                          <div className="flex-1 text-sm text-neutral-200">{outcome.text}</div>
                          <button
                            onClick={() => handleRemoveOutcome(outcome.id)}
                            className="text-xs text-neutral-500 hover:text-red-400 transition"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add outcome..."
                        value={newOutcomeText}
                        onChange={e => setNewOutcomeText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleAddOutcome();
                        }}
                        className="flex-1 px-3 py-2 rounded bg-neutral-850 text-neutral-100 text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                      <button
                        onClick={handleAddOutcome}
                        className="px-3 py-2 rounded bg-neutral-800 text-neutral-300 text-sm hover:bg-neutral-700 transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="border-t border-neutral-800 pt-6">
                    <h2 className="text-lg font-semibold text-neutral-100 mb-3">Actions</h2>
                    <div className="space-y-3 mb-4">
                      {activeGoal.actions.map(action => (
                        <div
                          key={action.id}
                          className={`px-3 py-3 rounded-lg ring-1 transition ${
                            action.useForToday
                              ? 'bg-emerald-600/10 ring-emerald-600 border-l-2 border-emerald-600'
                              : 'bg-neutral-850 ring-neutral-800 hover:ring-neutral-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-neutral-100">{action.title}</div>
                              {action.description && (
                                <div className="text-xs text-neutral-400 mt-1">{action.description}</div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {!action.useForToday && (
                                <button
                                  onClick={() => handleUseForToday(action.id)}
                                  className="text-xs px-2 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition whitespace-nowrap"
                                >
                                  Use Today
                                </button>
                              )}
                              {action.useForToday && (
                                <span className="text-xs px-2 py-1 rounded bg-emerald-600 text-white font-semibold">
                                  Today&apos;s Focus
                                </span>
                              )}
                              <button
                                onClick={() => handleRemoveAction(action.id)}
                                className="text-xs text-neutral-500 hover:text-red-400 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Action title"
                        value={newActionTitle}
                        onChange={e => setNewActionTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-neutral-850 text-neutral-100 text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                      <textarea
                        placeholder="Description (optional)"
                        value={newActionDesc}
                        onChange={e => setNewActionDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-neutral-850 text-neutral-100 text-sm placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
                        rows={2}
                      />
                      <button
                        onClick={handleAddAction}
                        className="w-full px-3 py-2 rounded bg-neutral-800 text-neutral-300 text-sm font-medium hover:bg-neutral-700 transition"
                      >
                        + Add Action
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
