import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select";
  
  export function TasksFilterPriority({
    value,
    onFilterChange,
  }: {
    value: string;
    onFilterChange: (value: string) => void;
  }) {
    return (
      <Select value={value} onValueChange={onFilterChange}>
        <SelectTrigger className="md:w-[120px] w-full">
          <SelectValue>{value || "Priority"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Priority</SelectLabel>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
  