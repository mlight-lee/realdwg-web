import {
  AcGeBox3d,
  AcGeEuler,
  AcGeMatrix3d,
  AcGePoint3d,
  AcGeQuaternion,
  AcGeVector3d
} from '@mlightcad/geometry-engine'
import { AcGiEntity, AcGiRenderer } from '@mlightcad/graphic-interface'

import { AcDbRenderingCache } from '../misc'
import { AcDbEntity } from './AcDbEntity'

/**
 * Represents a block reference entity in AutoCAD.
 *
 * A block reference is used to place, size, and display an instance of the collection
 * of entities within the block table record that it references. Block references allow
 * you to reuse complex geometry by referencing a block definition multiple times with
 * different positions, rotations, and scales.
 *
 * @example
 * ```typescript
 * // Create a block reference
 * const blockRef = new AcDbBlockReference("MyBlock");
 * blockRef.position = new AcGePoint3d(10, 20, 0);
 * blockRef.rotation = Math.PI / 4; // 45 degrees
 * blockRef.scaleFactors = new AcGePoint3d(2, 2, 1); // 2x scale
 *
 * // Access block reference properties
 * console.log(`Block name: ${blockRef.blockTableRecord?.name}`);
 * console.log(`Position: ${blockRef.position}`);
 * console.log(`Rotation: ${blockRef.rotation}`);
 * ```
 */
export class AcDbBlockReference extends AcDbEntity {
  /** The WCS position point (insertion point) of the block reference */
  private _position: AcGePoint3d
  /** The rotation value in radians */
  private _rotation: number
  /** The X, Y, and Z scale factors for the block reference */
  private _scaleFactors: AcGePoint3d
  /** The normal vector of the plane containing the block reference */
  private _normal: AcGeVector3d
  /** The name of the referenced block */
  private _blockName: string

  /**
   * Creates a new block reference entity.
   *
   * This constructor initializes a block reference with the specified block name.
   * The position is set to the origin, rotation to 0, normal to Z-axis, and scale factors to 1.
   *
   * @param blockName - The name of the block table record to reference
   *
   * @example
   * ```typescript
   * const blockRef = new AcDbBlockReference("MyBlock");
   * blockRef.position = new AcGePoint3d(5, 10, 0);
   * blockRef.rotation = Math.PI / 6; // 30 degrees
   * ```
   */
  constructor(blockName: string) {
    super()
    this._blockName = blockName
    this._position = new AcGePoint3d()
    this._rotation = 0.0
    this._normal = new AcGeVector3d(0, 0, 1)
    this._scaleFactors = new AcGePoint3d(1, 1, 1)
  }

  /**
   * Gets the WCS position point (insertion point) of the block reference.
   *
   * @returns The position point in WCS coordinates
   *
   * @example
   * ```typescript
   * const position = blockRef.position;
   * console.log(`Block position: ${position.x}, ${position.y}, ${position.z}`);
   * ```
   */
  get position() {
    return this._position
  }

  /**
   * Sets the WCS position point (insertion point) of the block reference.
   *
   * @param value - The new position point
   *
   * @example
   * ```typescript
   * blockRef.position = new AcGePoint3d(15, 25, 0);
   * ```
   */
  set position(value: AcGePoint3d) {
    this._position.copy(value)
  }

  /**
   * Gets the rotation value of the block reference.
   *
   * The rotation value is relative to the X axis of a coordinate system that is parallel
   * to the OCS of the block reference, but has its origin at the position point of the
   * block reference. The rotation axis is the Z axis of this coordinate system with
   * positive rotations going counterclockwise when looking down the Z axis towards the origin.
   *
   * @returns The rotation value in radians
   *
   * @example
   * ```typescript
   * const rotation = blockRef.rotation;
   * console.log(`Rotation: ${rotation} radians (${rotation * 180 / Math.PI} degrees)`);
   * ```
   */
  get rotation() {
    return this._rotation
  }

  /**
   * Sets the rotation value of the block reference.
   *
   * @param value - The new rotation value in radians
   *
   * @example
   * ```typescript
   * blockRef.rotation = Math.PI / 4; // 45 degrees
   * ```
   */
  set rotation(value: number) {
    this._rotation = value
  }

