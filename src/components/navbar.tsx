// import Link from "next/link";
import { Link } from "@chakra-ui/react"
import AddBandPage from "@/app/addband/page";

const Navbar = () => {
    return (
        <header className="h-16 flex items-center justify-between  top-0">
            <ul className="flex gap-4">
                <li><Link href="/" fontSize="sm" fontWeight="bold">Home</Link></li>
                <li><Link href="#table-view-section" fontSize="sm" fontWeight="bold">View</Link></li>
                <li><Link href="/addband" fontSize="sm" fontWeight="bold">Add band</Link></li>
            </ul>
        </header>
    )
}

export default Navbar;