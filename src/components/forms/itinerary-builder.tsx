"use client";

import type { ItineraryDayInput } from "@/lib/validations/trek";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface ItineraryBuilderProps {
  value: ItineraryDayInput[];
  onChange: (value: ItineraryDayInput[]) => void;
  disabled?: boolean;
}

const emptyDay = (dayNum: number): ItineraryDayInput => ({
  day: dayNum,
  title: "",
  description: "",
  altitude: undefined,
  distance: "",
  accommodation: "",
  meals: "",
});

export function ItineraryBuilder({
  value,
  onChange,
  disabled,
}: ItineraryBuilderProps) {
  const addDay = () => {
    onChange([...value, emptyDay(value.length + 1)]);
  };

  const removeDay = (index: number) => {
    const updated = value
      .filter((_, i) => i !== index)
      .map((day, i) => ({ ...day, day: i + 1 }));
    onChange(updated);
  };

  const updateDay = (index: number, field: keyof ItineraryDayInput, val: string | number | undefined) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {value.map((day, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Day {day.day}</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeDay(index)}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Day title (e.g., Trek to Base Camp)"
              value={day.title}
              onChange={(e) => updateDay(index, "title", e.target.value)}
              disabled={disabled}
            />
            <Textarea
              placeholder="Description of the day..."
              value={day.description || ""}
              onChange={(e) => updateDay(index, "description", e.target.value)}
              rows={2}
              disabled={disabled}
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Input
                type="number"
                placeholder="Altitude (m)"
                value={day.altitude ?? ""}
                onChange={(e) =>
                  updateDay(index, "altitude", e.target.value ? Number(e.target.value) : undefined)
                }
                disabled={disabled}
              />
              <Input
                placeholder="Distance"
                value={day.distance || ""}
                onChange={(e) => updateDay(index, "distance", e.target.value)}
                disabled={disabled}
              />
              <Input
                placeholder="Accommodation"
                value={day.accommodation || ""}
                onChange={(e) => updateDay(index, "accommodation", e.target.value)}
                disabled={disabled}
              />
              <Input
                placeholder="Meals"
                value={day.meals || ""}
                onChange={(e) => updateDay(index, "meals", e.target.value)}
                disabled={disabled}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addDay}
        disabled={disabled}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Day
      </Button>
    </div>
  );
}
