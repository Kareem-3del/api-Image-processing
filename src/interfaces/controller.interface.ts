import { Router } from 'express';

type Controller = {
  path: string;
  router: Router;
};

export default Controller;
