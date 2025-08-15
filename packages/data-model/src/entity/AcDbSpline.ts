import { AcCmErrors } from '@mlightcad/common'
import {
  AcGeKnotParameterizationType,
  AcGePoint3dLike,
  AcGeSpline3d
} from '@mlightcad/geometry-engine'
import { AcGiRenderer } from '@mlightcad/graphic-interface'

import { AcDbCurve } from './AcDbCurve'

/**
 * Represents a spline entity in AutoCAD.
 * 
 * A spline is a 3D geometric object defined by control points or fit points.
 * Splines are smooth curves that can be used to create complex curved shapes
 * in drawings. They can be either open or closed curves.
 * 
 * @example
 * ```typescript
 * // Create a spline from control points
 * const controlPoints = [
 *   new AcGePoint3d(0, 0, 0),
 *   new AcGePoint3d(5, 5, 0),
 *   new AcGePoint3d(10, 0, 0)
 * ];
 * const knots = [0, 0, 0, 1, 1, 1];
 * const spline = new AcDbSpline(controlPoints, knots);
 * 
 * // Create a spline from fit points
 * const fitPoints = [
 *   new AcGePoint3d(0, 0, 0),
 *   new AcGePoint3d(5, 5, 0),
 *   new AcGePoint3d(10, 0, 0)
 * ];
 * const spline2 = new AcDbSpline(fitPoints, AcGeKnotParameterizationType.Uniform);
 * ```
 */
export class AcDbSpline extends AcDbCurve {
  /** The underlying geometric spline object */
  private _geo: AcGeSpline3d

  /**
   * Creates a new spline entity from control points.
   * 
   * This constructor creates a spline using the specified control points, knots,
   * and optional weights. The control points must be in World Coordinate System (WCS) coordinates.
   * 
   * @param controlPoints - Array of control points in WCS coordinates
   * @param knots - Array of knot values that define the spline's parameterization
   * @param weights - Optional array of weights for each control point (default: 1 for all)
   * @param degree - Optional degree of the spline (default: 3)
   * @param closed - Whether the spline should be closed (default: false)
   * 
   * @example
   * ```typescript
   * const controlPoints = [
   *   new AcGePoint3d(0, 0, 0),
   *   new AcGePoint3d(5, 5, 0),
   *   new AcGePoint3d(10, 0, 0)
   * ];
   * const knots = [0, 0, 0, 1, 1, 1];
   * const spline = new AcDbSpline(controlPoints, knots);
   * ```
   */
  constructor(
    controlPoints: AcGePoint3dLike[],
    knots: number[],
    weights?: number[],
    degree?: number,
    closed?: boolean
  )
  /**
   * Creates a new spline entity from fit points.
   * 
   * This constructor creates a spline that passes through the specified fit points.
   * The fit points must be in World Coordinate System (WCS) coordinates.
   * 
   * @param fitPoints - Array of fit points in WCS coordinates
   * @param knotParam - Knot parameterization type that defines how knots are generated
   * @param degree - Optional degree of the spline (default: 3)
   * @param closed - Whether the spline should be closed (default: false)
   * 
   * @example
   * ```typescript
   * const fitPoints = [
   *   new AcGePoint3d(0, 0, 0),
   *   new AcGePoint3d(5, 5, 0),
   *   new AcGePoint3d(10, 0, 0)
   * ];
   * const spline = new AcDbSpline(fitPoints, AcGeKnotParameterizationType.Uniform);
   * ```
   */
  constructor(
    fitPoints: AcGePoint3dLike[],
    knotParam: AcGeKnotParameterizationType,
    degree?: number,
    closed?: boolean
  )
  constructor(a?: unknown, b?: unknown, c?: unknown, d?: unknown, e?: unknown) {
    super()
    const argsLength =
      +(a !== undefined) +
      +(b !== undefined) +
      +(c !== undefined) +
      +(d !== undefined) +
      +(e !== undefined)

    if (argsLength < 2 || argsLength > 5) {
      throw AcCmErrors.ILLEGAL_PARAMETERS
    }

    // Determine if this is the fitPoints constructor (second arg is not an array)
    const isFitPointsConstructor = !Array.isArray(b)

    if (isFitPointsConstructor) {
      this._geo = new AcGeSpline3d(
        a as AcGePoint3dLike[],
        b as AcGeKnotParameterizationType,
        c as number | undefined,
        d as boolean | undefined
      )
    } else {
      this._geo = new AcGeSpline3d(
        a as AcGePoint3dLike[],
        b as number[],
        c as number[] | undefined,
        d as number | undefined,
        e as boolean | undefined
      )
    }
  }

  /**
   * Gets the geometric extents (bounding box) of this spline.
   * 
   * @returns The bounding box that encompasses the entire spline
   * 
   * @example
   * ```typescript
   * const extents = spline.geometricExtents;
   * console.log(`Spline bounds: ${extents.minPoint} to ${extents.maxPoint}`);
   * ```
   */
  get geometricExtents() {
    return this._geo.box
  }

  /**
   * Gets whether this spline is closed.
   * 
   * A closed spline forms a complete loop where the end point connects to the start point.
   * 
   * @returns True if the spline is closed, false otherwise
   * 
   * @example
   * ```typescript
   * const isClosed = spline.closed;
   * console.log(`Spline is closed: ${isClosed}`);
   * ```
   */
  get closed(): boolean {
    return this._geo.closed
  }

  /**
   * Sets whether this spline is closed.
   * 
   * @param value - True to close the spline, false to open it
   * 
   * @example
   * ```typescript
   * spline.closed = true; // Close the spline
   * ```
   */
  set closed(value: boolean) {
    this._geo.closed = value
  }

  /**
   * Draws this spline using the specified renderer.
   * 
   * This method renders the spline as a series of connected line segments
   * using the spline's current style properties.
   * 
   * @param renderer - The renderer to use for drawing
   * @returns The rendered spline entity, or undefined if drawing failed
   * 
   * @example
   * ```typescript
   * const renderedSpline = spline.draw(renderer);
   * ```
   */
  draw(renderer: AcGiRenderer) {
    const points = this._geo.getPoints(100)
    return renderer.lines(points, this.lineStyle)
  }
}
