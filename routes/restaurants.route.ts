import express, { Router } from "express";
import { Response, Request } from "express";
const router: Router = express.Router();

router.get("", (req: Request, res: Response) => {
    res.send("restaurants");
});

export default router;