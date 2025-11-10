// En un archivo, por ejemplo: src/app/core/models/base-api.model.ts

export interface BaseApiModel {
  /** * Nombre legible o clave del endpoint.
   */
  name: string;

  /**
   * La URL relativa del endpoint.
   */
  path: string;

  version: string;
}