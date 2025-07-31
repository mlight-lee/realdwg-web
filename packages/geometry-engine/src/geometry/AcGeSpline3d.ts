import { AcCmErrors } from '@mlightcad/common'

import {
  AcGeBox3d,
  AcGeMatrix3d,
  AcGePoint3d,
  AcGePoint3dLike,
  AcGePointLike
} from '../math'
import {
  calculateCurveLength,
  evaluateNurbsPoint,
  generateChordKnots,
  generateSqrtChordKnots,
  generateUniformKnots,
  interpolateControlPoints
} from '../util'
import { AcGeCurve3d } from './AcGeCurve3d'

export type AcGeKnotParameterizationType = 'Uniform' | 'Chord' | 'SqrtChord'

/**
 * Lightweight NURBS curve implementation
 */
class NurbsCurve {
  private _degree: number
  private _knots: number[]
  private _controlPoints: number[][]
  private _weights: number[]

  constructor(
    degree: number,
    knots: number[],
    controlPoints: number[][],
    weights?: number[]
  ) {
    this._degree = degree
    this._knots = [...knots]
    this._controlPoints = controlPoints.map(p => [...p])
    this._weights = weights
      ? [...weights]
      : new Array(controlPoints.length).fill(1.0)
  }

  degree(): number {
    return this._degree
  }

  knots(): number[] {
    return [...this._knots]
  }

  controlPoints(): number[][] {
    return this._controlPoints.map(p => [...p])
  }

  weights(): number[] {
    return [...this._weights]
  }

  /**
   * Calculate a point on the curve at parameter u
   */
  point(u: number): number[] {
    return evaluateNurbsPoint(
      u,
      this._degree,
      this._knots,
      this._controlPoints,
      this._weights
    )
  }

  /**
   * Calculate curve length using numerical integration
   */
  length(): number {
    return calculateCurveLength(
      this._degree,
      this._knots,
      this._controlPoints,
      this._weights
    )
  }

  /**
   * Create a NURBS curve from control points and knots
   */
  static byKnotsControlPointsWeights(
    degree: number,
    knots: number[],
    controlPoints: number[][],
    weights?: number[]
  ): NurbsCurve {
    return new NurbsCurve(degree, knots, controlPoints, weights)
  }

  /**
   * Create a NURBS curve from fit points using interpolation
   */
  static byPoints(
    points: number[][],
    degree: number,
    parameterization: AcGeKnotParameterizationType = 'Uniform'
  ): NurbsCurve {
    // Generate knots based on parameterization type
    let knots: number[]
    switch (parameterization) {
      case 'Chord':
        knots = generateChordKnots(degree, points)
        break
      case 'SqrtChord':
        knots = generateSqrtChordKnots(degree, points)
        break
      case 'Uniform':
      default:
        knots = generateUniformKnots(degree, points.length)
        break
    }

    // Generate control points from fit points
    const controlPoints = interpolateControlPoints(points)
    const weights = new Array(controlPoints.length).fill(1.0)

    return new NurbsCurve(degree, knots, controlPoints, weights)
  }
}

export class AcGeSpline3d extends AcGeCurve3d {
  private _nurbsCurve: NurbsCurve
  private _fitPoints?: AcGePointLike[]
  private _knotParameterization?: AcGeKnotParameterizationType
  private _controlPoints: AcGePointLike[]
  private _closed: boolean
  private _originalControlPoints?: AcGePointLike[]
  private _originalKnots?: number[]
  private _originalWeights?: number[]

