import { Response } from 'express'

export class ApiResponse {
  static success(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    const response: any = {
      success: true,
      message,
    }
    
    if (data !== null && data !== undefined) {
      response.data = data
    }
    
    return res.status(statusCode).json(response)
  }

  static successUser(res: Response, user: any, message: string = 'Success', statusCode: number = 200) {
    const response: any = {
      success: true,
      message,
    }
    
    if (user !== null && user !== undefined) {
      response.user = user
    }
    
    return res.status(statusCode).json(response)
  }

  static error(res: Response, message: string = 'Error', statusCode: number = 500, details?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(details && { details }),
    })
  }

  static created(res: Response, data: any, message: string = 'Created successfully') {
    const response: any = {
      success: true,
      message,
    }
    
    if (data !== null && data !== undefined) {
      response.data = data
    }
    
    return res.status(201).json(response)
  }

  static createdUser(res: Response, user: any, message: string = 'User created successfully') {
    const response: any = {
      success: true,
      message,
    }
    
    if (user !== null && user !== undefined) {
      response.user = user
    }
    
    return res.status(201).json(response)
  }

  static badRequest(res: Response, message: string = 'Bad request', details?: any) {
    return this.error(res, message, 400, details)
  }

  static unauthorized(res: Response, message: string = 'Unauthorized') {
    return this.error(res, message, 401)
  }

  static forbidden(res: Response, message: string = 'Forbidden') {
    return this.error(res, message, 403)
  }

  static notFound(res: Response, message: string = 'Not found') {
    return this.error(res, message, 404)
  }
}

