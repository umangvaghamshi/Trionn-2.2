import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/components/Navbar";
import { HeaderSoundToggle } from "@/components/PageWrapper/HeaderSoundToggle";

export default function Header({
  data,
}: {
  data: {
    logo: string;
  };
}) {
  return (
    <>
      <header
        id="nav"
        className="site-header fixed w-full z-99 flex justify-between items-center py-10 transition-all duration-300 ease-in-out mix-blend-difference"
      >
        <div className="tr__container w-full flex items-center justify-between">
          <Link className="logo relative" href={`/`}>
            <Image
              src={data.logo}
              className="w-24 h-auto"
              alt="Trionn"
              width={94}
              height={25}
              priority={true}
            />
          </Link>
          <div className="flex items-center gap-4">
            <HeaderSoundToggle />
            <NavLinks></NavLinks>
          </div>
        </div>
      </header>
    </>
  );
}
