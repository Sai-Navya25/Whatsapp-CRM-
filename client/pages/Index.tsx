import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  Check,
  Copy,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type HighlightCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type TemplateOption = {
  id: string;
  label: string;
  description: string;
  prompt: string;
};

const HIGHLIGHTS: HighlightCardProps[] = [
  {
    icon: Sparkles,
    title: "Personalize instantly",
    description:
      "Merge campaign context with each name so every outreach stays warm and tailored.",
  },
  {
    icon: MessageCircle,
    title: "Stay on-brand",
    description:
      "Edit the copy before sending and keep your team aligned on tone across every chat.",
  },
  {
    icon: Send,
    title: "Share in one tap",
    description:
      "Copy polished WhatsApp-ready text straight into your CRM or device clipboard.",
  },
];

const TEMPLATES: TemplateOption[] = [
  {
    id: "festive-delight",
    label: "Festive Delight",
    description: "Seasonal wishes full of warmth and gratitude.",
    prompt: "Diwali wish for customers celebrating with their families",
  },
  {
    id: "product-launch",
    label: "Product Launch",
    description: "Announce new offerings and invite early access.",
    prompt: "Product launch update inviting VIP customers to exclusive early access",
  },
  {
    id: "renewal-reminder",
    label: "Renewal Reminder",
    description: "Gentle nudge about upcoming renewals.",
    prompt: "Friendly reminder for subscription renewal highlighting continued benefits",
  },
  {
    id: "gratitude-followup",
    label: "Gratitude Follow-up",
    description: "Thank clients after a successful collaboration.",
    prompt: "Thank you message after successfully completing a project together",
  },
];

type CopyStatus = "idle" | "success" | "error";

