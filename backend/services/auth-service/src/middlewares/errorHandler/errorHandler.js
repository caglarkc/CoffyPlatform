// middleware/errorHandler/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // HTTP durum kodları
    const statusCodes = {
        ValidationError: 400,
        AuthError: 401,
        NotFoundError: 404,
        DatabaseError: 500
    };

    // Sadece hata mesajını konsola yazdır, stack trace olmadan
    console.error(`Hata: ${err.message}`);

    const response = {
        success: false,
        status: statusCodes[err.name] || err.statusCode || 500,
        message: err.message,
        details: err.details || null,
        type: err.type || null,
        timestamp: new Date().toISOString()
    };

    // Development ortamında bile stack trace'i konsola yazdırmıyoruz
    // if (process.env.NODE_ENV === 'development') {
    //     console.debug('Stack trace:', err.stack);
    //     response.stack = err.stack;
    // }

    res.status(response.status).json(response);
};

module.exports = errorHandler; 