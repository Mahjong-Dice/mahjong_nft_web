import WagmiProviderLayout from "@/layout/WagmiProviderLayout";
import "../styles/globals.css";
import GraphQLProviderLayout from "@/layout/GraphQLProviderLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
