const { nanoid } = require('nanoid');
const books = require('./books');

const storeBook = (req, h) => {
    // Handle storing book
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;

    if (!name || name.trim() === '') {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const id = nanoid(16);
    const finished = readPage === pageCount;
    const insertedAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);
    // res.send(books);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
    }

    return h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    }).code(500);
};

const getAllBooks = (req, h) => {
    // Get all book data
    const { name, reading, finished } = req.query;

    let filteredBooks = books;

    if (name) {
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase()
        .includes(name.toLowerCase()));
    }

    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter(
            (book) => book.reading === (reading === '1'),
        );
    }

    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter(
            (book) => book.finished === (finished === '1'),
        );
    }

    return h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    }).code(200);
};

const getBookById = (req, h) => {
    // Get specific book data by bookId
    const { id } = req.params;

    const book = books.filter((b) => b.id === id)[0];

    if (book !== undefined) {
        return h.response({
            status: 'success',
            data: {
                book,
            },
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
};

const editBookById = (req, h) => {
    const { id } = req.params;

    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;
    const updatedAt = new Date().toISOString();

    if (!name || name.trim() === '') {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }).code(200);
    }
    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
};

const deleteBookById = (req, h) => {
    // Delete a book by bookId
    const { id } = req.params;

    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
    }
    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
};

module.exports = {
    storeBook,
    getAllBooks,
    getBookById,
    editBookById,
    deleteBookById,
};
