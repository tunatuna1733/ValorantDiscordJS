// this function should be called in the catch block of the caller's try-catch
export const handleError = async (error: any) => {
  const error_object = error as Error;
  // TODO: change it to discord webhook or something
  console.error(error_object.name, error_object.message);
};
