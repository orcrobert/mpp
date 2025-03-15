import Link from "next/link";
import AddBandPage from "@/app/addband/page";

const Navbar = () => {
    return (
        <header className="h-16 flex items-center justify-between  top-0">
            <ul className="flex gap-4">
                <li><Link href="/" className="font-semibold">Home</Link></li>
                <li><Link href="/" className="font-semibold">View</Link></li>
                <li><Link href="/addband" className="font-semibold">Add band</Link></li>
            </ul>
        </header>
    )
}

export default Navbar;