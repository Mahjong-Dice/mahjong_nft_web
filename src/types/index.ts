export interface NFTItemProps {
    image: string;
    name: string;
    description: string;
    attributes?: { trait_type: string; value: string }[];
}
