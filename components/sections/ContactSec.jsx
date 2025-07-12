import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

const ContactSec = () => {
  return (
    <section>
      <div className="container">
        <div>
          <Image src="/contact.png" alt="Contact" width={400} height={300} />
        </div>
        <div>
          <h2>Contact Us</h2>
          <p>Get in touch with us for any inquiries</p>
          <div>{/* Add your contact information or form here */}</div>
          <Button>Contact Now</Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSec;
