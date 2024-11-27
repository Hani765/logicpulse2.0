import { Metadata } from "next";

interface MetaDataProps {
  title: string;
  description: string;
}

// You cannot return Metadata directly in JSX, but you can modify the document's head
export default function MetaData({ title, description }: MetaDataProps) {
  return (
    <>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </head>
    </>
  );
}
