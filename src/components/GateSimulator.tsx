import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  Zap,
  RotateCcw,
  Clock,
  Layers,
  Shield,
  Eye,
} from 'lucide-react';
import gateStepsImg from '../assets/images/linktain_gate_steps_1791815755845.jpg';
import { GATE_STEPS } from '../data/guideContent';

export const GateSimulator: React.FC = () => {
  const [stepMode, setStepMode] = useState<1 | 2 | 3>(2);
  const [allowPass, setAllowPass] = useState(true);
  const [passPrice, setPassPrice] = useState('1.49');

  // Simulator visitor state
  const [currentStep, setCurrentStep] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [unlockedViaPass, setUnlockedViaPass] = useState(false);
  const [destinationUrl, setDestinationUrl] = useState('https://linktain.com/verified-content-demo');

  // Handle countdown timer for Step 1 simulation
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setCompletedSteps((prev) => (prev.includes(1) ? prev : [...prev, 1]));
      if (stepMode > 1) {
        setCurrentStep(2);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, stepMode]);

  const handleStartTask1 = () => {
    setIsTimerRunning(true);
    setTimerSeconds(5); // 5-second simulated timer for quick demonstration
  };

  const handleCompleteTask2 = () => {
    setCompletedSteps((prev) => (prev.includes(2) ? prev : [...prev, 2]));
    if (stepMode > 2) {
      setCurrentStep(3);
    }
  };

  const handleCompleteTask3 = () => {
    setCompletedSteps((prev) => (prev.includes(3) ? prev : [...prev, 3]));
  };

  const handleSimulatePassBuy = () => {
    setUnlockedViaPass(true);
  };

  const handleResetSimulator = () => {
    setCurrentStep(1);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setCompletedSteps([]);
    setUnlockedViaPass(false);
  };

  const isFullyUnlocked =
    unlockedViaPass ||
    (stepMode === 1 && completedSteps.includes(1)) ||
    (stepMode === 2 && completedSteps.includes(1) && completedSteps.includes(2)) ||
    (stepMode === 3 && completedSteps.includes(1) && completedSteps.includes(2) && completedSteps.includes(3));

  return (
    <section id="gate-models" className="py-16 border-t border-slate-700/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <span>Core Mechanics</span>
            <span aria-hidden="true">·</span>
            <span>Live Interactive Sandbox</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            The Linktain Gate Engine: How Unlocks & Steps Work
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Linktain intercepts destination links with an intuitive, non-intrusive gating screen. Visitors complete 1 to 3 quick sponsored tasks or purchase an instant pass to unlock the resource.
          </p>
        </div>

        {/* 2-Column Split: Controls + Visual Simulator Frame */}
        <div id="gate-simulator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-700">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Configure Publisher Gate</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize how many steps your visitors must complete and preview the exact visitor flow.
              </p>
            </div>

            {/* Step Count Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Number of Task Steps
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setStepMode(num as 1 | 2 | 3);
                      handleResetSimulator();
                    }}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      stepMode === num
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-600/30'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {num} {num === 1 ? 'Step' : 'Steps'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                {stepMode === 1 && '1 Step: High conversion rate (~88%), suited for casual files.'}
                {stepMode === 2 && '2 Steps (Recommended): Sweet spot between 78% conversion & strong $18.40 RPM.'}
                {stepMode === 3 && '3 Steps: Highest ad density ($25+ RPM), best for exclusive high-value downloads.'}
              </p>
            </div>

            {/* Direct Pass Toggle */}
            <div className="pt-2 border-t border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                    Direct Creator Pass Bypass
                  </span>
                  <span className="text-xs text-slate-400">
                    Allow visitors to pay to skip all sponsored tasks
                  </span>
                </div>
                <button
                  onClick={() => {
                    setAllowPass(!allowPass);
                    handleResetSimulator();
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    allowPass ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      allowPass ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {allowPass && (
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-400 whitespace-nowrap">Pass Price ($):</label>
                  <div className="flex items-center gap-1.5">
                    {['0.99', '1.49', '2.99', '4.99'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPassPrice(p)}
                        className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                          passPrice === p
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        ${p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Target URL */}
            <div className="space-y-1.5 pt-2 border-t border-slate-700">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Destination Target Resource
              </label>
              <input
                type="text"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleResetSimulator}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
              <div className="text-xs text-indigo-400 font-medium">
                Visitor Sandbox Mode
              </div>
            </div>
          </div>

          {/* Visitor Gate Preview Frame */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            {/* Mock Browser Header */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-[11px] text-slate-300 ml-2">
                  linktain.com/gate/v3?id=pub_9482
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <Shield className="w-3 h-3" />
                <span>Salted Hash Verified</span>
              </div>
            </div>

            {/* Mock Gate Screen Contents */}
            <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 min-h-[460px] flex flex-col justify-between">
              {/* Header Box */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 mx-auto flex items-center justify-center">
                  {isFullyUnlocked ? (
                    <Unlock className="w-6 h-6 text-emerald-400 animate-bounce" />
                  ) : (
                    <Lock className="w-6 h-6 text-indigo-400" />
                  )}
                </div>
                <h4 className="text-lg font-bold text-white">
                  {isFullyUnlocked
                    ? 'Content Unlocked Successfully!'
                    : 'Access Destination Content'}
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {isFullyUnlocked
                    ? 'All verification steps satisfied. Your destination is ready.'
                    : `Complete ${stepMode} quick sponsored ${
                        stepMode === 1 ? 'task' : 'tasks'
                      } below${allowPass ? ' or unlock instantly with a pass' : ''}.`}
                </p>
              </div>

              {/* State: Locked (Active Tasks) */}
              {!isFullyUnlocked && (
                <div className="space-y-3 max-w-md mx-auto w-full">
                  {/* Task 1 */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all ${
                      completedSteps.includes(1)
                        ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                        : 'bg-slate-800/90 border-slate-700/80 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            completedSteps.includes(1)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600 text-white'
                          }`}
                        >
                          {completedSteps.includes(1) ? '✓' : '1'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">
                            Step 1: Read Sponsored Article
                          </p>
                          <p className="text-[11px] text-slate-400">
                            View 5-second brief partner discovery
                          </p>
                        </div>
                      </div>

                      {completedSteps.includes(1) ? (
                        <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Done
                        </span>
                      ) : (
                        <button
                          onClick={handleStartTask1}
                          disabled={isTimerRunning}
                          className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        >
                          {isTimerRunning ? (
                            <>
                              <Clock className="w-3 h-3 animate-spin" />
                              <span>{timerSeconds}s</span>
                            </>
                          ) : (
                            <span>Start Task</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Task 2 (if stepMode >= 2) */}
                  {stepMode >= 2 && (
                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        completedSteps.includes(2)
                          ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                          : !completedSteps.includes(1)
                          ? 'bg-slate-800/40 border-slate-700 text-slate-500 opacity-60'
                          : 'bg-slate-800/90 border-slate-700/80 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              completedSteps.includes(2)
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {completedSteps.includes(2) ? '✓' : '2'}
                          </div>
                          <div>
                            <p className="text-xs font-semibold">
                              Step 2: Explore Recommended Topic
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Click recommended sponsored link
                            </p>
                          </div>
                        </div>

                        {completedSteps.includes(2) ? (
                          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Done
                          </span>
                        ) : (
                          <button
                            onClick={handleCompleteTask2}
                            disabled={!completedSteps.includes(1)}
                            className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer disabled:opacity-40"
                          >
                            Explore
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Task 3 (if stepMode === 3) */}
                  {stepMode === 3 && (
                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        completedSteps.includes(3)
                          ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                          : !completedSteps.includes(2)
                          ? 'bg-slate-800/40 border-slate-700 text-slate-500 opacity-60'
                          : 'bg-slate-800/90 border-slate-700/80 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              completedSteps.includes(3)
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {completedSteps.includes(3) ? '✓' : '3'}
                          </div>
                          <div>
                            <p className="text-xs font-semibold">
                              Step 3: Quick Brand Survey
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Answer 1 multiple choice question
                            </p>
                          </div>
                        </div>

                        {completedSteps.includes(3) ? (
                          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Done
                          </span>
                        ) : (
                          <button
                            onClick={handleCompleteTask3}
                            disabled={!completedSteps.includes(2)}
                            className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer disabled:opacity-40"
                          >
                            Answer
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bypass with Direct Pass option */}
                  {allowPass && (
                    <div className="pt-2 text-center">
                      <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-slate-900 px-2 text-slate-400 text-[10px] font-semibold">
                            Or Skip Tasks Instantly
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleSimulatePassBuy}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Unlock Immediately with ${passPrice} Pass</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* State: Unlocked */}
              {isFullyUnlocked && (
                <div className="bg-slate-800/80 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4 max-w-md mx-auto w-full animate-fadeIn">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {unlockedViaPass ? 'Pass Activated' : 'Tasks Completed (100%)'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Target link:</p>
                    <p className="text-xs font-mono text-indigo-300 break-all bg-slate-950 p-2 rounded mt-1 border border-slate-700">
                      {destinationUrl}
                    </p>
                  </div>

                  <a
                    href={destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                  >
                    <span>Proceed to Destination URL</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Gate Footer Privacy Note */}
              <div className="text-center text-[11px] text-slate-400 pt-3 border-t border-slate-700/60">
                Protected by Linktain Salted Hash Anti-Fraud Engine · No Raw IP Storage
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid: 4 Core Step Types */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              Supported Sponsored Step Modules
            </h3>
            <span className="text-xs text-slate-400">
              High-converting task inventory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {GATE_STEPS.map((step, idx) => (
              <div
                key={step.id}
                className="bg-slate-900/90 border border-slate-700 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-400 font-semibold">
                      0{idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {step.avgDuration}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {step.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/80 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Yield:</span>
                    <span className="font-mono font-bold text-emerald-400 tabular-nums">
                      {step.rpmContribution}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Completion:</span>
                    <span className="font-mono font-medium text-slate-200 tabular-nums">
                      {step.completionRate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
