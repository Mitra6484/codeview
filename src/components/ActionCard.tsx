import { QuickActionType } from "@/constants";

function ActionCard({ action, onClick }: { action: QuickActionType; onClick: () => void }) {
  return (
    <div
      className="glass-card group relative overflow-hidden rounded-2xl p-6 cursor-pointer border border-white/10 hover:border-indigo-500/40 transition-all duration-300"
      onClick={onClick}
    >
      {/* ACTION GRADIENT */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}
      />

      {/* ACTION CONTENT WRAPPER */}
      <div className="relative space-y-4">
        {/* ACTION ICON */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shadow-lg"
        >
          <action.icon className="h-6 w-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
        </div>

        {/* ACTION DETAILS */}
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-white group-hover:text-indigo-200 transition-colors">
            {action.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">{action.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ActionCard;