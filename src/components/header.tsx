import Image from "next/image";
import { Button } from "@heroui/react"
import { Link, Text, Heading, Box } from "@chakra-ui/react"

const Header = () => {
    return (
        <>
            <div className="w-full h-100 flex items-center justify-center overflow-hidden rounded-md group">
                <Image
                    src="/lemmy.jpg"
                    alt="Description of the image"
                    width={1500}
                    height={1300}
                    className="object-cover filter brightness-70"
                />
                <div className="bg-red-600 blur-2xl h-0 w-220 absolute -z-10 transition-all duration-1500 group-hover:[w-256px] group-hover:h-[250px]"></div>
                <div className="bg-black blur-2xl h-30 w-70 absolute z-0 rounded-3xl"></div>

                <div className="absolute">
                    <Heading textStyle="4xl" fontWeight="black"
                        textShadow="0 0 1px rgba(0, 0, 0, 0.7), 0 0 3px rgba(0, 0, 0, 0.6), 0 0 5px rgba(0, 0, 0, 0.5)"
                        zIndex={10}>
                        Metal Bands
                    </Heading>
                    <br />
                    <div className="flex gap-5">
                        <Link href="#table-view-section" color="gray.100" background="gray.800" paddingX="2" paddingY="1" rounded="md">View Bands</Link>
                        <Link href="/add-band" color="gray.900" background="gray.100" paddingX="2" paddingY="1" rounded="md">Add Band</Link>
                    </div>
                </div>
            </div>
            <div className="mt-6">

            </div>
        </>
    )
}

export default Header;