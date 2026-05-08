import { BlurTextReveal } from "@/components/TextAnimation";
import Accordion from "@/components/Accordion";
import { contactFAQ } from "@/data";

export default function FAQ() {
  return (
    <section className="py-20 lg:py-37.5 relative bg-[linear-gradient(0deg,#C3C3C3_0%,#FFFFFF_100%)] text-dark-font">
      <div className="tr__container grid grid-cols-12 md:gap-6">
        <div className="col-span-12 md:col-span-6 lg:col-span-4 lg:col-start-2 flex flex-col gap-4 md:gap-10">
          <BlurTextReveal
            as="h2"
            html="Questions"
            animationType="chars"
            stagger={0.08}
          />
          <p className="small lg:max-w-42">
            Common things people ask before we begin.
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-5 md:col-start-7">
          <Accordion items={contactFAQ} />
        </div>
      </div>
    </section>
  );
}
