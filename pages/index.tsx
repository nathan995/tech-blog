import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import { CategoryButton } from '../components/CategoryButton'
import { CategoryButtonSelected } from '../components/CategoryButtonSelected'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post, Category } from '../types'

interface Props {
  posts: [Post]
  categories: [Category]
}

const Home = ({ posts, categories }: Props) => {
  console.log(posts)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts)
  useEffect(() => {
    if (selectedCategories.length == 0) {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(
        posts.filter((post) =>
          post.categories.some((category) =>
            selectedCategories.some((x) => x._id == category._id)
          )
        )
      )
    }
  }, [selectedCategories])

  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Banner />
      <div className="mx-2 mt-5 mb-3  flex overflow-x-scroll scrollbar-hide md:mx-7 md:justify-center">
        {selectedCategories.length == 0 ? (
          <CategoryButtonSelected
            category={{ _id: 'all', title: 'All' }}
            onPress={() => null}
          />
        ) : (
          <CategoryButton
            category={{ _id: 'all', title: 'All' }}
            onPress={() => setSelectedCategories([])}
          />
        )}
        {categories.map((category) => {
          return selectedCategories.includes(category) ? (
            <CategoryButtonSelected
              category={category}
              onPress={() =>
                setSelectedCategories([
                  ...selectedCategories.filter((tag) => tag != category),
                ])
              }
            />
          ) : (
            <CategoryButton
              category={category}
              onPress={() =>
                setSelectedCategories([...selectedCategories, category])
              }
            />
          )
        })}
      </div>
      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer overflow-hidden rounded-lg border">
              <img
                className="h-60 w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                src={urlFor(post.mainImage).url()}
                alt=""
              />
              <div className="flex justify-between bg-white p-5">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>

                  <p className="text-base text-gray-400">{post.author.name}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const postsQuery = `*[ _type == 'post']{
    _id,
   title,
    author->{
    name,
    image
  },
  categories[]->{
    _id,
    title
  },
  description,
  mainImage,
  slug,
  body
  }`
  const categoriesQuery = `*[ _type == 'category']{
    _id,
    title
  }`
  const posts = await sanityClient.fetch(postsQuery)
  const categories = await sanityClient.fetch(categoriesQuery)

  return {
    props: {
      posts,
      categories,
    },
  }
}
