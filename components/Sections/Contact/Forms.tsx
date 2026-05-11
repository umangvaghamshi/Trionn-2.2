import { BlurTextReveal } from "@/components/TextAnimation";
import { Dropdown } from "@/components/Dropdown";
import { WordShiftButton } from "@/components/Button";
import LinePlus from "@/components/LinePlus";
import Link from "next/link";

// --- 1. Move InputGroup OUTSIDE the main component ---
interface InputGroupProps {
  id: string;
  label: string;
  type?: string; // The "?" makes it optional
  name: string;
  placeholder: string;
  optional?: boolean;
  isTextArea?: boolean;
}

const InputGroup = ({
  id,
  label,
  type = "text",
  name,
  placeholder,
  optional,
  isTextArea = false,
}: InputGroupProps) => {
  // <--- Add the type here
  const InputComponent = isTextArea ? "textarea" : "input";

  return (
    <div>
      <label
        htmlFor={id}
        className="title flex justify-between items-center mb-2"
      >
        {label}
        {optional && <span className="text-[#D8D8D8]/30">optional</span>}
      </label>
      <InputComponent
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        rows={isTextArea ? 5 : undefined}
        className={`text-field ${isTextArea ? "resize-none" : ""}`}
      />
    </div>
  );
};

export default function Forms() {
  const budgetOptions = [
    { value: "Less than $1000 USD", label: "Less than $1000 USD" },
    { value: "$1001 - $5000 USD", label: "$1001 - $5000 USD" },
    { value: "$5001 - $10000 USD", label: "$5001 - $10000 USD" },
    { value: "$10001 - $20000 USD", label: "$10001 - $20000 USD" },
    { value: "More than $20000 USD", label: "More than $20000 USD" },
  ];

  return (
    <section className="pb-20 lg:pb-37.5 pt-20 lg:pt-25 relative bg-[#040508] text-light-font">
      <div className="tr__container">
        <div className="grid grid-cols-12 gap-10 lg:gap-6">
          <div className="col-span-12 lg:col-span-5 lg:col-start-7 flex flex-col mb-8 lg:mb-20">
            <p className="small max-w-60 lg:max-w-50">
              A short conversation is often the best place to begin.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-10 lg:gap-6">
          <div className="left-block col-span-12 lg:col-span-4 lg:col-start-2 flex flex-col items-center gap-6 text-center order-2 lg:order-1">
            <div className="video-block mx-auto max-w-134">
              <video
                src="/video/logo-box.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full mix-blend-lighten"
              />
            </div>
            <BlurTextReveal
              as="span"
              html="TRIONN DESIGN <br/>216 - 4Plus Complex, Astron Chowk <br/>Rajkot, Gujarat, India"
              animationType="words"
              stagger={0.08}
              className="title"
            />
          </div>
          <div className="right-block col-span-12 lg:col-span-5 lg:col-start-7 flex flex-col order-1 lg:order-2">
            <form className="flex flex-col gap-4 lg:gap-6">
              <InputGroup
                id="fname"
                name="name"
                label="Name"
                placeholder="Your name"
              />
              <InputGroup
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="Your email address"
              />
              <InputGroup
                id="company"
                name="company"
                label="Company"
                placeholder="Organization or team"
                optional
              />
              <InputGroup
                id="message"
                name="message"
                label="Message *"
                placeholder="Tell us a bit..."
                isTextArea
              />

              <div>
                <label
                  htmlFor="budget"
                  className="title flex justify-between items-center mb-2"
                >
                  Estimated budget{" "}
                  <span className="text-[#D8D8D8]/30">optional</span>
                </label>
                <Dropdown options={budgetOptions} placeholder="Select budget" />
                <p className="small text-light-font/30 mt-1">
                  A rough range helps us understand context.
                </p>
              </div>

              <div className="mt-10 lg:mt-16">
                <WordShiftButton
                  type="submit"
                  text="Start the conversation"
                  customClass="min-w-63"
                  styleVars={{ buttonWrapperColor: "#D8D8D8" }}
                />
              </div>
            </form>
          </div>
        </div>
        <LinePlus
          customClass="my-16 lg:my-30"
          lineClass={"bg-[#2F323B] left-1/2! -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto"}
          iconColor={"#D8D8D8"}
        />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 lg:col-start-2 flex flex-col justify-center items-start">
            <BlurTextReveal
              as="h2"
              html="Join Trionn"
              animationType="chars"
              stagger={0.08}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 md:col-start-7 flex flex-col justify-center items-start">
            <p className="small sm:max-w-75">
              We work with people who care deeply about craft, clarity, and
              thoughtful execution. <br />
              <br />
              Send a short note and your work.
            </p>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-2 flex flex-col justify-center items-start mt-6 sm:mt-0">
            <Link href="mailto:hello@trionn.com" className="h3 mb-2 link">
              hello@trionn.com
            </Link>
            <p className="small text-light-font/60">
              Or, reach out via the contact form.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
