declare module "swagger-jsdoc" {
  interface SwaggerJSDocOptions {
    definition: any;
    apis: string[];
  }

  export default function swaggerJSDoc(
    options: SwaggerJSDocOptions
  ): object;
}
