/// <reference lib="webworker" />
import { AcDbBaseWorker } from '@mlightcad/data-model'
import DxfParser from '@mlightcad/dxf-json'

/**
 * DXF parsing worker
 */
class AcDbDxfParserWorker extends AcDbBaseWorker<string, any> {
  protected async executeTask(dxfString: string): Promise<any> {
    const parser = new DxfParser()
    return parser.parseSync(dxfString)
  }
}

// Initialize the worker
new AcDbDxfParserWorker()
