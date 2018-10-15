const handleError = (error) => {
    const { status, response } = error;

    switch (status) {
      case 401:
        break;
        // do something when you're unauthenticated
      case 403:
        break;
        // do something when you're unauthorized to access a resource
      case 500:
      break;
        // do something when your server exploded
      default:
        break;
        // handle normal errors with some alert or whatever
    }

    return response;
  }

  export default handleError;