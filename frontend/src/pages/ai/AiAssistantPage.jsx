// AiAssistantPage.jsx
import AiChatPanel from "@/components/ai/AiChatPanel";

const AiAssistantPage = () => {
  return (
    <div className="flex flex-col h-full mt-16">

      {/* Disclaimer */}
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">⚠️</div>
          <div>
            <p className="text-sm font-medium text-amber-800 mb-1">Important Disclaimer</p>
            <p className="text-xs text-amber-700">
              CareSync AI is designed to provide general health information only.
              It cannot diagnose medical conditions or provide emergency advice.
              Always consult healthcare professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 mt-3">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          AI Health Assistant
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
          Ask questions and get wellness guidance powered by AI.
        </p>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            Wellness
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Nutrition
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            Exercise
          </span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            Lifestyle
          </span>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-hidden rounded-xl shadow bg-card">
          <AiChatPanel />
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
