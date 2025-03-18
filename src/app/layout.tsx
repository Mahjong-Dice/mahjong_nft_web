import WagmiProviderLayout from "@/layout/WagmiProviderLayout";
import "../styles/globals.css";
import GraphQLProviderLayout from "@/layout/GraphQLProviderLayout";
import { JSX } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <WagmiProviderLayout>
          <GraphQLProviderLayout>{children}</GraphQLProviderLayout>
        </WagmiProviderLayout>
      </body>
    </html>
  );
}
