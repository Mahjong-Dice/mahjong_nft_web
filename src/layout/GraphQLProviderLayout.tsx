'use client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, // 你的 GraphQL 服务器地址
    cache: new InMemoryCache(),
});

export default function GraphQLProviderLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
} 