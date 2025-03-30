"use client"

import { useEntity } from "@/context/entity-context";
import { useRouter } from "next/navigation";
import BandForm from "@/components/form";
import { toaster } from "@/components/ui/toaster"

export default function AddBandPage() {
    const { addEntity } = useEntity();
    const router = useRouter();

    const handleAddBand = (bandData: { name: string, genre: string, rating: number, status: boolean, theme: string, country: string, label: string, link: string }) => {
        const newBand = {
            id: Date.now(),
            ...bandData,
        };
        
        addEntity(newBand);
        toaster.create({
            title: "Band Added",
            description: "The band has been added successfully.",
            type: "success",
            duration: 2000,
        });

        setTimeout(() => {
            router.push("/");
        }, 1000);
    };

    return (
        <div>
            <BandForm onSubmit={handleAddBand} isUpdateMode={false} />
        </div>
    );
}
