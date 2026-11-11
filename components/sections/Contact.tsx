"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { contact, person, services } from "@/content/site";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TweenAmount } from "@/components/ui/TweenAmount";
import { Stamp } from "@/components/ui/Stamp";
import { useLedger } from "@/lib/ledger-store";
import { submitInquiry } from "@/lib/submit";
import { cn, formatAmount } from "@/lib/utils";

type Fields = { name: string; email: string; company: string; notes: string };
type Errors = Partial<Record<keyof Fields | "services", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields, chosen: string[]): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please add your name.";
  if (!f.email.trim()) e.email = "Please add your email so I can reply.";
  else if (!EMAIL.test(f.email.trim())) e.email = "That email doesn't look quite right.";
  if (chosen.length === 0 && f.notes.trim().length < 10)
    e.services = "Choose at least one service, or tell me a little in the notes.";
  return e;
}

/* Today's date in the visitor's locale; empty on the server (no hydration mismatch). */
const noop = () => () => {};
const useToday = () =>
  useSyncExternalStore(
    noop,
    () => new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" }),
    () => "",
  );

/** Underlined "ledger line" input with label + error wiring. */
function Line({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  required,
  autoComplete,
  disabled,
}: {
  label: string;
  name: keyof Fields;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="smallcaps">
        {label}{" "}
        {required ? (
          <span aria-hidden className="text-audit">
            *
          </span>
        ) : (
          <span className="normal-case tracking-normal">(optional)</span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errId : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          "w-full border-0 border-b bg-transparent px-0 py-2 font-serif text-xl outline-none transition-colors placeholder:text-ink-muted/60 focus-visible:border-green focus-visible:outline-none disabled:opacity-70 md:text-[22px]",
          error ? "border-audit" : "border-ink/50",
        )}
      />
      <p id={errId} className={cn("min-h-[1.25rem] text-[13px] text-audit", !error && "invisible")} aria-live="polite">
        {error}
      </p>
    </div>
  );
}

/**
 * CONTACT: "The Invoice". Bill To = visitor; line items = services (each adds
 * an illustrative amount to a live subtotal); Notes = message. The round stamp
 * submits. On success: RECEIVED lands and the global ledger closes (0.00).
 */
