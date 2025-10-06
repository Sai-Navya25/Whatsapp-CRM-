import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background bg-mesh px-6 text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-[-25%] h-[360px] bg-gradient-to-br from-primary/25 via-transparent to-transparent blur-[120px] dark:from-primary/30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[-40%] h-[320px] bg-gradient-to-t from-accent/25 via-transparent to-transparent blur-[140px]" />

      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          <MessageCircle className="h-4 w-4" /> WhatsappCRM
        </span>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          We couldn&apos;t find that page
        </h1>
        <p className="text-base text-muted-foreground">
          The link <span className="font-semibold text-foreground">{location.pathname}</span> is either outdated or impossible. Let&apos;s get you back to crafting meaningful messages.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-full bg-primary px-6 text-sm font-semibold">
            <Link to="/">Return to WhatsappCRM</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border border-border/70 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            <a href="mailto:hello@whatsappcrm.app">Contact support</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
