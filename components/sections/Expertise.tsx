import { expertise } from "@/content/site";
import { LedgerSection } from "@/components/motion/LedgerSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TAccount } from "@/components/ui/TAccount";

/** EXPERTISE: each area as a T-account card that flips to reveal its notes. */
export function Expertise() {
  return (
    <LedgerSection id="expertise" entry="expertise" aria-labelledby="expertise-title" className="py-24 md:py-36">
      <div className="container-ledger">
        <SectionHeading
          index="03"
          kicker={expertise.kicker}
          title={expertise.title}
          intro={expertise.intro}
          id="expertise-title"
        />
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          {expertise.accounts.map((a, i) => (
            <TAccount key={a.code} data={a} index={i} />
          ))}
        </div>
      </div>
    </LedgerSection>
  );
}
