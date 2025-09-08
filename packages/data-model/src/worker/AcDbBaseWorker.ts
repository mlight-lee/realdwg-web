/**
 * Base class for worker scripts that handles all message passing
 * Users only need to implement the executeTask method
 */

/// <reference lib="webworker" />

export interface WorkerMessage<TInput = unknown> {
  id: string
  input: TInput
}

export interface WorkerResponse<TOutput = unknown> {
  id: string
  success: boolean
  data?: TOutput
  error?: string
}

/**
 * Base class for worker scripts
 * Handles all message passing - users only need to implement executeTask
 */
export abstract class AcDbBaseWorker<TInput = unknown, TOutput = unknown> {
  constructor() {
    this.setupMessageHandler()
  }

  /**
   * Set up message handler - called automatically
   */
  private setupMessageHandler(): void {
    self.onmessage = async (event: MessageEvent<WorkerMessage<TInput>>) => {
      const { id, input } = event.data

      try {
        const result = await this.executeTask(input)
        this.sendResponse(id, true, result)
      } catch (error) {
        this.sendResponse(id, false, undefined, error instanceof Error ? error.message : String(error))
      }
    }
  }

  /**
   * Send response back to main thread
   */
  private sendResponse(id: string, success: boolean, data?: TOutput, error?: string): void {
    const response: WorkerResponse<TOutput> = {
      id,
      success,
      data,
      error
    }
    
    self.postMessage(response)
  }

  /**
   * Execute the actual task - users must implement this
   * @param input - Input data for the task
   * @returns Promise or direct result
   */
  protected abstract executeTask(input: TInput): Promise<TOutput> | TOutput
}