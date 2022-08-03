export interface Post {
  _id: string
  _createdAt: string
  publishedAt: string
  title: string
  description: string
  comments: Comment[]
  categories: Category[]
  author: {
    name: string
    url: string
    image: string
  }
  mainImage: {
    asset: {
      url: string
    }
  }
  slug: {
    current: string
  }
  body: [object]
}

export interface Category {
  _id: string
  title: string
}

export interface Comment {
  approved: boolean
  comment: string
  email: string
  name: string
  post: {
    _ref: string
    _type: string
  }
  _createdAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
}
