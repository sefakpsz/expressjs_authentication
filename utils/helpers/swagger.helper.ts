import { Express, Request, Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { version } from '../../package.json'

import swaggerDoc from '../../swagger.json'

function swaggerDocs(app: Express, port: number) {
  app.use(
    '/docs',
    (req: any, res: any, next: any) => {
      req.headers['Authorization'] = 'Bearer ' + req.headers.Authorization

      next()
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc)
  )

  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerDoc)
  })

  console.log(`Docs avaliable at http://localhost:${port}/docs`)
}

export default swaggerDocs