  constructor(
    controlPoints: AcGePointLike[],
    knots: number[],
    weights?: number[]
  )
  constructor(
    fitPoints: AcGePointLike[],
    knotParam: AcGeKnotParameterizationType
  )
  constructor(a?: unknown, b?: unknown, c?: unknown) {
    super()
    const argsLength =
      +(a !== undefined) + +(b !== undefined) + +(c !== undefined)

    if (argsLength != 2 && argsLength != 3) {
      throw AcCmErrors.ILLEGAL_PARAMETERS
    }

    // For now, we support 3 degree only
    const degree = 3
    this._closed = false

    if (argsLength == 2 && !Array.isArray(b)) {
      this._fitPoints = a as AcGePointLike[]
      this._knotParameterization = b as AcGeKnotParameterizationType

      // Validate minimum number of fit points for degree 3
      if (this._fitPoints.length < 4) {
        throw AcCmErrors.ILLEGAL_PARAMETERS
      }

      const points = this.toNurbsPoints(this._fitPoints)
      this._nurbsCurve = NurbsCurve.byPoints(
        points,
        degree,
        this._knotParameterization
      )
      this._controlPoints = this.toGePoints(this._nurbsCurve.controlPoints())

      // Store original data for potential reopening
      this._originalControlPoints = [...this._controlPoints]
      this._originalKnots = [...this._nurbsCurve.knots()]
      this._originalWeights = [...this._nurbsCurve.weights()]
    } else {
      this._controlPoints = a as AcGePointLike[]

      // Validate minimum number of control points for degree 3
      if (this._controlPoints.length < 4) {
        throw AcCmErrors.ILLEGAL_PARAMETERS
      }

      const points = this.toNurbsPoints(this._controlPoints)
      this._nurbsCurve = NurbsCurve.byKnotsControlPointsWeights(
        degree,
        b as number[],
        points,
        c as number[] | undefined
      )

      // Store original data for potential reopening
      this._originalControlPoints = [...this._controlPoints]
      this._originalKnots = [...this._nurbsCurve.knots()]
      this._originalWeights = c
        ? [...(c as number[])]
        : new Array(this._controlPoints.length).fill(1.0)
    }
  }

  /**
   * Set the closed property and rebuild the curve if necessary
   */
  private setClosed(closed: boolean) {
    if (this._closed === closed) {
      return
    }

    this._closed = closed
    this._boundingBoxNeedsUpdate = true

    if (closed) {
      this.makeClosed()
    } else {
      this.makeOpen()
    }
  }

  /**
   * Make the spline closed by adding control points and adjusting knots
   */
  private makeClosed() {
    const degree = this._nurbsCurve.degree()
    const originalControlPoints = this._nurbsCurve.controlPoints()
    const originalWeights = this._nurbsCurve.weights()
    const n = originalControlPoints.length

    // Append the first 'degree' control points to the end for periodicity
    const closedControlPoints = [
      ...originalControlPoints,
      ...originalControlPoints.slice(0, degree)
    ]
    const closedWeights = [
      ...originalWeights,
      ...originalWeights.slice(0, degree)
    ]

    // Create a periodic (non-clamped) uniform knot vector
    const closedKnots = this.createClosedKnotVector(n, degree)

    // Create new NURBS curve
    this._nurbsCurve = NurbsCurve.byKnotsControlPointsWeights(
      degree,
      closedKnots,
      closedControlPoints,
      closedWeights
    )

    this._controlPoints = this.toGePoints(closedControlPoints)
  }

  /**
   * Make the spline open by restoring the original curve
   */
  private makeOpen() {
    if (
      !this._originalControlPoints ||
      !this._originalKnots ||
      !this._originalWeights
    ) {
      throw new Error('Original curve data not available')
    }

    const degree = this._nurbsCurve.degree()
    const originalPoints = this.toNurbsPoints(this._originalControlPoints)

    // Create new NURBS curve with original data
    this._nurbsCurve = NurbsCurve.byKnotsControlPointsWeights(
      degree,
      this._originalKnots,
      originalPoints,
      this._originalWeights
    )

    this._controlPoints = [...this._originalControlPoints]
  }

  /**
   * Create periodic knot vector for closed curve
   */
  private createClosedKnotVector(n: number, degree: number): number[] {
    // For periodic B-spline: knots go from 0 to n (not n+degree+1), no repeated knots at ends
    // Number of knots = n + 2*degree + 1
    const m = n + 2 * degree + 1
    const knots: number[] = []
    for (let i = 0; i < m; i++) {
      knots.push(i)
    }
    return knots
  }

  /**
   * Degree of the spline to be created.
   */
  get degree() {
    return this._nurbsCurve.degree()
  }

  get knotParameterization() {
    return this._knotParameterization
  }

  /**
   * The start point of this spline
   */
  get startPoint(): AcGePoint3d {
    const knots = this._nurbsCurve.knots()
    const degree = this._nurbsCurve.degree()
    const startParam = knots[degree]
    const startPoint = this._nurbsCurve.point(startParam)
    return new AcGePoint3d(startPoint[0], startPoint[1], startPoint[2])
  }

  /**
   * The end point of this spline
   */
  get endPoint(): AcGePoint3d {
    if (this._closed) {
      // For closed splines, the end point should be the same as the start point
      return this.startPoint
    }

    const knots = this._nurbsCurve.knots()
    const degree = this._nurbsCurve.degree()
    const endParam = knots[knots.length - degree - 1]
    const endPoint = this._nurbsCurve.point(endParam)
    return new AcGePoint3d(endPoint[0], endPoint[1], endPoint[2])
  }

