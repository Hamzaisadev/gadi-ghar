"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

const TransactionLink = ({ children, href, ...props }) => {
  const router = useRouter();

  const handleTransition = async () => {
    e.preventDefault();
    router.push(href);
  };
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};

export default TransactionLink;
