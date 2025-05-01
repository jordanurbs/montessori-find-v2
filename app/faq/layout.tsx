import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions About Montessori Schools',
  description: 'Find answers to common questions about Montessori education, school selection, and the MontessoriFind platform. Learn about Montessori principles, school accreditation, and more.'
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 