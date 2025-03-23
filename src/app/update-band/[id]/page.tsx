"use client"

import { useEntity } from "@/context/entity-context";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import BandForm from "@/components/form";
import { toaster } from "@/components/ui/toaster"

export default function UpdateBandPage() {
    const { entities, updateEntity } = useEntity();
    const router = useRouter();
    const { id } = useParams();

    if (!id) {
        return <p>Loading...</p>;
    }

    const bandId = Array.isArray(id) ? Number(id[0]) : Number(id);
    const bandToUpdate = entities.find(entity => entity.id === bandId);

    const handleUpdateBand = (bandData: { name: string, genre: string, rating: number, status: boolean, theme: string, country: string, label: string, link: string }) => {
        if (!bandToUpdate) return;

        const updatedBand = { ...bandToUpdate, ...bandData };
        updateEntity(bandToUpdate.id, updatedBand);

        toaster.create({
            title: "Band Updated",
            description: "The band has been updated successfully.",
            type: "success",
            duration: 2000,
        });

        setTimeout(() => {
            router.push("/");
        }, 1000);
    };

    if (!bandToUpdate) {
        return <p>Band not found!</p>;
    }

    return (
        <div>
            <BandForm
                onSubmit={handleUpdateBand}
                initialData={bandToUpdate}
                isUpdateMode={true}
            />
        </div>
    );
}
