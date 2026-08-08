import React from 'react';
import { 
  Activity, 
  Check, 
  ChevronRight, 
  FileText, 
  HeartHandshake, 
  Hospital, 
  Landmark, 
  Stethoscope, 
  Truck, 
  UserCheck 
} from 'lucide-react';

export type WorkflowStep = 
  | 'symptoms' 
  | 'ai-assessment' 
  | 'doctor-review' 
  | 'care-plan' 
  | 'facility' 
  | 'transport' 
  | 'schemes' 
  | 'receipt';

interface PatientWorkflowTrackerProps {
  currentStep: WorkflowStep;
  onStepClick?: (step: WorkflowStep) => void;
  caseId?: string;
  patientName?: string;
}

const STEPS: { id: WorkflowStep; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'symptoms', label: 'Symptoms & Report', icon: Stethoscope },
  { id: 'ai-assessment', label: 'AI Triage', icon: Activity },
  { id: 'doctor-review', label: 'Doctor Review', icon: UserCheck },
  { id: 'care-plan', label: 'Care Plan', icon: HeartHandshake },
  { id: 'facility', label: 'Hospital Referral', icon: Hospital },
  { id: 'transport', label: 'Transport', icon: Truck },
  { id: 'schemes', label: 'Support Schemes', icon: Landmark },
  { id: 'receipt', label: 'Case Receipt', icon: FileText },
];

export const PatientWorkflowTracker: React.FC<PatientWorkflowTrackerProps> = ({
  currentStep,
  onStepClick,
  caseId,
  patientName,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div id="patient-workflow-tracker" className="bento-card p-4 shadow-sm border border-slate-200 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="bento-tag px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-mono font-bold">
            Active Journey
          </span>
          {caseId && <span className="font-mono text-slate-500 font-bold">{caseId}</span>}
          {patientName && <span className="text-slate-900 font-bold ml-1">• {patientName}</span>}
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          Step <span className="text-teal-700 font-bold">{currentIndex + 1}</span> of {STEPS.length}:{' '}
          <span className="text-slate-900 font-bold">{STEPS[currentIndex]?.label}</span>
        </div>
      </div>

      {/* Progress Steps Row */}
      <div className="flex items-center justify-between overflow-x-auto py-1 scrollbar-none gap-1 sm:gap-2">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => onStepClick && (isCompleted || isCurrent) && onStepClick(step.id)}
                disabled={!isCompleted && !isCurrent}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 ring-2 ring-teal-400/30'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200 cursor-pointer'
                    : 'bg-slate-100/60 text-slate-400 border border-slate-200/60 cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <StepIcon className="w-3.5 h-3.5" />
                )}
                <span>{step.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
