export const allocateRoute = (status: any) => {
  switch (status) {
    case "": {
    }
  }
};

export const checkRequestSuccess = (response: any) => {
  return response?.status === 200;
};

export const checkRequestInvalidToken = (response: any) => {
  return response?.status !== 200;
};

export const getErrorMessage = (error: any) => {
  return error.response?.data?.message || error.message;
};
