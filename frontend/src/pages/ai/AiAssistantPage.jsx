// AiAssistantPage.jsx - Updated with proper height management
import DashboardLayout from "@/layout/DashboardLayout";
import AiChatPanel from "@/components/ai/AiChatPanel";

const AiAssistantPage = () => {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
          {/* Disclaimer */}
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-5 h-5 text-amber-600 mt-0.5">⚠️</div>
            <div>
              <p className="text-sm font-medium text-amber-800 mb-1">Important Disclaimer</p>
              <p className="text-xs text-amber-700">
                CareSync AI is designed to provide general health information and wellness suggestions only.
                It cannot diagnose medical conditions, prescribe treatments, or provide emergency advice.
                Always consult with qualified healthcare professionals for medical concerns.
                In case of emergency, please contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>
        <div className="mb-6 mt-3">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            AI Health Assistant
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
            Get personalized health and wellness guidance from CareSync AI. 
            This tool provides general information and suggestions only—it is not a substitute 
            for professional medical advice, diagnosis, or treatment.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              General Wellness
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Nutrition Tips
            </div>
            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              Exercise Guidance
            </div>
            <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              Lifestyle Advice
            </div>
          </div>
        </div>

        {/* Chat container with fixed height */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 rounded-2xl overflow-hidden shadow-lg bg-white">
            <AiChatPanel />
          </div>
        </div> 
      </div>
    </DashboardLayout>
  );
};

export default AiAssistantPage;