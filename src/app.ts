import express from "express";
import Controller from "./interfaces/controller.interface";
import http from "http";
import chalk from "chalk";
import errorMiddleware from "./middleware/error.middleware";

class App {
    public app: express.Application; // Express Application
    public port: number | string; // Port Listen IN
    public domain: string;

    constructor(controllers: Controller[]) {
        this.app = express();
        const {PORT, DOMAIN} = process.env;
        this.domain = DOMAIN || "localhost";
        this.port = PORT || 8000;
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }


    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    // initialize
    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }


    // Run Server
    public listen() {
        const http_ = http.createServer(this.app).listen(this.port);
        (http_.listening) ?
            console.log(chalk.bgGreen.black(`SERVER CONNECTED ON [${(this.port == 80) ? "HTTP" : this.port}] => [${(http_.listening).toString().toUpperCase()}]`)) :
            console.log(chalk.bgRed.black(`SERVER CONNECTED ON [${(this.port == 80) ? "HTTP" : this.port}] => [${(http_.listening).toString().toUpperCase()}]`));



     /*      this.app.listen(this.port,()=>{
            console.log(chalk.green(`SERVER CONNECTED ON [${chalk.blue((this.port == 80) ? "HTTP" : this.port)}]`));
        })*/
    }

}

export default App;