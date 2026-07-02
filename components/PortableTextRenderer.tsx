import { PortableText, PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import React from "react";

// Define the custom components for full control over rendering
const components: PortableTextComponents = {
  block: {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-4xl font-extrabold tracking-tight mt-10 mb-6 text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold tracking-tight mt-8 mb-4 text-foreground border-b pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium tracking-tight mt-6 mb-3 text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-medium tracking-tight mt-6 mb-2 text-foreground">
        {children}
      </h4>
    ),
    // Standard text
    normal: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground text-lg">
        {children}
      </p>
    ),
    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-primary pl-6 italic text-muted-foreground bg-muted/50 py-3 pr-4 rounded-r-md">
        {children}
      </blockquote>
    ),
  },
  list: {
    // Bulleted lists
    bullet: ({ children }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground text-lg space-y-2">
        {children}
      </ul>
    ),
    // Numbered lists
    number: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground text-lg space-y-2">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-2">{children}</li>,
    number: ({ children }) => <li className="pl-2">{children}</li>,
  },
  marks: {
    // Bold
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    // Italic
    em: ({ children }) => <em className="italic">{children}</em>,
    // Inline code
    code: ({ children }) => (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">
        {children}
      </code>
    ),
    // Links
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      const target = !value.href.startsWith("/") ? "_blank" : undefined;
      return (
        <Link
          href={value.href}
          rel={rel}
          target={target}
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
};

interface PortableTextRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any; // Type 'any' used here to accommodate Sanity's Portable Text array
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return (
    <div className="prose prose-blue dark:prose-invert max-w-none">
      <PortableText value={value} components={components} />
    </div>
  );
}
