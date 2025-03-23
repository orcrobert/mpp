"use client";

import { useEntity } from "@/context/entity-context";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from "chart.js";

import { Flex, Heading } from "@chakra-ui/react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const ChartsPage = () => {
    const { chartData } = useEntity();

    const genreDistributionData = {
        labels: chartData.genreDistribution.map(item => item.name),
        datasets: [
            {
                label: 'Genre Distribution',
                data: chartData.genreDistribution.map(item => item.value),
                backgroundColor: '#4e73df',
                borderColor: '#4e73df',
                borderWidth: 1,
            },
        ],
    };

    const ratingsDistributionData = {
        labels: chartData.ratingsDistribution.map(item => item.rating),
        datasets: [
            {
                label: 'Ratings Distribution',
                data: chartData.ratingsDistribution.map(item => item.count),
                fill: false,
                borderColor: '#1cc88a',
                tension: 0.1,
            },
        ],
    };

    const topRatedEntitiesData = {
        labels: chartData.topRatedEntities.map(item => item.name),
        datasets: [
            {
                data: chartData.topRatedEntities.map(item => item.rating),
                backgroundColor: chartData.topRatedEntities.map((_, idx) => `hsl(${(360 / chartData.topRatedEntities.length) * idx}, 100%, 50%)`),
                hoverOffset: 4,
            },
        ],
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            marginTop={16}
        >
            <Heading marginBottom={10} fontSize="3xl" fontWeight="black">Charts</Heading>

            <div style={{ width: "50%", marginBottom: "40px" }}>
                <h2>Genre Distribution</h2>
                <Bar data={genreDistributionData} />
            </div>

            <div style={{ width: "50%", marginBottom: "40px" }}>
                <h2>Ratings Distribution</h2>
                <Line data={ratingsDistributionData} />
            </div>

            <div style={{ width: "50%", marginBottom: "40px" }}>
                <h2>Top Rated Entities</h2>
                <Pie data={topRatedEntitiesData} />
            </div>
        </Flex>
    );
};

export default ChartsPage;
