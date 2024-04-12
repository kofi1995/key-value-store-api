import { Router } from "express";
import { StoreController } from "../Controller/store-controller";

const router: Router = Router();

router.get('/store/:key', StoreController.get)

router.post('/store', StoreController.add)

router.delete('/store/:key', StoreController.delete)

export default router;
