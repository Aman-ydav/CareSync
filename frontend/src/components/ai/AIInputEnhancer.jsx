import { useState } from "react";
import { Sparkles } from "lucide-react";
import { aiImprove } from "@/api/aiTools";
import { toast } from "sonner";

export default function AIInputEnhancer({ value, onChange, context }) {
  const [loading, setLoading] = useState(false);

  const runAI = async () => {
    try {
      setLoading(true);
      const improved = await aiImprove(value, context);
      onChange(improved);
    } catch (e) {
      toast.error("AI failed to improve");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={runAI}
      className="absolute right-2 top-2 text-primary hover:text-primary/80"
    >
      {loading ? (
        <div className="animate-spin h-4 w-4 border-2 border-primary/50 border-t-transparent rounded-full" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
    </button>
  );
}