export function Contact() {
  const [f, setF] = useState<Fields>({ name: "", email: "", company: "", notes: "" });
  const [chosen, setChosen] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false); // validate live after first submit attempt
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");
  const closeBooks = useLedger((s) => s.closeBooks);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const today = useToday();
  const notesId = useId();
  const servicesErrId = useId();

  // Receipts' "Request this service" adds the line item here.
  useEffect(() => {
    const add = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setChosen((c) => (c.includes(id) ? c : [...c, id]));
    };
    window.addEventListener("invoice:add", add);
    return () => window.removeEventListener("invoice:add", add);
  }, []);

  const subtotal = services.items.filter((s) => chosen.includes(s.id)).reduce((s, i) => s + i.amount, 0);
  const done = status === "success";

  const update = (k: keyof Fields) => (v: string) => {
    const next = { ...f, [k]: v };
    setF(next);
    if (touched) setErrors(validate(next, chosen));
  };
  const toggle = (id: string) => {
    const next = chosen.includes(id) ? chosen.filter((c) => c !== id) : [...chosen, id];
    setChosen(next);
    if (touched) setErrors(validate(f, next));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting" || done) return;
    setTouched(true);
    const errs = validate(f, chosen);
    setErrors(errs);
    if (Object.keys(errs).length) {
      // Focus the first invalid field (by DOM order, not render timing).
      const order: Array<keyof Errors> = ["name", "email", "services"];
      const key = order.find((k) => errs[k]);
      const sel = key === "services" ? 'input[type="checkbox"]' : `input[name="${key}"]`;
      formRef.current?.querySelector<HTMLElement>(sel)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const res = await submitInquiry({ ...f, services: chosen });
      setReference(res.reference);
      setStatus("success");
      closeBooks();
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setStatus("error");
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  const year = today ? new Date().getFullYear() : "";

  return (
    <LedgerSection id="contact" aria-labelledby="contact-title" className="py-24 md:py-36">
      <div className="container-ledger">
        <SectionHeading index="11" kicker={contact.kicker} title={contact.title} intro={contact.intro} id="contact-title" />

        <form
          ref={formRef}
          noValidate
          onSubmit={onSubmit}
          aria-describedby={`${notesId}-hint`}
          className="reveal relative mx-auto max-w-5xl bg-paper-deep px-5 py-8 shadow-[0_40px_80px_-50px_rgb(var(--shadow)/0.8)] md:px-12 md:py-12"
        >
          {/* Invoice header */}
          <div className="grid gap-8 border-b-2 border-ink pb-8 md:grid-cols-2">
            <div>
              <p className="display text-[clamp(3rem,7vw,5.5rem)]">Invoice</p>
              <dl className="num mt-4 grid grid-cols-[6rem_1fr] gap-y-1 text-sm">
                <dt className="smallcaps">No.</dt>
                <dd suppressHydrationWarning>
                  {contact.invoicePrefix}-{year || "————"}-0042
                </dd>
                <dt className="smallcaps">Date</dt>
                <dd suppressHydrationWarning>{today || "—"}</dd>
                <dt className="smallcaps">Terms</dt>
                <dd>Consultation free</dd>
              </dl>
            </div>
            <div className="md:text-right">
              <p className="smallcaps">{contact.fromLabel}</p>
              <p className="mt-2 font-serif text-xl">{person.name}</p>
              <p className="text-sm text-ink-muted">
                {person.title}, {person.city}
                <br />
                {person.email}
                <br />
                {person.phone}
              </p>
            </div>
          </div>

          <fieldset disabled={done} className="contents">
            {/* Bill to */}
            <div
              role="group"
              aria-labelledby={`${notesId}-billto`}
              className="grid gap-x-10 gap-y-2 border-b border-ink/40 py-8 md:grid-cols-2"
            >
              <p id={`${notesId}-billto`} className="smallcaps mb-4 !text-ink md:col-span-2">
                {contact.billToLabel}
              </p>
              <Line
                label="Name"
                name="name"
                value={f.name}
                onChange={update("name")}
                onBlur={() => touched && setErrors(validate(f, chosen))}
                error={errors.name}
                required
                autoComplete="name"
              />
              <Line
                label="Email"
                name="email"
                type="email"
                value={f.email}
                onChange={update("email")}
                onBlur={() => touched && setErrors(validate(f, chosen))}
                error={errors.email}
                required
                autoComplete="email"
              />
              <Line
                label="Business"
                name="company"
                value={f.company}
                onChange={update("company")}
                onBlur={() => {}}
                autoComplete="organization"
              />
            </div>

            {/* Line items */}
            <div
              className="py-8"
              role="group"
              aria-labelledby={`${servicesErrId}-label`}
              aria-describedby={errors.services ? servicesErrId : undefined}
              data-group-invalid={!!errors.services || undefined}
            >
              <div className="grid grid-cols-[1.75rem_1fr_auto] gap-4 border-b border-ink pb-2 md:grid-cols-[1.75rem_1fr_4rem_8rem]">
                <span />
                <span id={`${servicesErrId}-label`} className="smallcaps !text-ink">
                  {contact.lineItemsLabel}
                </span>
                <span className="smallcaps hidden text-right md:block">Qty</span>
                <span className="smallcaps text-right">Est. amount</span>
              </div>
              <ul>
                {services.items.map((s) => {
                  const on = chosen.includes(s.id);
                  const cid = `${servicesErrId}-${s.id}`;
                  return (
                    <li key={s.id} className="border-b border-rule">
                      <label
                        htmlFor={cid}
                        className="group grid cursor-pointer grid-cols-[1.75rem_1fr_auto] items-center gap-4 py-3.5 md:grid-cols-[1.75rem_1fr_4rem_8rem]"
                      >
                        <input id={cid} type="checkbox" checked={on} onChange={() => toggle(s.id)} className="peer sr-only" />
                        {/* custom tick box: an ink check drawn in */}
                        <span
                          aria-hidden
                          className="grid size-5 place-items-center border border-ink transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-green group-hover:border-green"
                        >
                          <svg viewBox="0 0 16 16" className="size-3.5">
                            <path
                              d="M2 8.5 L6.5 12.5 L14 3.5"
                              fill="none"
                              stroke="var(--ledger-green)"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeDasharray="20"
                              strokeDashoffset={on ? 0 : 20}
                              className="transition-[stroke-dashoffset] duration-300 ease-ink"
                            />
                          </svg>
                        </span>
                        <span>
                          <span className="block font-serif text-lg leading-tight">{s.name}</span>
                          <span className="block text-[13px] text-ink-muted">{s.description}</span>
                        </span>
                        <span className="num hidden text-right text-sm md:block">{on ? "1" : "0"}</span>
                        <span className={cn("num text-right text-sm transition-colors", on ? "text-ink" : "text-ink-muted/70")}>
                          {formatAmount(on ? s.amount : 0)}
                          <span className="block text-[10px] text-ink-muted">{s.cadence}</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <p
                id={servicesErrId}
                className={cn("mt-2 min-h-[1.25rem] text-[13px] text-audit", !errors.services && "invisible")}
                aria-live="polite"
              >
                {errors.services}
              </p>

              {/* Totals */}
              <div className="ml-auto mt-4 w-full max-w-sm space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="smallcaps">Est. subtotal</span>
                  <TweenAmount cents={subtotal} />
                </div>
                <div className="flex justify-between">
                  <span className="smallcaps">Consultation</span>
                  <span className="num">(0.00)</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-ink pt-2">
                  <span className="smallcaps !text-ink">Due today</span>
                  <span className="rule-double num text-xl font-semibold text-green">0.00</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t border-ink/40 pt-8">
              <label htmlFor={notesId} className="smallcaps !text-ink">
                {contact.notesLabel}
              </label>
              <p id={`${notesId}-hint`} className="sr-only">
                Fields marked with an asterisk are required.
              </p>
              <textarea
                id={notesId}
                name="notes"
                rows={5}
                value={f.notes}
                onChange={(e) => update("notes")(e.target.value)}
                placeholder={contact.notesPlaceholder}
                className="mt-3 w-full resize-y border-0 bg-transparent font-serif text-lg leading-[2rem] outline-none placeholder:text-ink-muted/60 focus-visible:outline-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0 calc(2rem - 1px), var(--rule) calc(2rem - 1px) 2rem)",
                  backgroundAttachment: "local",
                }}
              />
            </div>
          </fieldset>

          {/* Submit stamp + status */}
          <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div ref={statusRef} tabIndex={-1} className="max-w-md outline-none" role={status === "error" ? "alert" : "status"}>
              {status === "success" && (
                <>
                  <p className="font-serif text-2xl text-green">{contact.successTitle}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {contact.successBody} <span className="num">Ref. {reference}</span>
                  </p>
                </>
              )}
              {status === "error" && (
                <>
                  <p className="font-serif text-2xl text-audit">{contact.errorTitle}</p>
                  <p className="mt-1 text-sm text-ink-muted">{contact.errorBody}</p>
                </>
              )}
              {(status === "idle" || status === "submitting") && (
                <p className="text-sm text-ink-muted">
                  <span className="text-audit">*</span> Required. Replies within [one] business day.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || done}
              data-cursor="stamp"
              aria-label={status === "submitting" ? contact.submitting : `${contact.submit} invoice`}
              className="group relative grid size-36 shrink-0 place-items-center rounded-full border-[3px] border-audit text-audit transition-[transform,opacity] duration-200 ease-stamp hover:-rotate-6 active:scale-90 active:rotate-[-14deg] disabled:opacity-60 md:size-40"
            >
              <span className="absolute inset-2 rounded-full border border-dashed border-audit transition-transform duration-700 ease-settle group-hover:rotate-45" />
              <span className="font-mono text-sm font-bold uppercase tracking-[0.25em]">
                {status === "submitting" ? contact.submitting : contact.submit}
              </span>
              <span aria-hidden className="absolute bottom-7 font-mono text-[9px] tracking-[0.3em] opacity-70">
                ✦ POST ✦
              </span>
            </button>
          </div>

          {/* RECEIVED stamp lands across the invoice */}
          <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
            <Stamp
              label="Received"
              sub={reference || " "}
              tone="red"
              rotate={-11}
              landed={done}
              className="text-[clamp(2rem,6vw,4.25rem)]"
            />
          </div>
        </form>
      </div>
    </LedgerSection>
  );
}
