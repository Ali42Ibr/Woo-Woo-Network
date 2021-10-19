const promiseWrapper = async (promise) => {
  let rejected = Symbol();
  let result = await promise.catch((err) => {
    console.log(err);
    return {
      [rejected]: true,
      error: err,
    };
  });
  if (result && result[rejected]) {
    throw result.error;
  } else {
    return result;
  }
};

export { promiseWrapper };
