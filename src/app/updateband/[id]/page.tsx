"use client"

import { useEntity } from "@/context/entitycontext";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import BandForm from "@/components/form";

export default function UpdateBandPage() {
    const { entities, updateEntity } = useEntity();
    const router = useRouter();
    const { id } = useParams();

    if (!id) {
        return <p>Loading...</p>;
    }

    const bandId = Array.isArray(id) ? Number(id[0]) : Number(id);
    const bandToUpdate = entities.find(entity => entity.id === bandId);

    const handleUpdateBand = (bandData: { name: string, genre: string, status: boolean, theme: string, country: string, label: string, link: string }) => {
        if (!bandToUpdate) return;

        const updatedBand = { ...bandToUpdate, ...bandData };
        updateEntity(bandToUpdate.id, updatedBand);
        router.push("/");
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
