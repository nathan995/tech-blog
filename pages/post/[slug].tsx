import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Comment, Post } from '../../types'
import { useForm, SubmitHandler } from 'react-hook-form'

interface Props {
  post: Post
}
interface IComment {
  _id: string
  comment: string
  email: string
  name: string
}

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [comments, setComments] = useState<IComment[]>(post.comments)
  console.log(post)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        const comment: IComment = { ...data }
        setComments([...comments, comment])
        setSubmitted(true)
        console.log(data)
      })
      .catch((err) => console.log(err))
  }
  return (
    <main className="w-fit md:w-full">
      <Header />
      <img
        className="mx-auto max-w-3xl object-cover "
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="w-fit p-5 md:mx-auto md:max-w-3xl">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        {/* <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2> */}
        <div className="mt-10 flex items-center space-x-2">
          <a
            href={post.author.url}
            target="_blank"
            // className="cursor-pointer"
          >
            <img
              className="h-10 w-10 rounded-full"
              src={urlFor(post.author.image).url()}
              alt=""
            />
          </a>
          <p className="text-sm font-extralight">
            Blog post by -
            <a
              href={post.author.url}
              target="_blank"
              // className="cursor-pointer"
            >
              {' '}
              <span className="text-green-500"> {post.author.name} </span>
            </a>{' '}
            - Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className="text-lg  leading-9"
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              normal: ({ children }: any) => <p className="mb-3">{children}</p>,
              link: ({ href, children }: any) => (
                <a href={href} className="text-green-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <div
        className="my-10 mx-auto flex max-w-2xl flex-col space-y-2
      rounded-lg p-10 shadow shadow-green-500"
      >
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {comments.map((comment) => (
          <div className="" key={comment._id}>
            <p>
              <span className="text-green-500">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
      {/*<hr className="my-5 mx-auto max-w-lg border border-green-500" />*/}
      {submitted ? (
        <div className="my-10 mx-auto flex max-w-2xl flex-col rounded-lg bg-green-500 p-10 text-white">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
        </div>
      ) : (
        <form
          //@ts-ignore
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="mt-2 py-3" />
          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt1 block w-full rounded border py-2 px-3 shadow outline-none ring-green-500 focus:ring"
              type="text"
              placeholder="Name"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt1 block w-full rounded border py-2 px-3 shadow outline-none ring-green-500 focus:ring"
              type="email"
              placeholder="name@email.com"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-green-500 focus:ring  "
              placeholder="Comment"
              rows={8}
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">The field name is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">The field email is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                The field comment is required
              </span>
            )}
          </div>
          <input
            type="submit"
            className="focus:shadow-outline cursor-pointer rounded bg-green-500
          py-2 px-4 font-bold text-white shadow hover:bg-green-400 focus:outline-none"
          />
        </form>
      )}
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[ _type == 'post']{
    _id, 
  slug {
      current
  }
  }`
  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[ _type == 'post' && slug.current == $slug ][0]{
    _id,
    _createdAt,
   title,
    author->{
    name,
    url,
    image
  },
  'comments': *[
    _type=='comment'&&
    post._ref == ^._id&&
    approved==true
  ],
  description,
  mainImage,
  slug,
  publishedAt,
  body
  }`
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return { notFound: true }
  }
  return {
    props: {
      post,
    },
    // revalidate: 60,
  }
}
