import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function TasksFilterStatus({
  value,
  onFilterChange,
}: {
  value: string;
  onFilterChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onFilterChange}>
      <SelectTrigger className="md:w-[180px] w-full">
        <SelectValue>{value || "Status"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="incomplete">Incomplete</SelectItem>
          <SelectItem value="complete">Complete</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    
  );
}
