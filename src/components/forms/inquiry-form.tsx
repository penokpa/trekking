"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

type FieldErrors = Record<string, string[] | undefined>;

export function InquiryForm({ trekId }: { trekId?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      country: formData.get("country") || undefined,
      travelDates: formData.get("travelDates") || undefined,
      message: formData.get("message"),
    };

    const groupSize = formData.get("groupSize");
    if (groupSize && String(groupSize).trim() !== "") {
      body.groupSize = Number(groupSize);
    }

    if (trekId) {
      body.trekId = trekId;
    }

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setError(data.message || "Something went wrong");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSendAnother() {
    setSubmitted(false);
    setError(null);
    setFieldErrors({});
    formRef.current?.reset();
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
          onClick={handleSendAnother}
        >
          Send Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your full name"
            required
          />
          {fieldErrors.name && (
            <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
          )}
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
          {fieldErrors.email && (
            <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
          )}
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
        {fieldErrors.message && (
          <p className="text-xs text-destructive">{fieldErrors.message[0]}</p>
        )}
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
