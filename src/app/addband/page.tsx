"use client"

import { useEntity } from "@/context/entitycontext";
import { useRouter } from "next/navigation";
import BandForm from "@/components/form";

export default function AddBandPage() {
    const { addEntity } = useEntity();
    const router = useRouter();

    const handleAddBand = (bandData: { name: string, genre: string, status: boolean, theme: string, country: string, label: string, link: string }) => {
        const newBand = {
            id: Date.now(),
            ...bandData,
        };
        addEntity(newBand);
        router.push("/");
    };

    return (
        <div>
            <BandForm onSubmit={handleAddBand} isUpdateMode={false} />
        </div>
    );
}
