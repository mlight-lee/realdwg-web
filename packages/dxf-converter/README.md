# @mlightcad/dxf-converter

The `dxf-converter` package provides a DXF file converter for the RealDWG-Web ecosystem, enabling reading and conversion of DXF (Drawing Exchange Format) files into the AutoCAD-like drawing database structure. It is based on the [@mlightcad/dxf-json](https://www.npmjs.com/package/@mlightcad/dxf-json) library for parsing DXF files.

## Overview

This package implements a DXF file converter compatible with the RealDWG-Web data model. It allows you to register DXF file support in your application and convert DXF files into the in-memory drawing database. DXF files are widely used for exchanging CAD data between different applications.

## Key Features

- **DXF File Support**: Read and convert DXF files to the drawing database
- **Comprehensive Entity Support**: Handles various DXF entities including lines, circles, polylines, blocks, text, and more
- **Table Processing**: Converts DXF tables (layers, linetypes, text styles, dimension styles, etc.)
- **Block Support**: Processes block definitions and references
- **Integration**: Designed to work with the RealDWG-Web data model and converter manager
- **Worker Support**: Includes web worker implementation for non-blocking file processing

## Installation

```bash
npm install @mlightcad/dxf-converter
```

> **Peer dependencies:**
> - `@mlightcad/data-model`

## Usage Example

```typescript
import { AcDbDatabaseConverterManager, AcDbFileType } from '@mlightcad/data-model';
import { AcDbDxfConverter } from '@mlightcad/dxf-converter';

// Register the DXF converter
const dxfConverter = new AcDbDxfConverter();
AcDbDatabaseConverterManager.instance.register(AcDbFileType.DXF, dxfConverter);

// Read DXF file as one string
const dxfFileString = ...;

// Convert a DXF file
const database = await dxfConverter.convert(dxfFileString);
```

## API

- **AcDbDxfConverter**: Main converter class for DXF files (extends `AcDbDatabaseConverter`)
- **AcDbEntityConverter**: Handles conversion of DXF entities to AcDb entities
- **AcDbObjectConverter**: Handles conversion of DXF objects to AcDb objects
- **AcDbDxfParserWorker**: Web worker for parsing DXF files asynchronously

## Dependencies

- **@mlightcad/data-model**: Drawing database and entity definitions
- **@mlightcad/dxf-json**: DXF file parsing library

## API Documentation

For detailed API documentation, visit the [RealDWG-Web documentation](https://mlight-lee.github.io/realdwg-web/).

## Contributing

This package is part of the RealDWG-Web monorepo. Please refer to the main project README for contribution guidelines. 