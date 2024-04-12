import express, {Express, NextFunction, Request, Response} from "express";
import { KeyValueStore } from './Service/key-value-store'
import Routes from "./Routes/routes";

const app: Express = express();

app.set('KeyValueStore', new KeyValueStore)

app.use(express.json());

app.use(function(req: Request, res: Response, next: NextFunction) {
    res.setHeader('Content-Type', 'application/json')
    next();
});

app.use('/', Routes);

export default app;
