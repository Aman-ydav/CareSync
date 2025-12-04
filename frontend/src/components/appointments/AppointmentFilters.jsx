import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const AppointmentFilters = ({ filters, onChange, onApply }) => {
  const handleChange = (key, value) => {
    onChange?.({ [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-3 items-end mb-4">
      <div className="w-full sm:w-40">
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Status
        </label>
        <Select
          value={filters.status ?? "all"}
          onValueChange={(val) =>
            onChange({ status: val === "all" ? undefined : val })
          }
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-40">
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          From
        </label>
        <Input
          type="date"
          className="h-9 text-xs"
          value={filters.startDate || ""}
          onChange={(e) => handleChange("startDate", e.target.value)}
        />
      </div>

      <div className="w-full sm:w-40">
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          To
        </label>
        <Input
          type="date"
          className="h-9 text-xs"
          value={filters.endDate || ""}
          onChange={(e) => handleChange("endDate", e.target.value)}
        />
      </div>

      <Button size="sm" className="h-9" onClick={onApply}>
        Apply
      </Button>
    </div>
  );
};

export default AppointmentFilters;