  /**
   * Gets the X, Y, and Z scale factors for the block reference.
   *
   * @returns The scale factors as a 3D point
   *
   * @example
   * ```typescript
   * const scaleFactors = blockRef.scaleFactors;
   * console.log(`Scale factors: ${scaleFactors.x}, ${scaleFactors.y}, ${scaleFactors.z}`);
   * ```
   */
  get scaleFactors() {
    return this._scaleFactors
  }

  /**
   * Sets the X, Y, and Z scale factors for the block reference.
   *
   * @param value - The new scale factors
   *
   * @example
   * ```typescript
   * blockRef.scaleFactors = new AcGePoint3d(2, 1.5, 1); // 2x X scale, 1.5x Y scale
   * ```
   */
  set scaleFactors(value: AcGePoint3d) {
    this._scaleFactors.copy(value)
  }

  /**
   * Gets the normal vector of the plane containing the block reference.
   *
   * @returns The normal vector
   *
   * @example
   * ```typescript
   * const normal = blockRef.normal;
   * console.log(`Normal: ${normal.x}, ${normal.y}, ${normal.z}`);
   * ```
   */
  get normal() {
    return this._normal
  }

  /**
   * Sets the normal vector of the plane containing the block reference.
   *
   * @param value - The new normal vector
   *
   * @example
   * ```typescript
   * blockRef.normal = new AcGeVector3d(0, 0, 1);
   * ```
   */
  set normal(value: AcGeVector3d) {
    this._normal.copy(value).normalize()
  }

  /**
   * Gets the block table record referenced by this block reference.
   *
   * The referenced block table record contains the entities that the block reference will display.
   *
   * @returns The block table record, or undefined if not found
   *
   * @example
   * ```typescript
   * const blockRecord = blockRef.blockTableRecord;
   * if (blockRecord) {
   *   console.log(`Block name: ${blockRecord.name}`);
   * }
   * ```
   */
  get blockTableRecord() {
    return this.database.tables.blockTable.getAt(this._blockName)
  }

  /**
   * Gets the geometric extents (bounding box) of this block reference.
   *
   * This method calculates the bounding box by transforming the geometric extents
   * of all entities in the referenced block according to the block reference's
   * position, rotation, and scale factors.
   *
   * @returns The bounding box that encompasses the entire block reference
   *
   * @example
   * ```typescript
   * const extents = blockRef.geometricExtents;
   * console.log(`Block bounds: ${extents.minPoint} to ${extents.maxPoint}`);
   * ```
   */
  get geometricExtents(): AcGeBox3d {
    const box = new AcGeBox3d()
    const blockTableRecord = this.blockTableRecord
    if (blockTableRecord != null) {
      const entities = blockTableRecord.newIterator()
      for (const entity of entities) {
        box.union(entity.geometricExtents)
      }
    }

    const quaternion = new AcGeQuaternion().setFromEuler(
      new AcGeEuler(this.rotation, 0, 0)
    )
    const matrix = new AcGeMatrix3d()
    matrix.compose(this.position, quaternion, this.scaleFactors)
    box.applyMatrix4(matrix)

    return box
  }

  /**
   * @inheritdoc
   */
  draw(renderer: AcGiRenderer) {
    const results: AcGiEntity[] = []
    const blockTableRecord = this.blockTableRecord
    if (blockTableRecord != null) {
      const matrix = this.computeTransformMatrix()
      const block = AcDbRenderingCache.instance.draw(
        renderer,
        blockTableRecord,
        this.rgbColor,
        true,
        matrix,
        this.normal
      )
      return block
    } else {
      return renderer.group(results)
    }
  }

  private computeTransformMatrix() {
    const quaternion = new AcGeQuaternion()
    quaternion.setFromAxisAngle(AcGeVector3d.Z_AXIS, this.rotation)
    return new AcGeMatrix3d().compose(
      this._position,
      quaternion,
      this._scaleFactors
    )
  }
}
