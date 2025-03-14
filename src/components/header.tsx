import Image from "next/image";

const Header = () => {
    return (
        <>
            <div>
                <Image
                    src="/lemmy.jpg"
                    alt="Description of the image"
                    width={1000}
                    height={1300}
                />
            </div>
        </>
    )
}

export default Header;