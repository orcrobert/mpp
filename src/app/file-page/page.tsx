"use client";

import { useState } from "react";
import { Flex, Heading, Input, Button, Text, Link, Box } from "@chakra-ui/react";

const FileUploadDownloadPage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [downloadFilename, setDownloadFilename] = useState<string>("");
    const [downloadStatus, setDownloadStatus] = useState<string>("");
    const [uploadedFilename, setUploadedFilename] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus("Please select a file.");
            return;
        }

        setUploadStatus("Uploading...");
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setUploadStatus(`Upload successful. Filename: ${data.filename}`);
                setUploadedFilename(data.filename);
            } else {
                setUploadStatus(`Upload failed: ${data.message}`);
            }
        } catch (error) {
            setUploadStatus(`Upload failed: ${error}`);
        }
    };

    const handleDownloadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDownloadFilename(event.target.value);
    };

    const handleDownload = () => {
        if (!downloadFilename) {
            setDownloadStatus("Please enter a filename to download.");
            return;
        }

        setDownloadStatus("Attempting download...");
        const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/download/${downloadFilename}`;

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', downloadFilename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadStatus(`Download initiated for ${downloadFilename}. Check your downloads.`);
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            marginTop={16}
            padding={8}
        >
            <Heading marginBottom={10} fontSize="3xl" fontWeight="black">File Upload and Download</Heading>

            <Flex direction="column" marginBottom={8} border="1px solid #ccc" padding={6} borderRadius="md" width="50%" maxWidth="600px">
                <Heading as="h2" size="lg" marginBottom={4}>Upload File</Heading>
                <Box marginBottom={4}>
                    <label htmlFor="upload-file-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Select File:
                    </label>
                    <Input type="file" id="upload-file-input" onChange={handleFileChange} />
                </Box>
                <Button colorScheme="blue" onClick={handleUpload} loading={uploadStatus === "Uploading..."}>
                    Upload
                </Button>
                {uploadStatus && <Text marginTop={2}>{uploadStatus}</Text>}
                {uploadedFilename && (
                    <Text marginTop={2}>
                        Uploaded Filename: <Text fontWeight="bold">{uploadedFilename}</Text>
                    </Text>
                )}
            </Flex>

            {/* Download Section */}
            <Flex direction="column" border="1px solid #ccc" padding={6} borderRadius="md" width="50%" maxWidth="600px">
                <Heading as="h2" size="lg" marginBottom={4}>Download File</Heading>
                <Box marginBottom={4}>
                    <label htmlFor="download-file-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Enter Filename to Download:
                    </label>
                    <Input type="text" id="download-file-input" value={downloadFilename} onChange={handleDownloadChange} />
                </Box>
                <Button colorScheme="green" onClick={handleDownload} loading={downloadStatus === "Attempting download..."}>
                    Download
                </Button>
                {downloadStatus && <Text marginTop={2}>{downloadStatus}</Text>}
            </Flex>
        </Flex>
    );
};

export default FileUploadDownloadPage;