import express, { Router } from "express";
import { postLogin } from "handlers/users.handler";
import loginAuth from "middlewares/loginAuth";
import guardRoute from "middlewares/guardAuth";
const router: Router = express.Router();

router.get("", guardRoute);

router.get("/login", loginAuth);

router.post("/login", postLogin);

export default router;