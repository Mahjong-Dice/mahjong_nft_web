import { memo } from "react";

export interface NFTItemProps {
    image: string;
    name: string;
    description: string;
    attributes?: { trait_type: string; value: string }[];
}

function NFTItem({ image, name, description }: NFTItemProps) {
    return (
        <div className="group cursor-pointer relative overflow-hidden rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-lg">
                <img 
                    src={image} 
                    alt={name} 
                    className="h-full w-full scale-80 object-cover transition-transform duration-300 group-hover:scale-100"
                />
            </div>
            <div className="mt-3 space-y-2">
                <h3 className="text-lg font-semibold text-white">{name}</h3>
                <p className="text-sm text-gray-400">简介 {description}</p>
                <div className="flex items-center justify-between">
                    {/* <span className="text-base font-medium text-green-400">{price} ETH</span> */}
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(NFTItem);