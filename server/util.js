module.exports = {
  successResponse: data => {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  },

  errorResponse: (statusCode, message) => {
    return {
      statusCode: statusCode || 501, // 501 Not Implemented
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        status: 'error',
        statusCode,
        message: message,
      }),
    };
  },
};