export default function Index() {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyTimeoutRef = useRef<number | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedPrompt = prompt.trim();

    if (!trimmedName || !trimmedPrompt) {
      setError("Add both a name and a prompt to craft a message.");
      return;
    }

    const generatedMessage = composeMessage(trimmedName, trimmedPrompt);
    setMessage(generatedMessage);
    setError(null);
    setCopyStatus("idle");
  };

  const handleCopy = async () => {
    if (!message.trim()) {
      setCopyStatus("error");
      return;
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
      } else {
        copyWithFallback(message);
      }

      setCopyStatus("success");
      scheduleCopyStatusReset();
    } catch (clipboardError) {
      try {
        copyWithFallback(message);
        setCopyStatus("success");
        scheduleCopyStatusReset();
      } catch (fallbackError) {
        console.error("Clipboard copy failed", clipboardError, fallbackError);
        setCopyStatus("error");
      }
    }
  };

  const scheduleCopyStatusReset = () => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2200);
  };

  const onNameChange = (value: string) => {
    setName(value);
    if (error) {
      setError(null);
    }
  };

  const onPromptChange = (value: string) => {
    setPrompt(value);
    setSelectedTemplateId(null);
    if (error) {
      setError(null);
    }
  };

  const onMessageChange = (value: string) => {
    setMessage(value);
    setCopyStatus("idle");
  };

  const handleTemplateSelect = (template: TemplateOption) => {
    setSelectedTemplateId(template.id);
    setPrompt(template.prompt);
    setError(null);
    setCopyStatus("idle");

    const trimmedName = name.trim();
    if (trimmedName) {
      setMessage(composeMessage(trimmedName, template.prompt));
    } else {
      setMessage("");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background bg-mesh text-foreground">
      <div className="pointer-events-none absolute -left-24 top-[-120px] h-72 w-72 rounded-full bg-primary/20 blur-3xl dark:bg-primary/30" />
      <div className="pointer-events-none absolute -right-16 bottom-[-160px] h-96 w-96 rounded-full bg-accent/30 blur-[140px] dark:bg-primary/20" />

      <header className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-6 pt-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-soft">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-2xl tracking-tight">WhatsappCRM</p>
            <p className="text-sm text-muted-foreground">
              Personal messaging for teams that care
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary md:inline-flex">
            Live Beta
          </span>
          <Button
            asChild
            className="hidden rounded-full bg-primary px-6 text-sm font-semibold md:inline-flex"
          >
            <a href="#generator">Try generator</a>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-16 lg:flex-row lg:items-start">
        <section className="max-w-2xl space-y-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> Smart WhatsApp CRM assistant
          </span>
          <div className="space-y-6">
            <h1 className="font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Launch customer-ready WhatsApp messages in seconds.
            </h1>
            <p className="text-lg text-muted-foreground">
              Combine each recipient&apos;s name with campaign prompts to draft
              heartfelt, brand-ready outreach. Adjust the tone, copy it in one
              tap, and keep conversations flowing.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {HIGHLIGHTS.map((highlight) => (
              <HighlightCard key={highlight.title} {...highlight} />
            ))}
          </div>
        </section>

        <section
          id="generator"
          className="w-full max-w-xl rounded-3xl border border-border/70 bg-card/90 p-6 shadow-soft backdrop-blur-xl dark:bg-card/60"
        >
          <div className="flex flex-col gap-6">
            <header className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Message builder</h2>
                <span className="text-sm text-muted-foreground">
                  Editable &amp; share-ready
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Fill in the details below, tweak the copy, and copy it straight
                into WhatsApp or your CRM.
              </p>
            </header>

            <form className="flex flex-col gap-6" onSubmit={handleGenerate}>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="name"
                >
                  Recipient name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(event) => onNameChange(event.target.value)}
                  placeholder="Rahul"
                  className="w-full rounded-2xl border border-border/70 bg-white/80 px-4 py-3 text-base text-foreground shadow-inner outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-background/60"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-3">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="prompt"
                >
                  Campaign prompt
                </label>
                <TemplatePicker
                  templates={TEMPLATES}
                  activeId={selectedTemplateId}
                  onSelect={handleTemplateSelect}
                />
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(event) => onPromptChange(event.target.value)}
                  placeholder="Diwali wish for customers"
                  className="min-h-[120px] w-full resize-none rounded-2xl border border-border/70 bg-white/80 px-4 py-3 text-base text-foreground shadow-inner transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-background/60"
                />
                <p className="text-xs text-muted-foreground">
                  Add the campaign theme or context you&apos;d like to highlight.
                </p>
              </div>

              {error ? (
                <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="submit"
                  className="h-12 flex-1 rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-base font-semibold text-primary-foreground shadow-soft"
                >
                  <Sparkles className="h-4 w-4" /> Generate message
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopy}
                  className="h-12 flex-1 rounded-xl border border-border/70 text-base font-semibold text-foreground transition hover:border-primary hover:text-primary sm:max-w-[180px]"
                >
                  {copyStatus === "success" ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy message
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="space-y-3">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="message"
              >
                Generated message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(event) => onMessageChange(event.target.value)}
                placeholder="Your personalized WhatsApp message will appear here once generated."
                className="min-h-[180px] w-full resize-none rounded-2xl border border-border/70 bg-white/85 px-4 py-4 text-base leading-relaxed text-foreground shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background/60"
              />
              <p className="text-xs text-muted-foreground">
                Edit the wording as needed—your changes will stay even after
                copying.
              </p>
              {copyStatus === "success" ? (
                <p className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Check className="h-4 w-4" /> Copied to clipboard
                </p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="text-sm text-destructive">
                  Copy isn&apos;t available right now. Select the text manually if you
                  need it immediately.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-14 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span>
            {currentYear} © WhatsappCRM. Crafted for meaningful customer
            relationships.
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Need another take? Update the prompt and generate again—fresh copy is
          seconds away.
        </p>
      </footer>
    </div>
  );
}

function composeMessage(rawName: string, rawPrompt: string): string {
  const formattedName = formatName(rawName);
  const promptSentence = formatPromptBody(rawPrompt);
  const capitalizedPrompt = promptSentence.charAt(0).toUpperCase() + promptSentence.slice(1);
  const punctuation = /[.!?]$/.test(capitalizedPrompt) ? "" : ".";

  return `Hello ${formattedName}, ${capitalizedPrompt}${punctuation} Wishing you heartfelt connections and standout customer moments. ✨ With WhatsappCRM, you’re ready to follow up with confidence.`;
}

function formatName(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(" ");
}

function formatPromptBody(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "here’s a thoughtful update for your audience";
  }

  const lower = trimmed.toLowerCase();
  const beginsWithArticle = /^(a|an|the|your|our|this|that)\s/.test(lower);
  const phrase = beginsWithArticle ? trimmed : `a ${trimmed}`;
  return `here’s ${phrase}`;
}

function copyWithFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function HighlightCard({ icon: Icon, title, description }: HighlightCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-white/70 p-4 shadow-soft backdrop-blur-sm transition dark:bg-card/60">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="space-y-1">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function TemplatePicker({
  templates,
  activeId,
  onSelect,
}: {
  templates: TemplateOption[];
  activeId: string | null;
  onSelect: (template: TemplateOption) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {templates.map((template) => {
        const isActive = template.id === activeId;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            aria-pressed={isActive}
            className={`flex w-full flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${isActive ? "border-primary bg-primary/10 text-primary shadow-soft" : "border-border/70 bg-white/70 text-foreground hover:border-primary/60 hover:bg-primary/5 dark:bg-card/60"}`}
          >
            <span className="text-sm font-semibold leading-tight">
              {template.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {template.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
