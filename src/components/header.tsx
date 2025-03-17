import Image from "next/image";
import { Button } from "@heroui/react"
import { Link, Text, Heading } from "@chakra-ui/react"

const Header = () => {
    return (
        <>
                <div className="w-full h-100 flex items-center justify-center overflow-hidden">
                    <Image
                        src="/lemmy.jpg"
                        alt="Description of the image"
                        width="1500"
                        height={1300}
                        className="object-cover filter brightness-50"
                    />

                    <div className="absolute">
                        <Heading textStyle="4xl" fontWeight="black">
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