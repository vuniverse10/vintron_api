export class ServiceResponse {
  apiResponse<T>(
    resultContent: T,
    collectionName: string
  ): {
    code: number;
    message: string;
    data: T;
  } {
    const resultStatus =
      resultContent &&
      (Array.isArray(resultContent) || typeof resultContent === "string")
        ? resultContent.length > 0
        : false;

    return {
      code: resultStatus ? 200 : 204,
      message: resultStatus ? `Fetching ${collectionName}` : "No Results Found",
      data: resultStatus ? resultContent : ([] as T),
    };
  }

  workoutPreferenceResponse<T>(
    resultContent: T,
    collectionName: string
  ): {
    code: number;
    message: string;
    data: T;
  } {
    const resultStatus = 200;
    return {
      code: resultStatus ? 200 : 204,
      message: resultStatus ? `Fetching ${collectionName}` : "No Results Found",
      data: resultStatus ? resultContent : ([] as T),
    };
  }

  errorResponse<T>(collectionName: string): {
    code: number;
    message: string;
    data: [];
  } {
    const resultStatus = 204;
    return {
      code: resultStatus,
      message: `No results found in ${collectionName}`,
      data: [],
    };
  }

  singleRecordResponse<T>(
    resultContent: T,
    collectionName: string
  ): {
    code: number;
    message: string;
    data: T;
  } {
    const resultStatus = resultContent ? true : false;

    return {
      code: resultStatus ? 200 : 204,
      message: resultStatus ? `Fetching ${collectionName}` : "No Results Found",
      data: resultStatus ? resultContent : ([] as T),
    };
  }
}
