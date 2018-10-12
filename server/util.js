module.exports = {
  
  successResponse: (data) => {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        status: 'success',
        data: data,
      }),
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
        message: message
      }),
    };
  },

}