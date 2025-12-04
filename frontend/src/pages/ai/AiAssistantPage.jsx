import DashboardLayout from "@/layout/DashboardLayout";
import AiChatPanel from "@/components/ai/AiChatPanel";

const AiAssistantPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold">AI Assistant</h1>
          <p className="text-xs text-muted-foreground">
            Ask CareSync AI general health and wellness questions. It does not replace real doctors.
          </p>
        </div>

        <div className="h-[540px]">
          <AiChatPanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AiAssistantPage;
