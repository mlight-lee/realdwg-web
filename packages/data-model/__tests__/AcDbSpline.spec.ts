import { AcDbSpline } from '../src/entity/AcDbSpline'
import { AcGeKnotParameterizationType } from '@mlightcad/geometry-engine'
import { AcCmErrors } from '@mlightcad/common'

describe('AcDbSpline', () => {
  describe('Constructor', () => {
    it('should create spline from control points', () => {
      const controlPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 1, z: 0 }
      ]
      const knots = [0, 0, 0, 0, 1, 1, 1, 1]

      const spline = new AcDbSpline(controlPoints, knots)

      expect(spline.closed).toBe(false)
      expect(spline.geometricExtents).toBeDefined()
    })

    it('should create spline from control points with custom degree', () => {
      const controlPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 1, z: 0 },
        { x: 4, y: 0, z: 0 }
      ]
      const knots = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
      const degree = 4

      const spline = new AcDbSpline(controlPoints, knots, undefined, degree)

      expect(spline.closed).toBe(false)
      expect(spline.geometricExtents).toBeDefined()
    })

    it('should create spline from control points with degree and closed', () => {
      const controlPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 1, z: 0 }
      ]
      const knots = [0, 0, 0, 0, 1, 1, 1, 1]
      const degree = 3
      const closed = true

      const spline = new AcDbSpline(controlPoints, knots, undefined, degree, closed)

      expect(spline.closed).toBe(true)
      expect(spline.geometricExtents).toBeDefined()
    })

    it('should create spline from fit points', () => {
      const fitPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 1, z: 0 }
      ]
      const parameterization: AcGeKnotParameterizationType = 'Uniform'

      const spline = new AcDbSpline(fitPoints, parameterization)

      expect(spline.closed).toBe(false)
      expect(spline.geometricExtents).toBeDefined()
    })

    it('should create spline from fit points with custom degree', () => {
      const fitPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 1, z: 0 },
        { x: 4, y: 0, z: 0 }
      ]
      const parameterization: AcGeKnotParameterizationType = 'Uniform'
      const degree = 4

      const spline = new AcDbSpline(fitPoints, parameterization, degree)

      expect(spline.closed).toBe(false)
      expect(spline.geometricExtents).toBeDefined()
    })

    it('should create spline from fit points with degree and closed', () => {
      const fitPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 1, z: 0 }
      ]
      const parameterization: AcGeKnotParameterizationType = 'Uniform'
      const degree = 3
      const closed = true

      const spline = new AcDbSpline(fitPoints, parameterization, degree, closed)

      expect(spline.closed).toBe(true)
      expect(spline.geometricExtents).toBeDefined()
    })

    it('should throw error for insufficient arguments', () => {
      expect(() => {
        // @ts-ignore - Testing invalid constructor call
        new AcDbSpline([{ x: 0, y: 0, z: 0 }])
      }).toThrow(AcCmErrors.ILLEGAL_PARAMETERS)
    })

    it('should throw error for too many arguments', () => {
      const controlPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 1, z: 0 }
      ]
      const knots = [0, 0, 0, 0, 1, 1, 1, 1]

      expect(() => {
        // @ts-ignore - Testing invalid constructor call
        new AcDbSpline(controlPoints, knots, undefined, 3, false, 'extra')
      }).toThrow(AcCmErrors.ILLEGAL_PARAMETERS)
    })
  })

  describe('Properties', () => {
    let spline: AcDbSpline

    beforeEach(() => {
      const controlPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 1, z: 0 }
      ]
      const knots = [0, 0, 0, 0, 1, 1, 1, 1]
      spline = new AcDbSpline(controlPoints, knots)
    })

    it('should return geometric extents', () => {
      const extents = spline.geometricExtents
      expect(extents).toBeDefined()
      expect(extents.min).toBeDefined()
      expect(extents.max).toBeDefined()
    })

    it('should handle closed property', () => {
      expect(spline.closed).toBe(false)

      spline.closed = true
      expect(spline.closed).toBe(true)

      spline.closed = false
      expect(spline.closed).toBe(false)
    })
  })

  describe('Drawing', () => {
    it('should draw spline', () => {
      const controlPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 1, z: 0 }
      ]
      const knots = [0, 0, 0, 0, 1, 1, 1, 1]
      const spline = new AcDbSpline(controlPoints, knots)

      // Mock renderer
      const mockRenderer = {
        lines: jest.fn().mockReturnValue({})
      }

      const result = spline.draw(mockRenderer as any)
      expect(result).toBeDefined()
      expect(mockRenderer.lines).toHaveBeenCalled()
    })
  })
})
