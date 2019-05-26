export const RECEIVED_ERROR = 'RECEIVED_ERROR'
export const READ_ERROR = 'READ_ERROR'

export function receivedError(error) {
  return {
    type: RECEIVED_ERROR,
    error
  }
}

export function readError(id) {
  return {
    type: READ_ERROR,
    id
  }
}