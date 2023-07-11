export class UnknownError extends Error {
  constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}
export class ResourceNotFoundError extends Error {}
export class UnknownAPIError extends UnknownError {}
export class UserNotRegistered extends Error {}
export class DatabaseTransactionError extends Error {
  constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}
export class ImageGenerationError extends Error {}

// this function should be called in the catch block of the caller's try-catch
export const reportError = async (error: any) => {
  const error_object = error as Error;
  // TODO: change it to discord webhook or something
  console.error(error_object.name, error_object.message);
};
