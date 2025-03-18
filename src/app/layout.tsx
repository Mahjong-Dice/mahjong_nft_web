import WagmiProviderLayout from "@/layout/WagmiProviderLayout";
import "../styles/globals.css";
import GraphQLProviderLayout from "@/layout/GraphQLProviderLayout";
import AntdProviderLayout from "@/layout/AntdProviderLayout";
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
          <GraphQLProviderLayout>
            <AntdProviderLayout>
              {children}
            </AntdProviderLayout>
          </GraphQLProviderLayout>
        </WagmiProviderLayout>
      </body>
    </html>
  );
}
