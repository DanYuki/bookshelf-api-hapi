const handler = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: handler.storeBook,
    },
    {
        method: 'GET',
        path: '/books',
        handler: handler.getAllBooks,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: handler.getBookById,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: handler.editBookById,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: handler.deleteBookById,
    },
];

module.exports = routes;
