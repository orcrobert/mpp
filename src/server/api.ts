import express, { type Request, type Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/status", (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});