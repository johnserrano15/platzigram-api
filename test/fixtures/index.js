// Todos estos datos son falsos de prueba.
export default {
  getImage () {
    return {
      id: 'fo7PJkN0RmMw',
      publicId: 'fo7PJkN0RmMwfo7PJkN0RmMw',
      userId: 'platzigram',
      liked: false,
      likes: 0,
      src: 'http://platzigram.test/fo7PJkN0RmMw.jpg',
      description: '#awesome',
      tags: ['awesome'],
      createdAt: new Date().toString()
    }
  },

  getImages () {
    return [
      this.getImage(),
      this.getImage(),
      this.getImage()
    ]
  },

  getImagesByTag () {
    return [
      this.getImage(),
      this.getImage()
    ]
  },

  getUser () {
    return {
      id: 'fo7PJkN0RmMw876',
      name: 'John Andrey',
      username: 'jandrey',
      email: 'ja@johnserrano.test',
      password: 'ja1234',
      createdAt: new Date().toString()
    }
  }
}
