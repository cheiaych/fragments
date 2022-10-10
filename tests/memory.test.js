const index = require("../src/model/data/memory/index.js");

describe('Testing model/data/memory/index.js', () => {

  test('writeFragment should return a promise', async () => {
    const fragment = {
      ownerId: 'a',
      id: 'b'
    }
    await expect(index.writeFragment(fragment)).resolves.not.toThrow();

  });

  test('readFragment should return a promise', async () => {
    //await expect(index.readFragment('a', 'b')).toBe('abc');
    await expect(index.readFragment('a', 'b')).resolves.not.toThrow();
  });

  test('writeFragmentData should return a promise', async () => {
    const data = Buffer.from('abc');
    await expect(index.writeFragmentData('a', 'b', data)).resolves.not.toThrow();
  });

  test('readFragmentData should return a promise', async () => {
    await expect(index.readFragmentData('a', 'b')).resolves.not.toThrow();
  });
})

//test similar to \tests\unit\memory-db.test.js
