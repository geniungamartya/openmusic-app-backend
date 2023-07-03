const ClientError = require('../../exceptions/ClientError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const songId = await this._service.addSong(request.payload);

      const response = h.response({
        status: 'success',
        message: 'song added',
        data: {
          songId,
        },
      });
      response.code(201);

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(400);

        return response;
      };

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);

      return response;
    };
  };

  async getSongsHandler(request) {
    const params = request.query;
    const songs = await this._service.getSongs(params);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  };

  async getSongByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(404);

        return response;
      };

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);

      return response;
    };
  };

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {id} = request.params;
      await this._service.editSongById(id, request.payload);

      return {
        status: 'success',
        message: 'Song Edited',
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(404);

        return response;
      } else if (error instanceof InvariantError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(400);

        return response;
      };

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);

      return response;
    };
  };

  async deleteSongByIdHandler(request, h) {
    try {
      const {id} = request.params;
      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Song deleted',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(404);

        return response;
      };

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);

      return response;
    };
  };
};

module.exports = SongHandler;