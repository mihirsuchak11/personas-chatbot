"use client";

import * as React from "react";
import Link from "next/link";
import { PERSONAS, type PersonaId } from "@/lib/personas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatRequestOptions } from "ai";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  personaId: PersonaId;
  resumeStream: (options?: ChatRequestOptions | undefined) => Promise<void>;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PersonaSwitcher({ resumeStream, personaId }: Props) {
  const current = PERSONAS[personaId];
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="h-auto ml-auto rounded-full px-2.5 py-2"
        >
          <span className="flex items-center gap-3">
            <Avatar
              className={cn(
                "h-8 w-8 ring-2 ring-offset-2 ring-offset-zinc-900",
                current.accent
              )}
            >
              <AvatarImage src={current.avatarUrl} alt={current.name} />
              <AvatarFallback className="bg-zinc-800 text-zinc-100">
                {initials(current.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-left leading-tight">
              <span className="block text-sm font-medium text-zinc-100">
                {current.name}
              </span>
              <span className="block text-[11px] text-zinc-400">
                {current.title}
              </span>
            </span>
            <span className="ml-1 text-zinc-500 text-2xl shrink-0">▾</span>
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl border-zinc-700 bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Choose Persona</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Pick who you want to chat with.
          </DialogDescription>
        </DialogHeader>

        <div
          role="listbox"
          className="grid grid-cols-1 font-inter sm:grid-cols-2 gap-3"
        >
          {Object.values(PERSONAS).map((p) => {
            const active = p.id === personaId;

            // Active: render a non-clickable div
            if (active) {
              return (
                <div
                  key={p.id}
                  role="option"
                  aria-selected="true"
                  aria-disabled="true"
                  tabIndex={-1}
                  className="text-left cursor-default"
                >
                  <Card className="border p-3 transition border-zinc-600 bg-zinc-800 pointer-events-none">
                    <div className="flex items-start gap-3">
                      <Avatar
                        className={cn(
                          "h-12 w-12 ring-2 ring-offset-2 ring-offset-zinc-900",
                          p.accent
                        )}
                      >
                        <AvatarImage src={p.avatarUrl} alt={p.name} />
                        <AvatarFallback className="bg-zinc-800 text-zinc-100">
                          {initials(p.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-zinc-100">
                          {p.name} <span className="sr-only">(current)</span>
                        </div>
                        <div className="text-[12px] text-zinc-400">
                          {p.title}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            }

            // Inactive: clickable Link
            return (
              <Link
                key={p.id}
                href={`/persona/${p.id}`}
                role="option"
                aria-selected="false"
                onClick={async () => {
                  setOpen(false);
                  await resumeStream();
                }}
                className="text-left cursor-pointer"
              >
                <Card className="border p-3 transition border-zinc-800 hover:bg-zinc-800/70">
                  <div className="flex items-start gap-3">
                    <Avatar
                      className={cn(
                        "h-12 w-12 ring-2 ring-offset-2 ring-offset-zinc-900",
                        p.accent
                      )}
                    >
                      <AvatarImage src={p.avatarUrl} alt={p.name} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-100">
                        {initials(p.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-100">
                        {p.name}
                      </div>
                      <div className="text-[12px] text-zinc-400">{p.title}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-end pt-1">
          <Button
            variant="outline"
            className="rounded-full cursor-pointer border-zinc-700 text-white"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
