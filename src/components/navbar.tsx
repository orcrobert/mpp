import { Link } from "@chakra-ui/react"
import AddBandPage from "@/app/add-band/page";

const Navbar = () => {
    return (
        <header className="h-16 flex items-center justify-between top-0">
            <div className="dark:bg-green-500 blur-3xl h-10 w-50 absolute z-0 opacity-70"></div>
            <ul className="flex gap-4 z-10">
                <li><Link href="/" fontSize="sm" fontWeight="bold">Home</Link></li>
                <li><Link href="#table-view-section" fontSize="sm" fontWeight="bold">View</Link></li>
                <li><Link href="/add-band" fontSize="sm" fontWeight="bold">Add band</Link></li>
                <li><Link href="chart-page" fontSize="sm" fontWeight="bold">Charts Page</Link></li>
                <li><Link href="file-page" fontSize="sm" fontWeight="bold">File Page</Link></li>
            </ul>
        </header>
    )
}

export default Navbar;