  /**
   * @inheritdoc
   */
  get length() {
    return this._nurbsCurve.length()
  }

  /**
   * Return the value of the control point at position index in the list of control points.
   * If index is negative or more than the number of control points in the spline, then point
   * is set to the last control point.
   * @param index Input index (0 based) of point to get
   * @returns
   */
  getFitPointAt(index: number): AcGePoint3dLike {
    if (!this._fitPoints) {
      throw new Error('No fit points in this spline')
    }
    const length = this._fitPoints.length
    const newIndex = index < 0 || index >= length ? length - 1 : index
    const point = this._fitPoints[newIndex]
    return { x: point.x, y: point.y, z: point.z || 0 }
  }

  /**
   * Return the value of the control point at position index in the list of control points.
   * If index is negative or more than the number of control points in the spline, then point
   * is set to the last control point.
   * @param index Input index (0 based) of point to get
   * @returns
   */
  getControlPointAt(index: number) {
    const length = this._controlPoints.length
    const newIndex = index < 0 || index >= length ? length - 1 : index
    return this._controlPoints[newIndex]
  }

  /**
   * Divide this spline into the specified number of points
   * those points as an array of points.
   * @param numPoints Input the number of points returned
   * @returns Return an array of point
   */
  getPoints(numPoints: number = 100): AcGePoint3d[] {
    const curve = this._nurbsCurve
    const points: AcGePoint3d[] = []
    const knots = curve.knots()
    const degree = curve.degree()
    const startParam = knots[degree]
    const endParam = knots[knots.length - degree - 1]

    if (this._closed) {
      // Sample numPoints-1 points, then append the first point to close the loop
      const period = endParam - startParam
      const step = period / (numPoints - 1)
      for (let i = 0; i < numPoints - 1; i++) {
        const t = startParam + i * step
        const pt = curve.point(t)
        points.push(new AcGePoint3d(pt[0], pt[1], pt[2]))
      }
      // Append the first point to close the loop
      points.push(points[0])
    } else {
      const step = (endParam - startParam) / (numPoints - 1)
      for (let i = 0; i < numPoints; i++) {
        const t = i === numPoints - 1 ? endParam : startParam + i * step
        const pt = curve.point(t)
        points.push(new AcGePoint3d(pt[0], pt[1], pt[2]))
      }
    }
    return points
  }

  getCurvePoints(curve: NurbsCurve, count: number) {
    const points = []
    const knots = curve.knots() // Get the knot vector from the curve

    // The valid parameter range is between knots[degree] and knots[knots.length - degree - 1]
    const startParam = knots[3]
    const endParam = knots[knots.length - 4]

    const step = (endParam - startParam) / (count - 1) // Adjust step size for correct range

    for (let i = 0; i < count; i++) {
      const t = startParam + i * step // Map t to the correct parameter space
      points.push(curve.point(t)) // Sample the curve at the mapped parameter t
    }

    return points
  }

  /**
   * @inheritdoc
   */
  calculateBoundingBox() {
    const points = this.getPoints(100)
    return new AcGeBox3d().setFromPoints(points)
  }

  get closed() {
    return this._closed
  }
  set closed(value: boolean) {
    this.setClosed(value)
  }

  /**
   * @inheritdoc
   */
  transform(_matrix: AcGeMatrix3d) {
    // TODO: Implement this method
    this._boundingBoxNeedsUpdate = true
    return this
  }

  /**
   * Convert input points to points in NURBS format
   * @param points Input points to convert
   * @returns Return converted points
   */
  private toNurbsPoints(points: AcGePointLike[]): number[][] {
    const nurbsPoints = new Array(points.length)
    points.forEach((point, index) => {
      nurbsPoints[index] = [point.x, point.y, point.z || 0]
    })
    return nurbsPoints
  }

  /**
   * Convert input points to points in geometry engine format
   * @param points Input points to convert
   * @returns Return converted points
   */
  private toGePoints(points: number[][]): AcGePoint3dLike[] {
    const gePoints = new Array<AcGePoint3dLike>(points.length)
    points.forEach((point, index) => {
      gePoints[index] = { x: point[0], y: point[1], z: point[2] }
    })
    return gePoints
  }
}
