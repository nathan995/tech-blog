import React, { MouseEventHandler } from 'react'
import { Category } from '../types'

export function CategoryButton({
  category,
  onPress,
}: {
  category: Category
  onPress: MouseEventHandler
}) {
  return (
    <div
      className="mr-3 cursor-pointer rounded-lg border px-4 py-2"
      onClick={onPress}
    >
      <p className="whitespace-nowrap" key={category._id}>
        {category.title}
      </p>
    </div>
  )
}
