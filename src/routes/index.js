import devicesRouter from './devicesRouter.js';
import userRouter from './userRouter.js';
import ordersRouter from './ordersRouter.js';
export default function route(app) {
  app.use('/user', userRouter);
  app.use('/orders', ordersRouter);
  app.use('/', devicesRouter);
}
