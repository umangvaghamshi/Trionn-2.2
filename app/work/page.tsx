import OurWorkListing from "@/components/OurWorkListing/OurWorkListing";

export const metadata = { title: 'TRIONN® — Our Work' };

export default function Page() {
  return(
    <>
    <OurWorkListing />
    <div className="min-h-screen bg-[#0C0C0C]"></div>
    </>
  );
}
