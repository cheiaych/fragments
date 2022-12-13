// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
const { hasUncaughtExceptionCaptureCallback } = require('process');

const validTypes = [
  `text/plain`,
  `application/json`,
  `text/markdown`,
  `text/html`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
];

class Fragment {

  constructor({ id = randomUUID(), ownerId = '', created = (new Date(Date.now())).toString(), updated = (new Date(Date.now())).toString(), type = '', size = 0 }) {
    // TODO
    if (ownerId && type) {
      try {
        if (validTypes.includes(contentType.parse(type).type)) {
          this.ownerId = ownerId;
          this.type = type;
        }
        else {
          throw new Error('type is invalid');
        }
      }
      catch (err) {
        throw new Error('type is invalid');
      }
    }
    else {
      throw new Error('ownerId and type are required');
    }
    if (Number.isInteger(size) && size >= 0) {
      this.size = size;
    }
    else {
      throw new Error('size must be a number >= 0');
    }
    this.id = id;
    this.created = created;
    this.updated = updated;

    return this;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    const value = await readFragment(ownerId, id);
    if (!value) {
      throw new Error('fragment with id ' + id + 'does not exist');
    }
    else {
      return new Fragment(value);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static async delete(ownerId, id) {
    // TODO
    return await deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // TODO
    this.updated = (new Date(Date.now())).toString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    // TODO
    return readFragmentData(this.ownerId, this.id)
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    // TODO
    if (data.length == 0) {
      throw new Error('buffer must be given for setData()');
    }
    else
    {
      this.updated = (new Date(Date.now())).toString();
      this.size = data.length;

      const dataCopy = data;
      return writeFragmentData(this.ownerId, this.id, dataCopy)
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    // TODO
    return (contentType.parse(this.type).type.startsWith('text/'))
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    return validTypes;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // TODO
    try {
      if (validTypes.includes(contentType.parse(value).type)) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (err) {
      return false;
    }
  }
}

module.exports.Fragment = Fragment;
