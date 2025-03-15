import Image from "next/image";
import { Button } from "@heroui/react"
import Link from "next/link";

const Header = () => {
    return (
        <>
            <div className="w-full h-100 flex items-center justify-center overflow-hidden">
                <Image
                    src="/lemmy.jpg"
                    alt="Description of the image"
                    width={1000}
                    height={1300}
                    className="object-cover filter brightness-30"
                />

                <div className="absolute">
                    <h2 className="text-white text-5xl font-black text-glow">Metal Bands</h2>
                    <br />
                    <div className="flex gap-5">
                        <Button size="md" className="bg-gray-200 pt-2 pb-2 pr-3 pl-3 rounded-lg text-gray-900 w-30">View Bands</Button>
                        <Link href="/addband"><Button size="md" className="bg-gray-200 pt-2 pb-2 pr-3 pl-3 rounded-lg text-gray-900 w-30">Add Band</Button></Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;