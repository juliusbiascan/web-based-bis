import Link from "next/link";

const Footer = () => {
  return (

    <div className="bg-primary">
      <div className="w-full max-w-5xl px-4 mx-auto py-10 md:py-16 text-white text-sm relative">
        <div className="flex flex-col md:flex-row flex-wrap space-y-6 md:space-y-0"><div className="mr-8 md:mr-20 absolute md:relative right-0">
          <img className="w-40" src="/coat-of-arms-32c5a97b.png" title="Coat of Arms" />
        </div>
          <div className="mr-auto">
            <div className="flex items-center sm:space-x-4 space-x-0 mb-4">
              <img className="h-14 hidden sm:block" src="/bagong-pilipinas-light-d08eadb4.png" alt="" />
              <img className="h-7 sm:h-9 md:h-10 w-auto" src="/logo-macatiw-ebrgy-light.png" title="Macatiw | eBarangay" />
            </div>
            <div>
              Copyright © 2025 Macatiw | eBarangay
            </div>
            <div>
              All Rights Reserved
            </div>
          </div>
          <div className="flex flex-col space-y-4 mr-auto">
            <Link href="/#home" className="font-semibold active">
              Home
            </Link>
            <Link href="/#features" className="font-semibold active">
              Features
            </Link>
            <Link href="/#contact" className="font-semibold active">
              Contact Us
            </Link>
            <Link href="/privacy-policy" className="font-semibold active">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="font-semibold active">
              Terms of Use
            </Link>

          </div>
          <div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">
              DEVELOPED BY
            </div>
            <div className="flex items-center space-x-2">
              <img className="h-16" src="/css_logov2.png" alt="" />
              <img className="h-16" src="/passlogo-large.png" alt="" />
            </div>
          </div>
        </div>
        <img className="h-20 absolute bottom-10 right-10 sm:hidden block" src="/bagong-pilipinas-light-d08eadb4.png" alt="" />
      </div>
    </div>
  );
}

export default Footer;