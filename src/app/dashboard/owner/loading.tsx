import Image from "next/image";

export default function Loading() {
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative h-48 w-48 animate-pulse">
                    <Image
                        src="/logo.png"
                        alt="Restau+ Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                {/* <p className="text-sm text-zinc-500 animate-pulse font-medium">Loading...</p> */}
            </div>
        </div>
    );
}
