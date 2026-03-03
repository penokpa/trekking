"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export function InquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: POST to /api/inquiries
    // const formData = new FormData(e.currentTarget);
    // const data = Object.fromEntries(formData.entries());
    // await fetch("/api/inquiries", { method: "POST", body: JSON.stringify(data) });

    // Simulate submission for now
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-lg font-medium">Thank you for your inquiry!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll get back to you as soon as possible.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Send Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 234 567 8900"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            placeholder="Your country"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="travelDates">Preferred Travel Dates</Label>
          <Input
            id="travelDates"
            name="travelDates"
            placeholder="e.g., March 2026"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="groupSize">Group Size</Label>
          <Input
            id="groupSize"
            name="groupSize"
            type="number"
            min="1"
            placeholder="Number of people"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your trekking interests, questions, or any special requirements..."
          className="min-h-32"
          required
        />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          "Sending..."
        ) : (
          <>
            <Send className="mr-2 size-4" />
            Send Inquiry
          </>
        )}
      </Button>
    </form>
  );
}
